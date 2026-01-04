/**
 * PathProcessor Processor
 *
 * Converts the user drawn path into a Skia path.
 */

import { Skia, SkPath } from "@shopify/react-native-skia"
import { BrushSettings, PathPoint } from "../types/DrawingTypes"
import {
	DrawingTool,
	getDrawingSizePreset,
	getEraserSizePreset,
	isDrawingTool,
	isEraserTool,
	ToolType,
} from "../../../types/tools"

// Smooth a vertex array with quadratic curves
const quadToPoints = (path: SkPath, verts: { x: number; y: number }[]) => {
	if (verts.length < 2) return

	for (let i = 0; i < verts.length - 1; i++) {
		const curr = verts[i]
		const next = verts[i + 1]

		// Midpoint for smooth curve
		const mx = (curr.x + next.x) / 2
		const my = (curr.y + next.y) / 2

		path.quadTo(curr.x, curr.y, mx, my)
	}

	// Connect to the final vertex exactly
	const last = verts[verts.length - 1]
	const secondLast = verts[verts.length - 2]
	path.quadTo(secondLast.x, secondLast.y, last.x, last.y)
}

export const toSkiaPath = (
	points: PathPoint[],
	brush: BrushSettings,
	width: number,
	height: number
): SkPath | null => {
	if (points.length === 0) return null

	const path = Skia.Path.Make()

	const tool: ToolType = brush.type

	let minWidth: number = 0
	let maxWidth: number = 0

	if (isDrawingTool(tool)) {
		const preset = getDrawingSizePreset(tool as DrawingTool, brush.sizePresetIndex)
		minWidth = preset.minWidth
		maxWidth = preset.maxWidth
	} else if (isEraserTool(tool)) {
		const size = getEraserSizePreset(brush.sizePresetIndex)
		minWidth = size
		maxWidth = size
	}

	// Simulate a dot using a tiny line.
	if (points.length < 2) {
		const p = points[0]
		const w = minWidth * width + p.pressure * (maxWidth - minWidth) * width
		path.addCircle(p.x * width, p.y * height, w / 4)
		return path
	}

	// Width per point.
	const widths = points.map((p) => minWidth * width + p.pressure * (maxWidth - minWidth) * width)

	// Create empty arrays for left and right vertices to create a polygon.
	const leftVerts: { x: number; y: number }[] = []
	const rightVerts: { x: number; y: number }[] = []

	for (let i = 0; i < points.length; i++) {
		const p = points[i]

		// Width: first point takes second point's width to prevent weird sizes at the first point.
		const w = i === 0 ? widths[1] / 2 : widths[i] / 2

		// Compute normal
		let dx, dy
		if (i === 0) {
			dx = points[1].x - points[0].x
			dy = points[1].y - points[0].y
		} else {
			dx = points[Math.min(i + 1, points.length - 1)].x - points[i - 1].x
			dy = points[Math.min(i + 1, points.length - 1)].y - points[i - 1].y
		}

		dx *= width
		dy *= height
		let len = Math.sqrt(dx * dx + dy * dy)
		if (len < 0.001) len = 1
		dx /= len
		dy /= len

		const nx = -dy
		const ny = dx

		leftVerts.push({ x: p.x * width - nx * w, y: p.y * height - ny * w })
		rightVerts.push({ x: p.x * width + nx * w, y: p.y * height + ny * w })
	}

	// Build polygon path
	path.moveTo(leftVerts[0].x, leftVerts[0].y)
	quadToPoints(path, leftVerts)

	const reversed = rightVerts.slice().reverse()
	quadToPoints(path, reversed)

	path.close()

	// Create circles to cap off the ends.
	const startRadius = widths[1] / 2
	const endRadius = widths[widths.length - 1] / 2

	path.addCircle(points[0].x * width, points[0].y * height, startRadius)
	path.addCircle(
		points[points.length - 1].x * width,
		points[points.length - 1].y * height,
		endRadius
	)

	return path
}
