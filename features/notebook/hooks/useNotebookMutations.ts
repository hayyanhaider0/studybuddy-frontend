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
	createPaths,
	deleteChapter,
	deleteNotebook,
	deletePaths,
	mapToCanvas,
	mapToChapter,
	mapToNotebook,
	NotebookRequest,
	PathCreateResponse,
	PathRequest,
	sync,
} from "../api/api"
import { addCanvas, addChapter, addNotebook, getNotebook } from "../../../utils/notebook"
import { useNotebookContext } from "../contexts/NotebookContext"
import { Chapter, Notebook } from "../../../types/notebook"

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
			dispatch({ type: "SELECT_NOTEBOOK", payload: tempId })

			console.log("Optimistic Notebook:", JSON.stringify(optimisticNotebook, null, 2))

			return { tempId }
		},
		// If api call fails.
		onError: (err) => {
			// Print an error message.
			// This is to be replaced by batched update logic.
			// Store updates in a queue and send them to the server upon restoration of connection.
			console.error("[useNotebookMutations.ts/CREATE_NOTEBOOK_SERVER]: Mutation failed.", err)
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

	// Edit a notebook.
	const editNotebookServer = (notebookId: string, input: string) => console.log("Editing notebook.")

	// Delete a notebook.
	const deleteNotebookServer = useMutation({
		mutationFn: (notebook: Notebook) => deleteNotebook(notebook.id),
		// Before the mutation runs, just delete the notebook from the frontend for instant UI updates.
		onMutate: async (notebook: Notebook) => {
			dispatch({ type: "DELETE_NOTEBOOK", payload: { id: notebook.id } })

			return { notebook }
		},
		// If the api call fails, set the isDeleted flag to true, so that it goes into the user's recycle bin.
		// Then, send the failed api call to a queue that will retry the api call if needed.
		onError: (err, _vars, context) => {
			console.error("[useNotebookMutations.ts/[DELETE_NOTEBOOK_SERVER]: Mutation failed.", err)
			dispatch({
				type: "UPDATE_NOTEBOOK",
				payload: { id: context?.notebook.id!, updates: { isDeleted: true } },
			})
		},
		onSuccess: () => console.log("Notebook deleted"),
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

			dispatch({ type: "SELECT_CHAPTER", payload: tempId })

			return { tempId, notebookId: req.notebookId }
		},
		onError: (err) => {
			console.error("[useNotebookMutations.ts/CREATE_CHAPTER_SERVER]: Mutation failed.", err)
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

			dispatch({ type: "SELECT_CHAPTER", payload: data.id })
		},
	})

	const editChapterServer = (chapterId: string, input: string) => console.log("Editing chapter")

	const deleteChapterServer = useMutation({
		mutationFn: (chapter: Chapter) => deleteChapter(chapter.id),
		onMutate: async (chapter: Chapter) => {
			// Optimistically delete chapter before sending an api call.
			dispatch({
				type: "DELETE_CHAPTER",
				payload: { id: chapter.id, notebookId: chapter.notebookId },
			})

			// If there are no other chapters, delete the last one and create a fresh chapter.
			const notebook = getNotebook(notebookState.notebooks, chapter.notebookId)
			// Get the remaining chapters in the notebook.
			const remaining =
				notebook?.chapters.filter((ch) => ch.id !== chapter.id && !ch.isDeleted) ?? []

			// If there are other chapters in the notebook, select the previous chapter.
			if (remaining.length > 0) {
				const fallback = remaining.find((ch) => ch.order === chapter.order - 1)
				dispatch({ type: "SELECT_CHAPTER", payload: fallback?.id! })
				dispatch({ type: "SELECT_CANVAS", payload: fallback?.canvases[0].id! })
			} else {
				createChapterServer.mutate({
					notebookId: chapter.notebookId,
					title: "Chapter 1",
					order: 0,
				})
			}

			return { chapter }
		},
		onError: (err, _vars, context) => {
			console.log("[useNotebookMutations.ts/[DELETE_CHAPTER_SERVER]: Mutation failed.", err)
			dispatch({
				type: "UPDATE_CHAPTER",
				payload: {
					id: context?.chapter.id!,
					notebookId: context?.chapter.notebookId!,
					updates: { isDeleted: true },
				},
			})
		},
		onSuccess: () => console.log("Chapter deleted"),
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
		onError: (err) => {
			console.error("[useNotebookMutations.ts/CREATE_CANVAS_SERVER]: Mutation failed.", err)
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

	const createPathsServer = useMutation({
		mutationFn: (req: PathRequest[]) => createPaths(req),
		onMutate: async () => {
			const notebookId = notebookState.selectedNotebookId!
			const chapterId = notebookState.selectedChapterId!
			const canvasId = notebookState.selectedCanvasId!
			return { notebookId, chapterId, canvasId }
		},
		onError: (err) =>
			console.error("[useNotebookMutations.ts/CREATE_PATH_SERVER]: Mutation failed.", err),
		onSuccess: (data: PathCreateResponse[], _vars, context) => {
			const notebookId = context?.notebookId
			const chapterId = context?.chapterId
			const canvasId = context?.canvasId

			data.forEach((d) => {
				dispatch({
					type: "UPDATE_PATH",
					payload: {
						notebookId,
						chapterId,
						canvasId,
						id: d.tempId,
						updates: { id: d.id },
					},
				})
			})
		},
	})

	const deletePathsServer = useMutation({
		mutationFn: (ids: string[]) => deletePaths(ids),
		onError: (err) =>
			console.error("[useNotebookMutations.ts/DELETE_PATH_SERVER]: Mutation failed.", err),
	})

	const syncWithServer = useMutation({
		mutationFn: (req: any) => sync(req),
		onError: (err) =>
			console.error("[useNotebookMutations.ts/SYNC_WITH_SERVER]: Mutation failed.", err),
	})

	return {
		createNotebookServer,
		editNotebookServer,
		deleteNotebookServer,
		createChapterServer,
		editChapterServer,
		deleteChapterServer,
		createCanvasServer,
		createPathsServer,
		deletePathsServer,
		syncWithServer,
	}
}
