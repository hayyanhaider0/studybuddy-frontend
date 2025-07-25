/**
 * NotebookContext
 *
 * Provides shared values for notebook related tasks -- pagination, chapter and notebook
 * selection.
 */

import React, { createContext, ReactNode, useContext, useState } from "react"
import { Notebook } from "../types/notebook"

// Types for the notebook context.
type NotebookContextType = {
	// Global list of all of the user's notebooks.
	notebooks: Notebook[]
	// Setter for the user's list of notebooks.
	setNotebooks: (newNotebooks: Notebook[]) => void
	// Id of the currently selected notebook, or null if no notebook is selected.
	selectedNotebookId: string
	// Setter for the id of the currently selected notebook.
	setSelectedNotebookId: React.Dispatch<React.SetStateAction<string>>
	// Id of the currently selected chapter.
	selectedChapterId: string
	// Setter for the id of the currently selected notebook.
	setSelectedChapterId: React.Dispatch<React.SetStateAction<string>>
	// Id of the currently selected canvas.
	selectedCanvasId: string
	// Setter for the id of the currently selected notebook.
	setSelectedCanvasId: React.Dispatch<React.SetStateAction<string>>
}

// React context for pagination, chapter and notebook selection.
const NotebookContext = createContext<NotebookContextType | null>(null)

/**
 * NotebookProvider Component
 *
 * Wraps children components, providing notebook state values via context.
 *
 * @param children - JSX Components that require NotebookProvider shared values.
 */
export const NotebookProvider = ({ children }: { children: ReactNode }) => {
	// Pagination, chapter and notebook state values.
	const [notebooks, setNotebooksState] = useState<Notebook[]>([])
	const [selectedNotebookId, setSelectedNotebookId] = useState<string>("")
	const [selectedChapterId, setSelectedChapterId] = useState<string>("")
	const [selectedCanvasId, setSelectedCanvasId] = useState<string>("")

	/**
	 * Sets the notebooks array to a new state. Also initializes selected notebook, chapter, and canvas
	 * in case they don't exist -- this should only happen when the user opens the app for the first time.
	 * @param newNotebooks - New notebooks array state.
	 */
	const setNotebooks = (newNotebooks: Notebook[]) => {
		setNotebooksState(newNotebooks)

		const currentNotebook = newNotebooks.find((n) => n.id === selectedNotebookId)
		const currentChapter = currentNotebook?.chapters.find((ch) => ch.id === selectedChapterId)
		const currentCanvas = currentChapter?.canvases.find((cv) => cv.id === selectedCanvasId)

		if (!currentNotebook || !currentChapter || !currentCanvas) {
			const firstNotebook = newNotebooks[0]
			const firstChapter = firstNotebook?.chapters[0]
			const firstCanvas = firstChapter?.canvases[0]

			setSelectedNotebookId(firstNotebook?.id || "")
			setSelectedChapterId(firstChapter?.id || "")
			setSelectedCanvasId(firstCanvas?.id || "")
		}
	}

	return (
		<NotebookContext.Provider
			value={{
				notebooks,
				setNotebooks,
				selectedNotebookId,
				setSelectedNotebookId,
				selectedChapterId,
				setSelectedChapterId,
				selectedCanvasId,
				setSelectedCanvasId,
			}}
		>
			{children}
		</NotebookContext.Provider>
	)
}

/**
 * useNotebook Hook
 *
 * Custom hook to provide shared notebook context values.
 *
 * @throws Error if used outside NotebookProvider.
 * @returns NotebookContext shared values.
 */
export const useNotebookContext = () => {
	const ctx = useContext(NotebookContext)
	if (!ctx) throw new Error("useNotebook must be used within a NotebookProvider")
	return ctx
}
