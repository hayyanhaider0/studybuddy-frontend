import React, { useMemo } from "react"
import { Path, Skia } from "@shopify/react-native-skia"
import { PathType } from "./types/DrawingTypes"
import { toSkiaPath } from "./processors/PathProcessor"
import { getDrawingSizePreset } from "../../types/tools"

interface PathRendererProps {
	path: PathType
	width: number
	height: number
}

function PathRenderer({ path, width, height }: PathRendererProps) {
	const brush = path.brush

	const skPath = useMemo(() => {
		return toSkiaPath(path.points, brush, width, height)
	}, [path.points, brush, width, height])

	let paint = useMemo(() => {
		const p = Skia.Paint()
		p.setColor(Skia.Color(brush.color))
		p.setAlphaf(brush.opacity)
		p.setStyle(0)
		return p
	}, [brush.color, brush.opacity])

	if (brush.type === "pencil") {
		const preset = getDrawingSizePreset(brush.type, brush.sizePresetIndex)
		paint.setStyle(1)
		paint.setStrokeWidth(preset.base * width)
		paint.setStrokeCap(1)
	}

	if (!skPath || path.points.length === 0) return null

	return <Path path={skPath} paint={paint} />
}

export default React.memo(PathRenderer, (prev, next) => {
	return prev.path === next.path && prev.width === next.width && prev.height === next.height
})
