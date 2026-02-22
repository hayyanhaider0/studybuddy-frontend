import { PathOp, Skia, SkRect } from "@shopify/react-native-skia"
import { PathType } from "../types/DrawingTypes"

interface EraserProcessorProps {
	eraserX: number
	eraserY: number
	prevEraserX: number
	prevEraserY: number
	eraserSize: number
	canvasPaths: PathType[]
	width: number
	height: number
}

export default function EraserProcessor({
	eraserX,
	eraserY,
	prevEraserX,
	prevEraserY,
	eraserSize,
	canvasPaths,
	width,
	height,
}: EraserProcessorProps): string | null {
	// Sweep points between prev and current eraser position
	const sweepPoints = interpolatePoints(prevEraserX, prevEraserY, eraserX, eraserY, 0.01)

	for (const p of sweepPoints) {
		const eraserSkPath = Skia.Path.Make()
		eraserSkPath.addCircle(p.x * width, p.y * height, eraserSize * width)
		const eraserBounds = eraserSkPath.getBounds()

		for (const path of canvasPaths) {
			const pathSkPath = path.skPath
			if (!pathSkPath) continue

			const pathBounds = pathSkPath.getBounds()

			// quick bounds reject
			if (!boundsIntersect(pathBounds, eraserBounds)) continue

			// precise intersection
			const intersection = Skia.Path.MakeFromOp(pathSkPath, eraserSkPath, PathOp.Intersect)
			const doesIntersect = intersection && !intersection.isEmpty()

			if (doesIntersect) return path.id
		}
	}

	return null
}

function interpolatePoints(x0: number, y0: number, x1: number, y1: number, step = 0.01) {
	const points = []
	const dx = x1 - x0
	const dy = y1 - y0
	const dist = Math.sqrt(dx * dx + dy * dy)
	const steps = Math.ceil(dist / step)
	for (let i = 0; i <= steps; i++) {
		points.push({ x: x0 + (dx * i) / steps, y: y0 + (dy * i) / steps })
	}
	return points
}

function boundsIntersect(b1: SkRect, b2: SkRect): boolean {
	return !(
		b1.x + b1.width < b2.x ||
		b2.x + b2.width < b1.x ||
		b1.y + b1.height < b2.y ||
		b2.y + b2.height < b1.y
	)
}
