/**
 * useCanvasActions Hook
 *
 * Contains logic for all toolbar actions.
 */

import { useNavigation } from "@react-navigation/native"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useToolContext } from "../contexts/ToolContext"
import { DrawerParamList } from "../navigation/DrawerNavigation"
import { useNotebookContext } from "../contexts/NotebookContext"

export function useCanvasActions() {
	// Get values from contexts
	const { setPaths } = useCanvasContext()
	const { toolSettings, collapsed, setCollapsed } = useToolContext()
	const { activeCanvasId } = useNotebookContext()
	const canvasId = activeCanvasId as string

	// Navigation for the sidebar menu.
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	/**
	 * clearCanvas function
	 *
	 * Clears the current canvas by removing all paths.
	 *
	 * @returns an empty paths array.
	 */
	const clearCanvas = () => {
		setPaths((prev) => ({ ...prev, [canvasId]: [] }))
	}

	/**
	 * undo function
	 *
	 * Undoes the last user action and stores it in a redo stack.
	 *
	 * @returns Paths array except the last path.
	 */
	const undo = () => {
		setPaths((prev) => {
			const canvasPaths = prev[canvasId] || []
			return {
				...prev,
				[canvasId as string]: canvasPaths.slice(0, -1),
			}
		})
	}

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
	const handleErase = (canvasId: string, x: number, y: number) => {
		const radius = toolSettings["eraser"].size / 2

		setPaths((prev) => {
			const canvasPaths = prev[canvasId] || []

			const updatedPaths = canvasPaths.filter((pathData) => {
				const bounds = pathData.path.getBounds()

				// Quick bounds check
				if (
					x + radius < bounds.x ||
					x - radius > bounds.x + bounds.width ||
					y + radius < bounds.y ||
					y - radius > bounds.y + bounds.height
				) {
					return true
				}

				const strokeRadius = pathData.size
				const expandedBounds = {
					x: bounds.x - strokeRadius,
					y: bounds.y - strokeRadius,
					width: bounds.width + strokeRadius,
					height: bounds.height + strokeRadius,
				}

				const eraserOverlaps =
					x >= expandedBounds.x &&
					x <= expandedBounds.x + expandedBounds.width &&
					y >= expandedBounds.y &&
					y <= expandedBounds.y + expandedBounds.height

				return !eraserOverlaps
			})

			return {
				...prev,
				[canvasId]: updatedPaths,
			}
		})
	}

	const collapseToolbar = () => {
		setCollapsed(!collapsed)
	}

	return { clearCanvas, undo, redo, toggleMenu, handleErase, collapseToolbar }
}
