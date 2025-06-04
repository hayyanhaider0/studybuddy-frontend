/**
 * useCanvasGestures Hook
 *
 * Contains all logic related to canvas gestures -- tapping, pinching, panning, etc.
 */

import { Gesture } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useCanvasActions } from "./useCanvasActions"
import { useTransformContext } from "../contexts/TransformContext"
import { Skia } from "@shopify/react-native-skia"

export function useCanvasGestures() {
	// Get context values.
	const { current, setCurrent, setPaths, layout } = useCanvasContext()
	const { tool, toolSettings } = useToolContext()
	const { offsetX, offsetY, translateX, translateY, scale, savedScale } = useTransformContext()

	// Current path.
	let skPath = current

	// Handle erase logic from useCanvasActions hook.
	const { handleErase } = useCanvasActions()

	/**
	 * screenToCanvasCoords Helper Function
	 *
	 * Converts screen coordinates to local canvas coordinates.
	 *
	 * This function accounts for the canvas's position on the screen
	 * and returns the corresponding point relative to the canvas origin.
	 *
	 * @param screenX - The X coordinate from the touch event (screen space)
	 * @param screenY - The Y coordinate from the touch event (screen space)
	 * @returns An object containing the X and Y coordinates relative to the canvas
	 */
	const screenToCanvasCoords = (screenX: number, screenY: number) => {
		return { x: screenX - layout.x, y: screenY - layout.y }
	}

	// Pinch gesture: Allows user to zoom in or out within a defined limit.
	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			const nextScale = savedScale.value * e.scale // Determine the next scale.
			// Set the scale value if it is 0.7x or 4x the original scale.
			scale.value = Math.min(Math.max(nextScale, 0.8), 3)
		})
		.onEnd(() => {
			savedScale.value = scale.value
		})
		.runOnJS(true)

	// Draw gesture: Allows user to draw on the canvas.
	const drawGesture = Gesture.Pan()
		.minPointers(1)
		.maxPointers(1)
		.onBegin((e) => {
			// Calculate local x and y values using canvas layout.
			const { x: localX, y: localY } = screenToCanvasCoords(e.x, e.y)

			// Check canvas bounds.
			if (localX < 0 || localY < 0 || localX > layout.width || localY > layout.height) {
				return
			}

			// Start creating a path object.
			skPath = Skia.Path.Make()
			skPath.moveTo(localX, localY)
			setCurrent(skPath)
		})
		.onUpdate((e) => {
			// Calculate local x and y values using canvas layout.
			const { x: localX, y: localY } = screenToCanvasCoords(e.x, e.y)
			// Handle erase if the currently selected tool is the eraser.
			if (tool === "eraser") {
				runOnJS(handleErase)(localX, localY)
				return
			}

			// Set the current path on the local x and y coordinates.
			skPath.lineTo(localX, localY)
			setCurrent(skPath.copy())
		})
		.onEnd(() => {
			if (current) {
				// Insert new path into the paths array and reset the current path string.
				if (skPath) {
					setPaths((prev) => [
						...prev,
						{
							path: skPath.copy(),
							color: toolSettings[tool].color,
							size: toolSettings[tool].size,
							strokeLinecap: toolSettings[tool].strokeLinecap || "round",
						},
					])
					setCurrent(Skia.Path.Make())
				}
			}
		})
		.runOnJS(true)

	// panGesture limits
	const minX = -300
	const maxX = 300
	const minY = -600
	const maxY = 600

	// PanGesture: Allows the user to pan using two fingers.
	const panGesture = Gesture.Pan()
		.minPointers(2)
		.maxPointers(2)
		.onStart(() => {
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

	return Gesture.Simultaneous(pinchGesture, panGesture, drawGesture)
}
