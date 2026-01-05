import { Gesture } from "react-native-gesture-handler"
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
			if (isEraser) {
				runOnJS(handleErase)(normX, normY, eraserSize, canvasId)
			}
		})
		.onEnd(() => {
			"worklet"

			// Use the pre-computed boolean.
			if (!isDrawing) {
				currentPathPoints.value = []
				return
			}

			// Save the points.
			const points = [...currentPathPoints.value]

			// Return if no points.
			if (points.length === 0) return

			// Calculate bounding box.
			const xs = points.map((p) => p.x)
			const ys = points.map((p) => p.y)
			const minX = Math.min(...xs)
			const maxX = Math.max(...xs)
			const minY = Math.min(...ys)
			const maxY = Math.max(...ys)

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
				bbox: {
					minX,
					maxX,
					minY,
					maxY,
				},
			}

			// Bridge to the JS thread to add path to the canvas.
			runOnJS(addPathToCanvas)(finalizedPath)

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
				bbox: {
					minX: normX,
					maxX: normX,
					minY: normY,
					maxY: normY,
				},
			}

			runOnJS(addPathToCanvas)(dotPath)
		})

	return Gesture.Race(drawGesture, tapGesture)
}
