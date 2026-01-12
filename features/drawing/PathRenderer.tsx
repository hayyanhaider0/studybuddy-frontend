import React, { useMemo } from "react"
import { BlendMode, Path, Skia } from "@shopify/react-native-skia"
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

	const skPath = useMemo(
		() => toSkiaPath(path.points, brush, width, height),
		[path.points, brush, width, height]
	)

	const paint = useMemo(() => {
		const p = Skia.Paint()
		p.setColor(Skia.Color(brush.color))
		p.setAlphaf(brush.opacity)
		p.setStyle(brush.type === "pencil" ? 1 : 0)

		if (brush.type === "pencil") {
			const preset = getDrawingSizePreset(brush.type, brush.sizePresetIndex)
			p.setStrokeWidth(preset.base * width)
			p.setStrokeCap(1)
			const noise = Skia.Shader.MakeTurbulence(1, 1, 1, 0, 1, 0.1)
			const pencilShader = Skia.Shader.MakeBlend(
				BlendMode.Luminosity,
				Skia.Shader.MakeColor(Skia.Color(brush.color)),
				noise
			)
			p.setShader(pencilShader)
		}
		return p
	}, [brush.color, brush.opacity, brush.type, brush.sizePresetIndex, width])

	if (!skPath || path.points.length === 0) return null

	return <Path path={skPath} paint={paint} />
}

export default React.memo(PathRenderer, (prev, next) => {
	return prev.path === next.path && prev.width === next.width && prev.height === next.height
})
