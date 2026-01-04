import { Gesture } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import useNotebookActions from "./useNotebookActions"
import { PathType } from "../../drawing/types/DrawingTypes"
import { useTool } from "../contexts/ToolContext"
import {
	canDraw,
	DrawingTool,
	DrawingToolSettings,
	EraserSettings,
	getEraserSizePreset,
	isDrawingTool,
	isEraserTool,
} from "../../../types/tools"
import { useDrawingSettings } from "../contexts/DrawingSettingsContext"

export default function useCanvasDrawingGestures(canvasId: string) {
	// Get context values.
	const { current, setCurrentPath, updateCurrentPath, clearCurrentPath, layout } =
		useCanvasContext()
	const { activeTool } = useTool()
	const { settings } = useDrawingSettings()
	const { handleCreatePath, addPathToCanvas, handleErase } = useNotebookActions()

	// Draw gesture: Allows user to draw on the canvas.
	const drawGesture = Gesture.Pan()
		.enabled(canDraw(activeTool))
		.minPointers(1)
		.maxPointers(1)
		.onBegin((e) => {
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 1

			let toolSettings: DrawingToolSettings | EraserSettings

			if (isDrawingTool(activeTool)) {
				toolSettings = settings[activeTool]
			} else if (isEraserTool(activeTool)) {
				toolSettings = settings.eraser
				const size = getEraserSizePreset(toolSettings.activeSizePreset)
				const normSize = size / layout.width

				handleErase(normX, normY, normSize, canvasId)
			}

			const newPath = handleCreatePath(normX, normY, pressure, canvasId, toolSettings)
			if (!newPath) return
			setCurrentPath(canvasId, newPath)
		})
		.onUpdate((e) => {
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 0.5

			if (isEraserTool(activeTool)) {
				const eraserSettings = settings.eraser
				const size = getEraserSizePreset(eraserSettings.activeSizePreset)
				const normSize = size / layout.width

				handleErase(normX, normY, normSize, canvasId)
			}

			updateCurrentPath(canvasId, { x: normX, y: normY, pressure })
		})
		.onEnd(() => {
			if (isDrawingTool(activeTool)) {
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
			}

			clearCurrentPath(canvasId)
		})
		.runOnJS(true)

	const tapGesture = Gesture.Tap()
		.maxDuration(200)
		.enabled(isDrawingTool(activeTool))
		.onEnd((e) => {
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = 1

			const toolSettings = settings[activeTool as DrawingTool]

			const dotPath = handleCreatePath(normX, normY, pressure, canvasId, toolSettings)

			if (!dotPath) return

			addPathToCanvas(dotPath)
		})
		.runOnJS(true)

	return Gesture.Race(drawGesture, tapGesture)
}
