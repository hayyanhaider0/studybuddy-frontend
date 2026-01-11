/**
 * PathProcessor Processor
 *
 * Converts the user drawn path into a Skia path.
 */

import { Skia, SkPath } from "@shopify/react-native-skia"
import { BrushSettings, PathPoint } from "../types/DrawingTypes"
import { DrawingTool, getDrawingSizePreset, ToolType } from "../../../types/tools"

// Types and Interfaces
type Point = { x: number; y: number } // Simplified point (without pressure)

interface PathConfig {
	tool: ToolType
	points: PathPoint[]
	widths: number[]
	canvasWidth: number
	canvasHeight: number
}

type PathGeneratorFn = (config: PathConfig) => SkPath
type WidthCalculatorFn = (point: PathPoint, index: number, totalPoints: number) => number

interface ToolConfig {
	widthCalculator: WidthCalculatorFn | null
	pathGenerator: PathGeneratorFn
}

/**
 * Check if user drew a closed shape (start and end are close together).
 * @param points - Points in the path.
 * @param canvasWidth - Width of the canvas.
 * @returns True if the path should be closed.
 */
const shouldPathClose = (points: Point[], canvasWidth: number): boolean => {
	if (points.length < 3) return false

	// Calculate distance between first and last points.
	const firstPt = points[0]
	const lastPt = points[points.length - 1]
	const dx = lastPt.x - firstPt.x
	const dy = lastPt.y - firstPt.y
	const dist = Math.sqrt(dx * dx + dy * dy)

	// Threshold: 1% of canvas width.
	const threshold = canvasWidth * 0.01

	return dist < threshold
}

/**
 * Uses curves to connect points in the path.
 *
 * @param path - The path to connect.
 * @param points - Points in the path.
 */
const addQuadCurves = (path: SkPath, points: Point[], shouldClose: boolean): void => {
	if (points.length < 2) return

	for (let i = 0; i < points.length - 1; i++) {
		const curr = points[i]
		const next = points[i + 1]

		const mx = (curr.x + next.x) / 2
		const my = (curr.y + next.y) / 2

		path.quadTo(curr.x, curr.y, mx, my)
	}

	// Connect to final point
	const last = points[points.length - 1]
	const secondLast = points[points.length - 2]
	path.quadTo(secondLast.x, secondLast.y, last.x, last.y)

	// If path should close, connect back to start smoothly
	if (shouldClose) {
		const first = points[0]
		const mx = (last.x + first.x) / 2
		const my = (last.y + first.y) / 2
		path.quadTo(last.x, last.y, mx, my)
		path.quadTo(mx, my, first.x, first.y)
	}
}

/**
 * Used to create a polygon around a Skia path. Allows for pressure-based width variation.
 *
 * @param points - Points in the path.
 * @param widths - Pressure-based widths of each point.
 * @param canvasWidth - Width of the canvas.
 * @param canvasHeight - Height of the canvas.
 * @returns Left and Right side vertices of the polygon.
 */
const createPolygonVerts = (
	points: PathPoint[],
	widths: number[],
	canvasWidth: number,
	canvasHeight: number
) => {
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

		dx *= canvasWidth
		dy *= canvasHeight
		let len = Math.sqrt(dx * dx + dy * dy)
		if (len < 0.001) len = 1
		dx /= len
		dy /= len

		const nx = -dy
		const ny = dx

		leftVerts.push({ x: p.x * canvasWidth - nx * w, y: p.y * canvasHeight - ny * w })
		rightVerts.push({ x: p.x * canvasWidth + nx * w, y: p.y * canvasHeight + ny * w })
	}

	return { leftVerts, rightVerts }
}

/**
 *
 * @param tool - Tool used to draw the path.
 * @param path - Path being rendered.
 * @param points - Points in the path being rendered.
 * @param widths - Pressure-based widths of each point.
 * @param canvasWidth - Width of the canvas.
 * @param canvasHeight - Height of the canvas.
 */
const createEndCaps = (
	tool: ToolType,
	path: SkPath,
	points: PathPoint[],
	widths: number[],
	canvasWidth: number,
	canvasHeight: number
): void => {
	if (tool !== "highlighter") {
		// Add end caps
		const startRadius = widths[1] / 2
		const endRadius = widths[widths.length - 1] / 2

		path.addCircle(points[0].x * canvasWidth, points[0].y * canvasHeight, startRadius)
		path.addCircle(
			points[points.length - 1].x * canvasWidth,
			points[points.length - 1].y * canvasHeight,
			endRadius
		)
	}
}

/**
 * Generate a simple stroked path.
 *
 * @param config - Config used to render the path.
 * @returns A Skia path that uses config.
 */
