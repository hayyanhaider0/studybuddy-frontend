import { Gesture, PointerType } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import useNotebookActions from "./useNotebookActions"
import { useTool } from "../contexts/ToolContext"
import { canDraw, DrawingTool, getEraserSizePreset } from "../../../types/tools"
import { useDrawingSettings } from "../contexts/DrawingSettingsContext"
import { PathType } from "../../drawing/types/DrawingTypes"
import { runOnJS } from "react-native-reanimated"

export default function useCanvasDrawingGestures(canvasId: string) {
	const { getCurrentPathPoints, layout } = useCanvasContext()
	const { activeTool } = useTool()
	const { settings } = useDrawingSettings()
	const { addPathToCanvas, handleErase } = useNotebookActions()

	// Get the SharedValue for this canvas from context.
	const currentPathPoints = getCurrentPathPoints(canvasId)

	// Check if it's a drawing tool outside the worklet.
	const isDrawing = activeTool === "pen" || activeTool === "pencil" || activeTool === "highlighter"
	const isEraser = activeTool === "eraser"

	// Pre-compute eraser size.
	const eraserSize = isEraser
		? getEraserSizePreset(settings.eraser.activeSizePreset) / layout.width
		: 0

	const isStrokeEraser = settings["eraser"].type === "stroke"

	const drawGesture = Gesture.Pan()
		.enabled(canDraw(activeTool))
		.minPointers(1)
		.maxPointers(1)
		.onBegin((e) => {
			"worklet"

			// Normalize coordinates.
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 0.5

			// Start creating a path on the UI thread.
			currentPathPoints.value = [{ x: normX, y: normY, pressure }]
		})
		.onUpdate((e) => {
			"worklet"

			// Normalize coordinates.
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = e.stylusData?.pressure ?? 0.5

			// Append path.
			currentPathPoints.value = [...currentPathPoints.value, { x: normX, y: normY, pressure }]

			// Bridge to the JS thread for erasing.
			if (isEraser && isStrokeEraser && currentPathPoints.value.length > 1) {
				const prevEraserX = currentPathPoints.value[currentPathPoints.value.length - 2].x
				const prevEraserY = currentPathPoints.value[currentPathPoints.value.length - 2].y
				runOnJS(handleErase)(normX, normY, eraserSize, prevEraserX, prevEraserY, canvasId)
			}
		})
		.onEnd((e) => {
			"worklet"

			// Use the pre-computed boolean.
			if (isEraser && isStrokeEraser) {
				currentPathPoints.value = []
				return
			}

			// Save the points.
			const points = [...currentPathPoints.value]

			// Return if no points.
			if (points.length === 0) return

			// Create the finalized path.
			const toolSettings = settings[activeTool as DrawingTool]
			const finalizedPath: PathType = {
				id: `temp-${Date.now()}`,
				canvasId,
				points: points,
				brush: {
					type: activeTool,
					color: toolSettings.color as string,
					sizePresetIndex: toolSettings.activeSizePreset,
					opacity: toolSettings.opacity,
				},
			}

			// Bridge to the JS thread to add path to the canvas.
			const isStylus = e.pointerType === PointerType.STYLUS
			runOnJS(addPathToCanvas)(finalizedPath, layout.width, layout.height, isStylus)

			// Clear the current path after 50ms.
			setTimeout(() => {
				currentPathPoints.value = []
			}, 60)
		})

	const tapGesture = Gesture.Tap()
		.maxDuration(200)
		.enabled(isDrawing)
		.onEnd((e) => {
			const normX = e.x / layout.width
			const normY = e.y / layout.height
			const pressure = 0.5

			const toolSettings = settings[activeTool as DrawingTool]

			const dotPath: PathType = {
				id: `temp-${Date.now()}`,
				canvasId,
				points: [{ x: normX, y: normY, pressure }],
				brush: {
					type: activeTool,
					color: toolSettings.color as string,
					sizePresetIndex: toolSettings.activeSizePreset,
					opacity: toolSettings.opacity,
				},
			}

			runOnJS(addPathToCanvas)(dotPath, layout.width, layout.height, false)
		})

	return Gesture.Race(drawGesture, tapGesture)
}
