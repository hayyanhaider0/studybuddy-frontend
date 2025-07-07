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
	setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>
	// Id of the currently selected notebook, or null if no notebook is selected.
	selectedNotebookId: string | null
	// Setter for the id of the currently selected notebook.
	setSelectedNotebookId: React.Dispatch<React.SetStateAction<string | null>>
	// Id of the currently selected chapter.
	selectedChapterId: string | null
	// Setter for the id of the currently selected notebook.
	setSelectedChapterId: React.Dispatch<React.SetStateAction<string | null>>
	// Id of the currently selected canvas.
	selectedCanvasId: string | null
	// Setter for the id of the currently selected notebook.
	setSelectedCanvasId: React.Dispatch<React.SetStateAction<string | null>>
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
	const [notebooks, setNotebooks] = useState<Notebook[]>([])
	const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null)
	const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
	const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null)

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
