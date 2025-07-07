/**
 * options Utility
 *
 * Contains all toolbar options and their respective actions e.g undo, redo,
 * clear, menu, etc.
 */

import { useToolContext } from "../contexts/ToolContext"
import { OptionType } from "../types/global"

export function useOptionDefinitions() {
	const { collapsed, setCollapsed } = useToolContext() // To check whether toolbar is collapsed.

	// Object array that contains all objects that are shown in the toolbar.
	const options: OptionType[] = [
		// Undo last action.
		{ name: "undo", icon: "undo-variant", action: () => console.log("undo") },
		// Redo the last undone action.
		{ name: "redo", icon: "redo-variant", action: () => console.log("redo") },
		// Clear the current canvas -- delete all paths on the current canvas.
		{ name: "clear", icon: "delete-off-outline", action: () => console.log("clear") },
		// Open the sidebar menu.
		{
			name: "collapse",
			icon: collapsed ? "arrow-expand-horizontal" : "arrow-collapse-horizontal",
			action: () => setCollapsed((prev) => !prev),
		},
	]

	return options
}
