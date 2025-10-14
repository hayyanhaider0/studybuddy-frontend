/**
 * Custom hook that allows mutations and keeps client and server synced.
 */

import { useMutation } from "@tanstack/react-query"
import {
	CanvasRequest,
	ChapterRequest,
	createCanvas,
	createChapter,
	createNotebook,
	createPath,
	mapToCanvas,
	mapToChapter,
	mapToNotebook,
	NotebookRequest,
	PathRequest,
} from "../api/api"
import { addCanvas, addChapter, addNotebook } from "../../../utils/notebook"
import { useNotebookContext } from "../contexts/NotebookContext"

export const useNotebookMutations = () => {
	const { notebookState, dispatch } = useNotebookContext()

	// Add a notebook.
	const createNotebookServer = useMutation({
		mutationFn: (req: NotebookRequest) => createNotebook(req),
		// Before the api call is sent.
		onMutate: async (req: NotebookRequest) => {
			const now = Date.now()

			// Create a temporary ID for the notebook.
			const optimisticNotebook = addNotebook(req.title, req.color || null, now, 0)
			const tempId = optimisticNotebook.id

			// Set state with the new notebook having a temporary ID.
			dispatch({ type: "ADD_NOTEBOOK", payload: optimisticNotebook })

			console.log("Optimistic Notebook:", JSON.stringify(optimisticNotebook, null, 2))

			return { tempId }
		},
		// If api call fails.
		onError: (_err, _vars, context) => {
			// Roll back to previous state.
			dispatch({ type: "DELETE_NOTEBOOK", payload: { id: context?.tempId! } })
		},
		// If api call succeeds.
		onSuccess: (data, _vars, context) => {
			const mappedNotebook = mapToNotebook(data)
			// Set the new state with actual notebook ID.
			dispatch({
				type: "UPDATE_NOTEBOOK",
				payload: { id: context.tempId, updates: mappedNotebook },
			})

			if (notebookState.selectedNotebookId?.startsWith("temp")) {
				dispatch({ type: "SELECT_NOTEBOOK", payload: mappedNotebook.id })
				dispatch({ type: "SELECT_CHAPTER", payload: mappedNotebook.chapters[0].id })
				dispatch({ type: "SELECT_CANVAS", payload: mappedNotebook.chapters[0].canvases[0].id })
			}
		},
	})

	const createChapterServer = useMutation({
		mutationFn: (req: ChapterRequest) => createChapter(req),
		onMutate: async (req: ChapterRequest) => {
			const now = Date.now()
			const optimisticChapter = addChapter(req.notebookId, req.title, req.order, now)
			const tempId = optimisticChapter.id

			dispatch({
				type: "ADD_CHAPTER",
				payload: { notebookId: req.notebookId, chapter: optimisticChapter },
			})

			return { tempId, notebookId: req.notebookId }
		},
		onError: (_err, _vars, context) => {
			dispatch({
				type: "DELETE_CHAPTER",
				payload: { id: context?.tempId!, notebookId: context?.notebookId! },
			})
		},
		onSuccess: (data, _vars, context) => {
			dispatch({
				type: "UPDATE_CHAPTER",
				payload: {
					id: context.tempId,
					notebookId: context.notebookId,
					updates: mapToChapter(data),
				},
			})
		},
	})

	const createCanvasServer = useMutation({
		mutationFn: (req: CanvasRequest) => createCanvas(req),
		onMutate: (req: CanvasRequest) => {
			const optimisticCanvas = addCanvas(req.chapterId, req.order, Date.now())
			const tempId = optimisticCanvas.id

			const notebook = notebookState.notebooks.find((n) =>
				n.chapters.some((ch) => ch.id === req.chapterId)
			)
			const notebookId = notebook?.id!

			dispatch({
				type: "ADD_CANVAS",
				payload: { notebookId, chapterId: req.chapterId, canvas: optimisticCanvas },
			})

			return { tempId, chapterId: req.chapterId, notebookId }
		},
		onError: (_err, _vars, context) => {
			dispatch({
				type: "DELETE_CANVAS",
				payload: {
					notebookId: context?.notebookId!,
					chapterId: context?.chapterId!,
					id: context?.tempId!,
				},
			})
		},
		onSuccess: (data, _vars, context) => {
			dispatch({
				type: "UPDATE_CANVAS",
				payload: {
					notebookId: context.notebookId,
					chapterId: context.chapterId,
					id: context.tempId,
					updates: mapToCanvas(data),
				},
			})
		},
	})

	const createPathServer = useMutation({
		mutationFn: (req: PathRequest) => createPath(req),
		onError: (err) => console.log("Error creating path:", err),
	})

	return { createNotebookServer, createChapterServer, createCanvasServer, createPathServer }
}
