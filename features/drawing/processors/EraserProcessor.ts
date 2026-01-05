import { PathOp, Skia } from "@shopify/react-native-skia"
import { PathType } from "../types/DrawingTypes"
import { toSkiaPath } from "./PathProcessor"

interface EraserProcessorProps {
	eraserX: number
	eraserY: number
	eraserSize: number
	canvasPaths: PathType[]
	width: number
	height: number
}

export default function EraserProcessor({
	eraserX,
	eraserY,
	eraserSize,
	canvasPaths,
	width,
	height,
}: EraserProcessorProps): PathType | null {
	// Create eraser circle path
	const eraserSkPath = Skia.Path.Make()
	eraserSkPath.addCircle(eraserX * width, eraserY * height, eraserSize * width)

	for (const path of canvasPaths) {
		// quick bounding box reject
		const eraserBBox = {
			minX: eraserX - eraserSize,
			maxX: eraserX + eraserSize,
			minY: eraserY - eraserSize,
			maxY: eraserY + eraserSize,
		}

		if (!bboxIntersects(path.bbox, eraserBBox)) continue

		const pathSkPath = toSkiaPath(path.points, path.brush, width, height)
		if (!pathSkPath) continue

		const intersection = Skia.Path.MakeFromOp(pathSkPath, eraserSkPath, PathOp.Intersect)
		const doesIntersect = intersection && !intersection.isEmpty()

		if (doesIntersect) return path
	}

	return null
}

// Helper function for bbox intersection check
function bboxIntersects(bbox1: BBox, bbox2: BBox): boolean {
	return !(
		bbox1.maxX < bbox2.minX ||
		bbox2.maxX < bbox1.minX ||
		bbox1.maxY < bbox2.minY ||
		bbox2.maxY < bbox1.minY
	)
}

type BBox = {
	minX: number
	maxX: number
	minY: number
	maxY: number
}
