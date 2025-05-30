/**
 * useCanvasActions Hook
 *
 * Contains logic for all toolbar actions.
 */

import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { useToolContext } from "../contexts/ToolContext"

export function useCanvasActions() {
	// Get values from contexts
	const { setPaths } = useCanvasContext()
	const { tool, setTool } = useToolContext()

	// Theming
	const { toggleTheme } = useThemeContext()

	/**
	 * clearCanvas function
	 *
	 * Clears the current canvas by removing all paths.
	 *
	 * @returns an empty paths array.
	 */
	const clearCanvas = () => setPaths([])

	/**
	 * undo function
	 *
	 * Undoes the last user action and stores it in a redo stack.
	 *
	 * @returns Paths array except the last path.
	 */
	const undo = () => setPaths((prev) => prev.slice(0, -1))

	/**
	 * redo function
	 *
	 * Uses the undo stack to redo the last undone user action.
	 *
	 * @returns Paths array and the popped stack path(s).
	 */
	const redo = () => console.log("redo")

	/**
	 * toggleMenu function
	 *
	 * Allows the user to open the sidebar menu.
	 */
	const toggleMenu = () => {
		console.log("menu")
		toggleTheme()
	}

	/**
	 * handleErase function
	 *
	 * Contains all erasing logic -- only active when the eraser tool is selected.
	 *
	 * @param x - x-coordinate of the eraser's center.
	 * @param y - y-coordinate of the eraser's center.
	 */
	const handleErase = (x: number, y: number) => {
		const radius = 20 // Radius of the eraser
		// Filter the paths array and remove all paths that are erased, and place
		// them into the undo stack.
		setPaths((prev) =>
			prev.filter((p) => {
				const regex = /(-?\d+(\.\d+)?)[ ,](-?\d+(\.\d+)?)/g
				let match
				while ((match = regex.exec(p.d)) !== null) {
					const px = parseFloat(match[1])
					const py = parseFloat(match[3])
					const dx = px - x
					const dy = py - y
					if (Math.sqrt(dx * dx + dy * dy) < radius) return false
				}
				return true
			})
		)
	}

	return { clearCanvas, undo, redo, toggleMenu, handleErase }
}
