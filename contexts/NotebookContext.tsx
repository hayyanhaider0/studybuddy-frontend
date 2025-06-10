/**
 * NotebookContext
 *
 * Provides shared values for notebook related tasks -- pagination, chapter and notebook
 * selection.
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Canvas, Chapter, Notebook } from "../types/notebook"

// Types for the notebook context.
type NotebookContextType = {
	// Global list of all of the user's notebooks.
	notebooks: Notebook[]
	// Setter for the user's list of notebooks.
	setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>
	// Current notebook that the user is on -- or null if there is no notebook.
	notebook: Notebook | null
	// Setter for the current notebook.
	setNotebook: React.Dispatch<React.SetStateAction<Notebook | null>>
	// Current chapter that the user is on -- or undefined if there is no notebook.
	chapter: Chapter | undefined
	// Setter for the current chapter.
	setChapter: React.Dispatch<React.SetStateAction<Chapter | undefined>>
	// Current canvas the user is on -- or undefined if there is no notebook.
	canvas: Canvas | undefined
	// Setter for the current canvas.
	setCanvas: React.Dispatch<React.SetStateAction<Canvas | undefined>>
	// Tracks the active canvas ID.
	activeCanvasId: string | null
	// Setter for the active canvas ID.
	setActiveCanvasId: React.Dispatch<React.SetStateAction<string | null>>
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
	const [notebook, setNotebook] = useState<Notebook | null>(null)
	const [chapter, setChapter] = useState<Chapter | undefined>(notebook?.chapters[0])
	const [canvas, setCanvas] = useState<Canvas | undefined>(chapter?.canvases[0])
	const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null)

	useEffect(() => {
		if (!chapter) return
		setCanvas(chapter.canvases[0])
	}, [chapter])

	return (
		<NotebookContext.Provider
			value={{
				notebooks,
				setNotebooks,
				notebook,
				setNotebook,
				chapter,
				setChapter,
				canvas,
				setCanvas,
				activeCanvasId,
				setActiveCanvasId,
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
export const useNotebook = () => {
	const ctx = useContext(NotebookContext)
	if (!ctx) throw new Error("useNotebook must be used within a NotebookProvider")
	return ctx
}
