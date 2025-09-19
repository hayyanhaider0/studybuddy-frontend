/**
 * NotebookContext
 *
 * Provides shared values for notebook related tasks -- pagination, chapter and notebook
 * selection.
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Notebook } from "../../../types/notebook"
import { getChapters, getNotebooks } from "../../../api/mutations/notebook"
import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "../../auth/contexts/AuthContext"
import { ChapterResponse, NotebookResponse } from "../api"

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

	// Auth state to check whether the user is logged in or not.
	const { authState } = useAuthContext()

	// Fetch user notebook data if logged in.
	const { data: notebooksData, refetch: refetchNotebooks } = useQuery({
		queryKey: ["notebooks"],
		queryFn: getNotebooks,
		enabled: authState.isLoggedIn,
	})

	// Fetch user chapter data if logged in.
	const { data: chaptersData, refetch: refetchChapters } = useQuery({
		queryKey: ["chapters"],
		queryFn: getChapters,
		enabled: authState.isLoggedIn,
	})

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

	/**
	 * Fetch user data if it changes.
	 */
	useEffect(() => {
		if (notebooksData && chaptersData) {
			console.log("Fetched notebooks:", JSON.stringify(notebooksData, null, 2))
			console.log("Fetched chapters:", JSON.stringify(chaptersData, null, 2))

			const temp_chapters = chaptersData.map((c: ChapterResponse) => ({
				...c,
				canvases: [],
			}))

			const mapped: Notebook[] = notebooksData.map((n: NotebookResponse) => ({
				...n,
				chapters: temp_chapters.filter((c: ChapterResponse) => c.notebookId === n.id),
			}))

			setNotebooks(mapped as Notebook[])
		}
	}, [notebooksData, chaptersData])

	useEffect(() => {
		if (authState.isLoggedIn) {
			refetchNotebooks()
			refetchChapters()
		}
	}, [authState.isLoggedIn])

	console.log("=== DEBUG INFO ===")
	console.log("notebooksData:", notebooksData)
	console.log("chaptersData:", chaptersData)
	// console.log("notebooksLoading:", notebooksLoading)
	// console.log("chaptersLoading:", chaptersLoading)
	console.log("authState.isLoggedIn:", authState.isLoggedIn)

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
