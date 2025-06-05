/**
 * useCanvasActions Hook
 *
 * Contains logic for all toolbar actions.
 */

import { useNavigation } from "@react-navigation/native"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { SidebarNavProp } from "../types/global"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../navigation/Navigation"

export function useCanvasActions() {
	// Get values from contexts
	const { setPaths } = useCanvasContext()

	// Theming
	const { toggleTheme } = useThemeContext()

	// Navigation for the sidebar menu.
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()

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
		navigation.openDrawer()
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

		setPaths((prev) =>
			prev.filter((pathData) => {
				// Get the path bounds to do a quick check first
				const bounds = pathData.path.getBounds()

				// Quick bounds check - if eraser is nowhere near the path, skip detailed check
				if (
					x + radius < bounds.x ||
					x - radius > bounds.x + bounds.width ||
					y + radius < bounds.y ||
					y - radius > bounds.y + bounds.height
				) {
					return true // Keep the path
				}

				// For more accurate checking, you could:
				// 1. Check if the eraser point is near the path stroke
				// 2. Use path.contains() if the path is filled
				// 3. Sample points along the path and check distance

				// Simple approach: check if eraser center is within stroke width of path bounds
				const strokeRadius = pathData.size / 2
				const expandedBounds = {
					x: bounds.x - strokeRadius,
					y: bounds.y - strokeRadius,
					width: bounds.width + strokeRadius * 2,
					height: bounds.height + strokeRadius * 2,
				}

				const eraserOverlaps =
					x >= expandedBounds.x &&
					x <= expandedBounds.x + expandedBounds.width &&
					y >= expandedBounds.y &&
					y <= expandedBounds.y + expandedBounds.height

				return !eraserOverlaps // Return false to remove (erase) the path
			})
		)
	}

	return { clearCanvas, undo, redo, toggleMenu, handleErase }
}
