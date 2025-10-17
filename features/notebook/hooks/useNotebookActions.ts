/**
 * useNotebookActions Hook
 *
 * Contains all the required functions related to notebooks, chapters, and canvases.
 * Also contains helper functions that open a modal when required.
 */

import { PathType } from "../../drawing/types/DrawingTypes"
import { useModal } from "../../common/contexts/ModalContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { Canvas, Chapter, Notebook } from "../../../types/notebook"
import { getCanvas } from "../../../utils/notebook"
import { useNotebookMutations } from "./useNotebookMutations"
import { mapToPathRequest, PathRequest } from "../api/api"
import { Color } from "../../../types/global"

export default function useNotebookActions() {
	// Get context values.
	const { notebookState, dispatch } = useNotebookContext()
	const { openModal } = useModal()
	const {
		createNotebookServer,
		editNotebookServer,
		deleteNotebookServer,
		createChapterServer,
		editChapterServer,
		deleteChapterServer,
		createCanvasServer,
		createPathsServer,
		deletePathsServer,
	} = useNotebookMutations()

	// const activeNotebook = getNotebook(notebooks, selectedNotebookId)
	// const activeChapter = getChapter(notebooks, selectedNotebookId, selectedChapterId)
	const activeCanvas = getCanvas(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId,
		notebookState.selectedCanvasId
	)

	const MAX_UNDO_HISTORY = 100
	const MAX_REDO_HISTORY = 100

	/////////////////////////////////////////
	// UI Aware Functions
	/////////////////////////////////////////
	// Helper function to create a new notebook with a title.
	const handleCreateNotebook = () => {
		openModal({
			type: "input",
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			color: true,
			buttonText: "Create",
			onSubmit: (input: string, color?: Color) =>
				createNotebookServer.mutate({ title: input, color }),
		})
	}

	// Helper function to edit a notebook's title and cover fill.
	const handleEditNotebook = (notebook: Notebook) => {
		openModal({
			type: "input",
			title: `Edit ${notebook.title}`,
			description: "Change your notebook's name and cover icon color.",
			placeholder: "Enter notebook name...",
			buttonText: "Apply",
			onSubmit: (input: string) => editNotebookServer(notebook.id, input),
		})
	}

	const handleDeleteNotebook = (notebook: Notebook) => {
		openModal({
			type: "confirm",
			title: `Delete ${notebook.title}?`,
			description: "Are you sure you want to delete this notebook?",
			buttonText: "Delete",
			onSubmit: () => deleteNotebookServer.mutate(notebook),
		})
	}

	// Helper function to create a new chapter with a title.
	const handleCreateChapter = () => {
		openModal({
			type: "input",
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter name...",
			buttonText: "Create",
			onSubmit: (input: string) => {
				const notebook = notebookState.notebooks.find(
					(n) => n.id === notebookState.selectedNotebookId
				)
				if (!notebook) throw new Error("Notebook not found.")

				const order = notebook.chapters.length

				// Create chapter here
				createChapterServer.mutate({
					title: input,
					notebookId: notebookState.selectedNotebookId!,
					order,
				})
			},
		})
	}

	// Helper function to edit a chapter.
	const handleEditChapter = (chapter: Chapter) => {
		openModal({
			type: "input",
			title: `Edit ${chapter.title}`,
			description: "Change your chapter's name.",
			placeholder: "Enter chapter name...",
			buttonText: "Apply",
			onSubmit: (input: string) => editChapterServer(chapter.id, input),
		})
	}

	// Helper function to delete a chapter.
	const handleDeleteChapter = (chapter: Chapter) => {
		openModal({
			type: "confirm",
			title: `Delete ${chapter.title}?`,
			description: "Are you sure you want to delete this notebook?",
			buttonText: "Delete",
			onSubmit: () => deleteChapterServer.mutate(chapter),
		})
	}

	// Helper function to create a new canvas.
	const handleCreateCanvas = (order: number = 0) => {
		createCanvasServer.mutate({ chapterId: notebookState.selectedChapterId!, order })
	}

	/////////////////////////////////////////
	// Canvas State Management
	/////////////////////////////////////////
	// Create a snapshot of the canvas.
	const createSnapshot = () => {
		if (!activeCanvas) return

		return {
			paths: [...activeCanvas.paths],
		}
	}

	/**
	 * Helper function that adds a new path to the canvas.
	 * @param newPath - The new path drawn by the user.
	 */
	const addPathToCanvas = (newPathObject: PathType) => {
		if (!activeCanvas) return

		const snapshot = createSnapshot()

		const updatedCanvas = {
			...activeCanvas,
			paths: [...activeCanvas.paths, newPathObject],
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		// Create path here
		createPathsServer.mutate([mapToPathRequest(newPathObject)])

		updateCanvas(updatedCanvas)
	}

	const handleErase = (x: number, y: number, size: number, width: number, height: number) => {
		if (!activeCanvas) return

		const paths = activeCanvas.paths

		if (!paths || paths.length === 0) return

		const normX = x / width
		const normY = y / height
		const r = size / 2

		paths.forEach((p) => {
			if (p.bbox.minX > normX || p.bbox.maxX < normX || p.bbox.minY > normY || p.bbox.maxY < normY)
				return

			p.points.forEach((pt) => {
				const dist = Math.sqrt(Math.pow(pt.x * width - x, 2) + Math.pow(pt.y * height - y, 2))
				if (dist <= r) {
					const snapshot = createSnapshot()

					const updatedCanvas = {
						...activeCanvas,
						paths: paths.filter((path) => path.id !== p.id),
						undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
						redoStack: [],
						updatedAt: Date.now(),
					}

					updateCanvas(updatedCanvas)
				}
			})

			return
		})
	}

	// Undo the last action by the user.
	const undo = () => {
		if (!activeCanvas) return

		const lastItem = activeCanvas.undoStack.at(-1)
		if (!lastItem) return

		const prevSnapshot = activeCanvas.undoStack.slice(0, -1)

		const updatedCanvas = {
			...activeCanvas,
			paths: [...lastItem.paths],
			undoStack: prevSnapshot,
			redoStack: limitStackSize(
				pushToStack(activeCanvas.redoStack, activeCanvas),
				MAX_REDO_HISTORY
			),
			updatedAt: Date.now(),
		}

		// Previous and current paths arrays.
		const currPaths = activeCanvas.paths
		const prevPaths = [...lastItem.paths]
		syncPaths(currPaths, prevPaths)

		updateCanvas(updatedCanvas)
	}

	// Redo the last undone action.
	const redo = () => {
		if (!activeCanvas) return

		const lastItem = activeCanvas.redoStack.at(-1)
		if (!lastItem) return

		const prevSnapshot = activeCanvas.redoStack.slice(0, -1)

		const updatedCanvas = {
			...activeCanvas,
			paths: [...lastItem.paths],
			undoStack: limitStackSize(
				pushToStack(activeCanvas.undoStack, activeCanvas),
				MAX_UNDO_HISTORY
			),
			redoStack: prevSnapshot,
			updatedAt: Date.now(),
		}

		// Previous and current paths arrays.
		const prevPaths = activeCanvas.paths
		const currPaths = [...lastItem.paths]
		syncPaths(prevPaths, currPaths)

		updateCanvas(updatedCanvas)
	}

	// Clears the current canvas.
	const clearCanvas = () => {
		if (!activeCanvas) return

		const snapshot = createSnapshot()

		const pathIdsToDelete = activeCanvas.paths.map((path) => path.id)

		const updatedCanvas = {
			...activeCanvas,
			paths: [],
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		if (pathIdsToDelete.length > 0) {
			deletePathsServer.mutate(pathIdsToDelete)
		}

		updateCanvas(updatedCanvas)
	}

	/**
	 * Helper function to update the canvas from the notebooks array.
	 * @param newCanvas - The new canvas state
	 */
	const updateCanvas = (newCanvas: Canvas) => {
		if (!activeCanvas) return

		dispatch({
			type: "UPDATE_CANVAS",
			payload: {
				notebookId: notebookState.selectedNotebookId!,
				chapterId: notebookState.selectedChapterId!,
				id: activeCanvas.id,
				updates: newCanvas,
			},
		})
	}

	// Helper to push items onto both undo and redo stacks.
	const pushToStack = (stack: any[], canvas: Canvas) => [...stack, { paths: [...canvas.paths] }]

	// Helper to limit stack sizes for better memory usage.
	const limitStackSize = (stack: any[], max: number) =>
		stack.length >= max ? stack.slice(stack.length - max + 1) : stack

	// Helper to delete and add paths from the database.
	const syncPaths = (prevPaths: PathType[], currPaths: PathType[]) => {
		if (prevPaths.length === currPaths.length) {
			// Intentionally left empty.
			return
		} else if (prevPaths.length > currPaths.length) {
			// Delete the extra paths after operation.
			let pathsToDelete: string[] = []
			prevPaths.forEach((prevPath) => {
				if (!currPaths.some((currPath) => currPath.id === prevPath.id)) {
					pathsToDelete.push(prevPath.id)
				}
			})

			if (pathsToDelete.length > 0) {
				deletePathsServer.mutate(pathsToDelete)
			}
		} else if (prevPaths.length < currPaths.length) {
			// Add back the previous paths after operation.
			let pathsToAdd: PathRequest[] = []
			currPaths.forEach((currPath) => {
				if (!prevPaths.some((prevPath) => prevPath.id === currPath.id)) {
					pathsToAdd.push(mapToPathRequest(currPath))
				}
			})

			if (pathsToAdd.length > 0) {
				createPathsServer.mutate(pathsToAdd)
			}
		}
	}

	// Helpers to allow for checking if undo and redo are enabled.
	const canUndo = () => activeCanvas && activeCanvas.undoStack.length > 0
	const canRedo = () => activeCanvas && activeCanvas.redoStack.length > 0

	return {
		handleCreateNotebook,
		handleEditNotebook,
		handleDeleteNotebook,
		handleCreateChapter,
		handleEditChapter,
		handleDeleteChapter,
		handleCreateCanvas,
		addPathToCanvas,
		handleErase,
		undo,
		canUndo,
		redo,
		canRedo,
		clearCanvas,
	}
}
