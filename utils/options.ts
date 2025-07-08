/**
 * options Utility
 *
 * Contains all toolbar options and their respective actions e.g undo, redo,
 * clear, menu, etc.
 */

import { useNotebookContext } from "../contexts/NotebookContext"
import { useToolContext } from "../contexts/ToolContext"
import useNotebookActions from "../hooks/useNotebookActions"
import { OptionType } from "../types/global"
import { getCanvas } from "./notebook"

export function useOptionDefinitions() {
	const { collapsed, setCollapsed } = useToolContext() // To check whether toolbar is collapsed.
	const { undo, canUndo, redo, canRedo, clearCanvas } = useNotebookActions()
	const { notebooks, selectedNotebookId, selectedChapterId, selectedCanvasId } =
		useNotebookContext()

	const activeCanvas = getCanvas(
		notebooks,
		selectedNotebookId,
		selectedChapterId,
		selectedCanvasId
	)!

	// Object array that contains all objects that are shown in the toolbar.
	const options: OptionType[] = [
		// Undo last action.
		{ name: "undo", icon: "undo-variant", action: undo, disabled: !canUndo() },
		// Redo the last undone action.
		{
			name: "redo",
			icon: "redo-variant",
			action: redo,
			disabled: !canRedo(),
		},
		// Clear the current canvas -- delete all paths on the current canvas.
		{
			name: "clear",
			icon: "delete-off-outline",
			action: clearCanvas,
			disabled: activeCanvas?.paths.length === 0,
		},
		// Open the sidebar menu.
		{
			name: "collapse",
			icon: collapsed ? "arrow-expand-horizontal" : "arrow-collapse-horizontal",
			action: () => setCollapsed((prev) => !prev),
		},
	]

	return options
}
