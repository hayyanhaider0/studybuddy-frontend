import { Gesture } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import useNotebookActions from "./useNotebookActions"
import { BrushType } from "../../../enums/global"
import uuid from "react-native-uuid"
import { StrokeCap, StrokeJoin } from "@shopify/react-native-skia"
import { PathType } from "../../drawing/types/DrawingTypes"

export default function useCanvasDrawingGestures(canvasId: string) {
	// Get context values.
	const { current, setCurrentPath, updateCurrentPath, clearCurrentPath, layout } =
		useCanvasContext()
	const { tool, toolSettings, eraserPos, setEraserPos } = useToolContext()
	const { addPathToCanvas, handleErase } = useNotebookActions()

	// Check whether the selected tool can draw.
	const isDrawingTool = (t: BrushType) =>
		t === BrushType.PEN ||
		t === BrushType.PENCIL ||
		t === BrushType.HIGHLIGHTER ||
		t === BrushType.ERASER

	// Draw gesture: Allows user to draw on the canvas.
	const drawGesture = Gesture.Pan()
		.enabled(isDrawingTool(tool))
		.minPointers(1)
		.maxPointers(1)
		.onBegin((e) => {
			if (!isDrawingTool(tool)) return

			if (tool === BrushType.ERASER) {
				setEraserPos({ x: e.x, y: e.y })
				return
			}

			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 1

			const settings = toolSettings[tool]
			const normBaseWidth = settings.size / layout.width
			const normMinWidth = settings.minWidth! / layout.width
			const normMaxWidth = settings.maxWidth! / layout.width

			const newPath: PathType = {
				id: uuid.v4(),
				points: [{ x: normX, y: normY, pressure }],
				brush: {
					type: tool,
					color: settings.color,
					baseWidth: normBaseWidth,
					minWidth: normMinWidth,
					maxWidth: normMaxWidth,
					opacity: settings.opacity ?? 1,
					strokeCap: settings.strokeCap ?? StrokeCap.Round,
					strokeJoin: settings.strokeJoin ?? StrokeJoin.Round,
				},
				bbox: { minX: normX, maxX: normX, minY: normY, maxY: normY },
			}

			setCurrentPath(canvasId, newPath)
		})
		.onUpdate((e) => {
			if (!isDrawingTool(tool)) return

			if (tool === BrushType.ERASER) {
				setEraserPos({ x: e.x, y: e.y })
				handleErase(eraserPos.x, eraserPos.y, toolSettings[tool].size, layout.width, layout.height)
				return
			}

			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 0.5

			updateCurrentPath(canvasId, { x: normX, y: normY, pressure })
		})
		.onEnd(() => {
			if (!isDrawingTool(tool) || tool === BrushType.ERASER) return

			const finishedPath = current[canvasId]
			if (finishedPath) {
				const pathWithBBox: PathType = {
					...finishedPath,
					bbox: {
						minX: Math.min(...finishedPath.points.map((p) => p.x)),
						maxX: Math.max(...finishedPath.points.map((p) => p.x)),
						minY: Math.min(...finishedPath.points.map((p) => p.y)),
						maxY: Math.max(...finishedPath.points.map((p) => p.y)),
					},
				}

				addPathToCanvas(pathWithBBox)
			}

			clearCurrentPath(canvasId)
		})
		.runOnJS(true)

	const tapGesture = Gesture.Tap()
		.maxDuration(200)
		.enabled(isDrawingTool(tool))
		.onEnd((e) => {
			if (!isDrawingTool(tool)) return

			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = 1

			const settings = toolSettings[tool]
			const normBaseWidth = settings.size / layout.width
			const normMinWidth = settings.minWidth! / layout.width
			const normMaxWidth = settings.maxWidth! / layout.width

			const dotPath: PathType = {
				id: uuid.v4(),
				points: [{ x: normX, y: normY, pressure }],
				brush: {
					type: tool,
					color: settings.color,
					baseWidth: normBaseWidth,
					minWidth: normMinWidth,
					maxWidth: normMaxWidth,
					opacity: settings.opacity ?? 1,
					strokeCap: settings.strokeCap || StrokeCap.Butt,
					strokeJoin: settings.strokeJoin || StrokeJoin.Miter,
				},
				bbox: { minX: normX, maxX: normX, minY: normY, maxY: normY },
			}

			addPathToCanvas(dotPath)
		})
		.runOnJS(true)

	return Gesture.Race(drawGesture, tapGesture)
}
