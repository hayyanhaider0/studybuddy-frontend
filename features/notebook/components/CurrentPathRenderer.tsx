import { SharedValue, useDerivedValue } from "react-native-reanimated"
import { BlendMode, Path, Skia } from "@shopify/react-native-skia"
import { PathPoint } from "../../drawing/types/DrawingTypes"
import {
	DrawingTool,
	DrawingToolSettings,
	getDrawingSizePreset,
	getEraserSizePreset,
	isDrawingTool,
	isEraserTool,
} from "../../../types/tools"

interface CurrentPathRendererProps {
	currentPath: SharedValue<PathPoint[]>
	tool: DrawingTool
	brush: DrawingToolSettings
	width: number
	height: number
}

export default function CurrentPathRenderer({
	currentPath,
	tool,
	brush,
	width,
	height,
}: CurrentPathRendererProps) {
	const path = useDerivedValue(() => {
		const pts = currentPath.value

		if (pts.length === 0) return Skia.Path.Make()

		const skPath = Skia.Path.Make()
		skPath.moveTo(pts[0].x * width, pts[0].y * height)

		for (let i = 1; i < pts.length; i++) {
			// Use the midpoint between the previous point and the current point as the control point
			const prev = pts[i - 1]
			const curr = pts[i]
			const cx = ((prev.x + curr.x) / 2) * width
			const cy = ((prev.y + curr.y) / 2) * height

			skPath.quadTo(prev.x * width, prev.y * height, cx, cy)
		}

		return skPath
	})

	let strokeWidth = 5 // Default fallback
	let color = "#000000"
	let opacity = 1

	if (isDrawingTool(tool)) {
		const size = getDrawingSizePreset(tool, brush.activeSizePreset)
		strokeWidth = size.base * width
		color = brush.color as string
		opacity = brush.opacity
	} else if (isEraserTool(tool)) {
		const size = getEraserSizePreset(brush.activeSizePreset)
		strokeWidth = size * width
		// Use a light gray for eraser preview
		color = "#FFFFFF"
		opacity = 0.5
	}

	const paint = Skia.Paint()
	paint.setColor(Skia.Color(color))
	paint.setAlphaf(opacity)
	paint.setStyle(1)
	paint.setStrokeWidth(strokeWidth)
	tool === "highlighter" ? paint.setStrokeCap(2) : paint.setStrokeCap(1)
	paint.setStrokeJoin(1)

	if (tool === "pencil") {
		const noise = Skia.Shader.MakeTurbulence(1, 1, 1, 0, 1, 0.1)
		const pencilShader = Skia.Shader.MakeBlend(
			BlendMode.Luminosity,
			Skia.Shader.MakeColor(Skia.Color(color)),
			noise
		)
		paint.setShader(pencilShader)
	}

	return <Path path={path} paint={paint} />
}
