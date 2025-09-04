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
	const brush = path.brush
	const skPath = toSkiaPath(path.points, brush, width, height)

	if (!skPath || path.points.length === 0) return null

	const paint = Skia.Paint()
	paint.setColor(Skia.Color(brush.color))
	paint.setAlphaf(brush.opacity)
	paint.setStyle(0)

	return <Path path={skPath} paint={paint} />
}
