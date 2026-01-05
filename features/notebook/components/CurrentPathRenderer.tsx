import { SharedValue, useDerivedValue } from "react-native-reanimated"
import { Path, Skia } from "@shopify/react-native-skia"
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

		if (pts.length === 0) {
			return Skia.Path.Make()
		}

		const skPath = Skia.Path.Make()
		skPath.moveTo(pts[0].x * width, pts[0].y * height)

		for (let i = 1; i < pts.length; i++) {
			skPath.lineTo(pts[i].x * width, pts[i].y * height)
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
	paint.setStrokeWidth(strokeWidth * 1.25)
	paint.setStrokeCap(1)
	paint.setStrokeJoin(1)

	return <Path path={path} paint={paint} />
}
