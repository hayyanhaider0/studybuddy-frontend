/**
 * PathRenderer Component
 *
 * This includes the logic of turning the user drawn path into a Skia path and rendering it.
 */

import { Path, Skia } from "@shopify/react-native-skia"
import { PathType } from "./types/DrawingTypes"
import { ReactNode } from "react"
import { toSkiaPath } from "./processors/PathProcessor"

interface PathRendererProps {
	path: PathType
	width: number
	height: number
}

export default function PathRenderer({ path, width, height }: PathRendererProps): ReactNode {
	const brush = path.brush // Brush style.
	const skPath = toSkiaPath(path.points, width, height) // Conversion to Skia path.

	if (!skPath || path.points.length === 0) return null

	// Create a styled paint.
	const paint = Skia.Paint()

	// Denormalize stroke width.
	const denormStrokeWidth = brush.baseWidth * width

	paint.setColor(Skia.Color(brush.color))
	paint.setStrokeWidth(denormStrokeWidth)
	paint.setStrokeJoin(brush.strokeJoin)
	paint.setStrokeCap(brush.strokeCap)
	paint.setAlphaf(brush.opacity)
	paint.setStyle(1)

	return <Path path={skPath} paint={paint} />
}
