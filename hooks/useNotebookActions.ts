/**
 * useNotebookActions Hook
 *
 * Contains all the required functions related to notebooks, chapters, and canvases.
 * Also contains helper functions that open a modal when required.
 */

import { useModal, ModalType } from "../contexts/ModalContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { PathType } from "../types/global"
import { Canvas, Notebook } from "../types/notebook"
import {
	addCanvas,
	addChapter,
	createNotebook,
	getCanvas,
	getChapter,
	getNotebook,
} from "../utils/notebook"

export default function useNotebookActions() {
	// Get context values.
	const { notebooks, setNotebooks, selectedNotebookId, selectedChapterId, selectedCanvasId } =
		useNotebookContext()
	const { openModal, setInput } = useModal()

	const activeNotebook = getNotebook(notebooks, selectedNotebookId)
	const activeChapter = getChapter(notebooks, selectedNotebookId, selectedChapterId)
	const activeCanvas = getCanvas(notebooks, selectedNotebookId, selectedChapterId, selectedCanvasId)

	const MAX_UNDO_HISTORY = 100
	const MAX_REDO_HISTORY = 100

	/////////////////////////////////////////
	// Updater Functions
	/////////////////////////////////////////
	/**
	 * Adds a notebook for the user.
	 *
	 * @param title - Name of the new notebook.
	 */
	const addNotebook = (title: string) => {
		const notebook = createNotebook(title)
		const updatedNotebooks = [...notebooks, notebook]
		setNotebooks(updatedNotebooks)
	}

	/**
	 * Edits a notebook for the user.
	 *
	 * @param notebook - Notebook to be edited.
	 * @param title - New chapter title, if any.
	 * @param fill - New cover icon color, if any.
	 */
	const editNotebook = (notebookId: string, title?: string, fill?: string) => {
		const updated = notebooks.map((n) =>
			n.id === notebookId
				? { ...n, title: title ?? n.title, fill: fill ?? n.fill, updatedAt: Date.now() }
				: n
		)
		setNotebooks(updated)
	}

	/**
	 * Deletes a notebook from the user's account.
	 * @param notebook - Notebook to be deleted
	 */
	const deleteNotebook = (notebookId: string) => {
		const updated = notebooks.filter((n) => n.id !== notebookId)
		setNotebooks(updated)
	}

	/////////////////////////////////////////
	// UI Aware Functions
	/////////////////////////////////////////
	// Helper function to create a new notebook with a title.
	const handleCreateNotebook = () => {
		openModal({
			type: ModalType.INPUT,
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			buttonText: "Create",
			onSubmit: (input: string) => addNotebook(input),
		})
	}

	// Helper function to edit a notebook's title and cover fill.
	const handleEditNotebook = (notebook: Notebook) => {
		setInput(notebook.title)
		openModal({
			type: ModalType.INPUT,
			title: `Edit ${notebook.title}`,
			description: "Change your notebook's name and cover icon color.",
			setInput: notebook.title,
			placeholder: "Enter notebook name...",
			buttonText: "Apply",
			onSubmit: (input: string) => editNotebook(notebook.id, input),
		})
	}

	const handleDeleteNotebook = (notebook: Notebook) => {
		openModal({
			type: ModalType.CONFIRM,
			title: `Delete ${notebook.title}?`,
			description:
				"Are you sure you want to delete this notebook? This action can not be undone, and all of your progress will be lost.",
			buttonText: "Delete",
			onConfirm: () => deleteNotebook(notebook.id),
		})
	}

	// Helper function to create a new chapter with a title.
	const handleNewChapter = () => {
		openModal({
			type: ModalType.INPUT,
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter name...",
			buttonText: "Create",
			onSubmit: (input) => {
				const updated = addChapter(notebooks, selectedNotebookId, input)
				setNotebooks(updated)
			},
		})
	}

	// Helper function to create a new canvas
	const handleNewCanvas = () => {
		const updatedNotebook = addCanvas(notebooks, selectedNotebookId, selectedChapterId)
		setNotebooks(updatedNotebook)
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
	 * @param newPathObject - The new path drawn by the user.
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

		updateCanvas(updatedCanvas)
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

		updateCanvas(updatedCanvas)
	}

	// Clears the current canvas.
	const clearCanvas = () => {
		if (!activeCanvas) return

		const snapshot = createSnapshot()

		const updatedCanvas = {
			...activeCanvas,
			paths: [],
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		updateCanvas(updatedCanvas)
	}

	/**
	 * Helper function to update the canvas from the notebooks array.
	 * @param newCanvas - The new canvas state
	 */
	const updateCanvas = (newCanvas: Canvas) => {
		if (!activeNotebook || !activeChapter || !activeCanvas) return

		// Update the chapter
		const updatedChapter = {
			...activeChapter,
			canvases: activeChapter.canvases.map((cv) => (cv.id === newCanvas.id ? newCanvas : cv)),
			updatedAt: Date.now(),
		}

		// Update the notebook
		const updatedNotebook = {
			...activeNotebook,
			chapters: activeNotebook.chapters.map((ch) =>
				ch.id === updatedChapter.id ? updatedChapter : ch
			),
			updatedAt: Date.now(),
		}

		// Update the notebooks array
		const updatedNotebooks = notebooks.map((n) =>
			n.id === updatedNotebook.id ? updatedNotebook : n
		)

		// Set the notebooks array
		setNotebooks(updatedNotebooks)
	}

	// Helper to push items onto both undo and redo stacks.
	const pushToStack = (stack: any[], canvas: Canvas) => [...stack, { paths: [...canvas.paths] }]

	// Helper to limit stack sizes for better memory usage.
	const limitStackSize = (stack: any[], max: number) =>
		stack.length >= max ? stack.slice(stack.length - max + 1) : stack

	// Helpers to allow for checking if undo and redo are enabled
	const canUndo = () => activeCanvas && activeCanvas.undoStack.length > 0
	const canRedo = () => activeCanvas && activeCanvas.redoStack.length > 0

	return {
		handleCreateNotebook,
		handleEditNotebook,
		handleDeleteNotebook,
		handleNewChapter,
		handleNewCanvas,
		addPathToCanvas,
		undo,
		canUndo,
		redo,
		canRedo,
		clearCanvas,
	}
}
