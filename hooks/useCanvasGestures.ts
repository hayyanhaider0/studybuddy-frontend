/**
 * useCanvasGestures Hook
 *
 * Contains all logic related to canvas gestures -- tapping, pinching, panning, etc.
 */

import { Gesture } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useZoomContext } from "../contexts/ZoomContext"
import { useCanvasActions } from "./useCanvasActions"
import { usePanContext } from "../contexts/PanContext"

export function useCanvasGestures(close?: () => void) {
	// Get context values.
	const { current, setCurrent, setPaths, layout } = useCanvasContext()
	const { tool, toolSettings } = useToolContext()
	const { scale, savedScale } = useZoomContext()
	const { offsetX, offsetY, translateX, translateY } = usePanContext()

	// Handle erase logic from useCanvasActions hook.
	const { handleErase } = useCanvasActions()

	// Pinch gesture: Allows user to zoom in or out within a defined limit.
	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			const nextScale = savedScale.value * e.scale // Determine the next scale.
			// Set the scale value if it is 0.7x or 4x the original scale.
			scale.value = Math.min(Math.max(nextScale, 0.7), 4)
		})
		.onEnd(() => {
			// Set the saved scale value.
			savedScale.value = scale.value
		})
		.runOnJS(true)

	// Draw gesture: Allows user to draw on the canvas.
	const drawGesture = Gesture.Pan()
		.onBegin((e) => {
			if (e.numberOfPointers !== 1) return // Only allow drawing if one input (finger/stylus tap) is detected.
			// Calculate local x and y values using canvas layout.
			const localX = e.x - layout.x
			const localY = e.y - layout.y
			// Set the current path on the local x and y coordinates.
			setCurrent(`M ${localX} ${localY}`)
		})
		.onUpdate((e) => {
			if (e.numberOfPointers !== 1) return // Only allow drawing if one input (finger/stylus tap) is detected.

			// Handle erase if the currently selected tool is the eraser.
			if (tool === "eraser") {
				runOnJS(handleErase)(e.x, e.y)
				return
			}

			// Calculate local x and y values using canvas layout.
			const localX = e.x - layout.x
			const localY = e.y - layout.y
			// Set the current path on the local x and y coordinates.
			setCurrent((prev) => `${prev} L ${localX} ${localY}`)
		})
		.onEnd(() => {
			if (current) {
				// Insert new path into the paths array and reset the current path string.
				setPaths((prev) => [
					...prev,
					{
						d: current,
						color: toolSettings[tool].color,
						size: toolSettings[tool].size,
						strokeLinecap: toolSettings[tool].strokeLinecap || "round",
						strokeLineJoin: toolSettings[tool].strokeLinejoin || "round",
					},
				])
				setCurrent("")
			}
		})
		.runOnJS(true)

	// panGesture limits
	const minX = -200
	const maxX = 200
	const minY = -300
	const maxY = 300

	// PanGesture: Allows the user to pan using two fingers.
	const panGesture = Gesture.Pan()
		.onStart(() => {
			// Set the offsets according the translate values.
			offsetX.value = translateX.value
			offsetY.value = translateY.value
		})
		.onUpdate((e) => {
			// Only allow panning if 2 input taps are detected.
			if (e.numberOfPointers && e.numberOfPointers === 2) {
				// Translate accordingly within panGesture limits.
				translateX.value = Math.max(minX, Math.min(offsetX.value + e.translationX, maxX))
				translateY.value = Math.max(minY, Math.min(offsetY.value + e.translationY, maxY))
			}
		})
		.runOnJS(true)

	return Gesture.Simultaneous(pinchGesture, panGesture, drawGesture)
}
