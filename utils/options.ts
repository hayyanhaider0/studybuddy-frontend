/**
 * options Utility
 *
 * Contains all toolbar options and their respective actions e.g undo, redo,
 * clear, menu, etc.
 */

import { useCanvasActions } from "../hooks/useCanvasActions"
import { OptionType } from "../types/global"

export function useOptionDefinitions() {
	const { clearCanvas, undo, redo, toggleMenu } = useCanvasActions() // Get related canvas actions.

	// Object array that contains all objects that are shown in the toolbar.
	const options: OptionType[] = [
		// Undo last action.
		{ name: "undo", icon: "undo-variant", action: undo },
		// Redo the last undone action.
		{ name: "redo", icon: "redo-variant", action: redo },
		// Clear the current canvas -- delete all paths on the current canvas.
		{ name: "clear", icon: "delete-off-outline", action: clearCanvas },
		// Open the sidebar menu.
		{ name: "menu", icon: "dots-horizontal", action: toggleMenu },
	]

	return options
}