const generatePath: PathGeneratorFn = (config: PathConfig): SkPath => {
	const { points, widths, canvasWidth, canvasHeight } = config
	const path = Skia.Path.Make()

	if (points.length === 0) return path

	// Create a simple dot
	if (points.length === 1) {
		const p = points[0]
		const w = widths[0]
		path.addCircle(p.x * canvasWidth, p.y * canvasHeight, w / 4)
		return path
	}

	// Convert to canvas coordinates
	const canvasPoints = points.map((p) => ({
		x: p.x * canvasWidth,
		y: p.y * canvasHeight,
	}))

	const shouldClose = shouldPathClose(canvasPoints, canvasWidth)

	path.moveTo(canvasPoints[0].x, canvasPoints[0].y)
	// Add smooth curves through points
	addQuadCurves(path, canvasPoints, shouldClose)

	return path
}

/**
 * Generate a pressure-sensitive polygon path.
 * @param config - Config used to render the path.
 * @returns A Skia polygon path that uses config.
 */
const generatePressureSensitivePath: PathGeneratorFn = (config: PathConfig): SkPath => {
	const { tool, points, widths, canvasWidth, canvasHeight } = config
	const path = Skia.Path.Make()

	if (points.length === 0) return path

	if (points.length === 1) {
		const p = points[0]
		const w = widths[0]
		path.addCircle(p.x * canvasWidth, p.y * canvasHeight, w / 2)
		return path
	}

	const canvasPoints = points.map((p) => ({
		x: p.x * canvasWidth,
		y: p.y * canvasHeight,
	}))

	const shouldClose = shouldPathClose(canvasPoints, canvasWidth)
	const { leftVerts, rightVerts } = createPolygonVerts(points, widths, canvasWidth, canvasHeight)

	// Reverse right verts to walk back up the other side.
	const reversed = rightVerts.slice().reverse()

	if (shouldClose) {
		path.moveTo(leftVerts[0].x, leftVerts[0].y)
		addQuadCurves(path, leftVerts, true)
		path.close() // Close this specific contour.

		// Lift the pen and move to the Right Loop.
		path.moveTo(reversed[0].x, reversed[0].y)
		addQuadCurves(path, reversed, true)
		path.close() // Close this specific contour.
	} else {
		path.moveTo(leftVerts[0].x, leftVerts[0].y)
		addQuadCurves(path, leftVerts, false)

		// Connect the end of Left side to the start of Right side smoothly.
		addQuadCurves(path, reversed, false)
		path.close() // Closes to form a polygon.

		// Only add end caps if user DIDN'T close the shape.
		createEndCaps(tool, path, points, widths, canvasWidth, canvasHeight)
	}

	return path
}

/**
 * Creates a width calculator based on each point's pressure.
 *
 * @param minWidth - Lower limit width of the path.
 * @param maxWidth - Upper limit width of the path.
 * @param canvasWidth - Width of the canvas.
 * @returns A function that calculates the stroke width of the path at each point.
 */
const createWidthCalculator = (
	minWidth: number,
	maxWidth: number,
	canvasWidth: number
): WidthCalculatorFn => {
	return (point: PathPoint) => {
		return minWidth * canvasWidth + point.pressure * (maxWidth - minWidth) * canvasWidth
	}
}

/**
 * Gets the configuration of the current tool.
 * @param brush - Settings of the tool used.
 * @param canvasWidth - Width of the canvas.
 * @returns A width calculator (if path is pressure-sensitive) and a path generator based on the tool.
 */
const getToolConfig = (brush: BrushSettings, canvasWidth: number): ToolConfig => {
	const tool = brush.type // Tool used.

	let widthCalculator: WidthCalculatorFn | null = null
	let pathGenerator: PathGeneratorFn

	switch (tool) {
		// Pen and highlighter are pressure sensitive.
		case "pen":
		case "highlighter":
			pathGenerator = generatePressureSensitivePath
			const preset = getDrawingSizePreset(tool, brush.sizePresetIndex)
			widthCalculator = createWidthCalculator(preset.minWidth, preset.maxWidth, canvasWidth)
			break
		default:
			pathGenerator = generatePath
			break
	}

	return { widthCalculator, pathGenerator }
}

/**
 * Entry point into this processor.
 *
 * @param points - Points in the path.
 * @param brush - Settings of the brush.
 * @param canvasWidth - Width of the canvas.
 * @param canvasHeight - Height of the canvas.
 * @returns A path generator based on the incoming configuration.
 */
export const toSkiaPath = (
	points: PathPoint[],
	brush: BrushSettings,
	canvasWidth: number,
	canvasHeight: number
): SkPath | null => {
	if (points.length === 0) return null

	const { widthCalculator, pathGenerator } = getToolConfig(brush, canvasWidth)

	let widths: number[]

	if (widthCalculator) {
		widths = points.map((p, i) => widthCalculator(p, i, points.length))
	} else {
		widths = [getDrawingSizePreset(brush.type as DrawingTool, brush.sizePresetIndex).base]
	}

	const config: PathConfig = {
		tool: brush.type,
		points,
		widths,
		canvasWidth,
		canvasHeight,
	}

	return pathGenerator(config)
}
