/**
 * useCanvasGestures Hook
 *
 * Contains all logic related to canvas gestures -- tapping, pinching, panning, etc.
 */

import { Gesture } from "react-native-gesture-handler"
import { useTransformContext } from "../contexts/TransformContext"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { getCanvas } from "../../../utils/notebook"

export function useCanvasTranslateGestures() {
	const { offsetX, offsetY, translateX, translateY, scale, savedScale } = useTransformContext()
	const { clearCurrentPath } = useCanvasContext()
	const { notebooks, selectedNotebookId, selectedChapterId, selectedCanvasId } =
		useNotebookContext()

	const activeCanvas = getCanvas(notebooks, selectedNotebookId, selectedChapterId, selectedCanvasId)

	// Pinch gesture: Allows user to zoom in or out within a defined limit.
	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			const nextScale = savedScale.value * e.scale // Determine the next scale.
			// Set the scale value if it is 0.7x or 4x the original scale.
			scale.value = Math.min(Math.max(nextScale, 0.3), 5)
		})
		.onEnd(() => {
			savedScale.value = scale.value
		})
		.runOnJS(true)

	// panGesture limits
	const minX = -1200
	const maxX = 1200
	const minY = -1800
	const maxY = 1800

	// PanGesture: Allows the user to pan using two fingers.
	const panGesture = Gesture.Pan()
		.minPointers(2)
		.maxPointers(2)
		.onBegin(() => {
			if (activeCanvas) clearCurrentPath(activeCanvas.id)
			// Set the offsets according the translate values.
			offsetX.value = translateX.value
			offsetY.value = translateY.value
		})
		.onUpdate((e) => {
			// Translate accordingly within panGesture limits.
			translateX.value = Math.max(minX, Math.min(offsetX.value + e.translationX, maxX))
			translateY.value = Math.max(minY, Math.min(offsetY.value + e.translationY, maxY))
		})
		.runOnJS(true)

	return Gesture.Simultaneous(panGesture, pinchGesture)
}
