/**
 * options Utility
 *
 * Contains all toolbar options and their respective actions e.g undo, redo,
 * clear, menu, etc.
 */

import { useNotebookContext } from "../features/notebook/contexts/NotebookContext"
import useNotebookActions from "../features/notebook/hooks/useNotebookActions"
import { getCanvas } from "./notebook"

type OptionDefinitionType = {
	name: string
	icon: string
	action: () => void
	disabled: boolean
}

export function useOptionDefinitions() {
	const { undo, canUndo, redo, canRedo, clearCanvas } = useNotebookActions()
	const { notebookState } = useNotebookContext()

	const activeCanvas = getCanvas(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId,
		notebookState.selectedCanvasId
	)!

	// Object array that contains all objects that are shown in the toolbar.
	const options: OptionDefinitionType[] = [
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
	]

	return options
}
