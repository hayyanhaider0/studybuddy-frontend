import { Skia } from "@shopify/react-native-skia"
import { useState } from "react"
import { Gesture } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useTransformContext } from "../contexts/TransformContext"
import { useCanvasActions } from "./useCanvasActions"
import { useNotebook } from "../contexts/NotebookContext"

export default function useCanvasDrawingGestures(canvasId: string) {
	// Get context values.
	const { current, setCurrent, setPaths, layout } = useCanvasContext()
	const { tool, toolSettings, setEraserPos } = useToolContext()
	const { setActiveCanvasId } = useNotebook()

	// Current path.
	let skPath = current[canvasId] ?? Skia.Path.Make()

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

	// Draw gesture: Allows user to draw on the canvas.
	const drawGesture = Gesture.Pan()
		.minPointers(1)
		.maxPointers(1)
		.enabled(tool !== "pointer")
		.onBegin((e) => {
			// Calculate local x and y values using canvas layout.
			const { x, y } = screenToCanvasCoords(e.x, e.y)
			setActiveCanvasId(canvasId)

			if (tool === "eraser") {
				setEraserPos({ x: x, y: y })
			}

			// Check canvas bounds.
			if (x < 0 || y < 0 || x > layout.width || y > layout.height) {
				return
			}

			// Start creating a path object.
			skPath = Skia.Path.Make()
			skPath.moveTo(x, y)
			setCurrent((prev) => ({
				...prev,
				[canvasId]: skPath,
			}))
		})
		.onUpdate((e) => {
			// Calculate local x and y values using canvas layout.
			const { x, y } = screenToCanvasCoords(e.x, e.y)
			// Handle erase if the currently selected tool is the eraser.
			if (tool === "eraser") {
				setEraserPos({ x: x, y: y })
				runOnJS(handleErase)(canvasId, x, y)
				return
			}

			// Set the current path on the local x and y coordinates.
			skPath.lineTo(x, y)
			setCurrent((prev) => ({
				...prev,
				[canvasId]: skPath,
			}))
		})
		.onEnd(() => {
			if (current) {
				if (tool === "eraser") return
				// Insert new path into the paths array and reset the current path string.
				if (skPath) {
					setPaths((prev) => ({
						...prev,
						[canvasId]: [
							...(prev[canvasId] || []),
							{
								path: skPath.copy(),
								color: toolSettings[tool].color,
								size: toolSettings[tool].size,
								strokeLinecap: toolSettings[tool].strokeLinecap || "round",
							},
						],
					}))

					setCurrent((prev) => ({
						...prev,
						[canvasId]: Skia.Path.Make(),
					}))
				}
			}
		})
		.runOnJS(true)

	// Tap Gesture: Allows the user to tap and draw a dot.
	const tapGesture = Gesture.Tap()
		.onEnd((e) => {
			// Calculate local x and y values using canvas layout.
			const { x, y } = screenToCanvasCoords(e.x, e.y)
			setActiveCanvasId(canvasId)

			if (tool === "eraser" || tool === "pointer") return

			// Start creating a path object.
			skPath = Skia.Path.Make()
			skPath.moveTo(x, y)

			// Create a very small line -- resembling a dot.
			skPath.lineTo(x + 0.1, y + 0.1)

			// Update the paths array.
			setPaths((prev) => ({
				...prev,
				[canvasId]: [
					...(prev[canvasId] || []),
					{
						path: skPath.copy(),
						color: toolSettings[tool].color,
						size: toolSettings[tool].size,
						strokeLinecap: toolSettings[tool].strokeLinecap || "round",
					},
				],
			}))
		})
		.runOnJS(true)

	return Gesture.Exclusive(drawGesture, tapGesture)
}
