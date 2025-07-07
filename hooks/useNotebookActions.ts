/**
 * useNotebookActions Hook
 *
 * Contains all the required functions related to notebooks, chapters, and canvases.
 * Also contains helper functions that open a modal when required.
 */

import { useModal, ModalType } from "../contexts/ModalContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { PathType } from "../types/global"
import { Notebook } from "../types/notebook"
import { addCanvas, addChapter, createNotebook } from "../utils/notebook"

export default function useNotebookActions() {
	// Get context values.
	const {
		notebooks,
		setNotebooks,
		selectedNotebookId,
		setSelectedNotebookId,
		selectedChapterId,
		setSelectedChapterId,
		selectedCanvasId,
		setSelectedCanvasId,
	} = useNotebookContext()
	const { openModal, setInput } = useModal()

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
		setNotebooks((prev) => [...prev, notebook])
		setSelectedNotebookId(notebook.id)

		const chapter = notebook.chapters[0]
		setSelectedChapterId(chapter.id)
		setSelectedCanvasId(chapter.canvases[0].id)
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
		if (!selectedNotebookId) return

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
		if (!selectedNotebookId || !selectedChapterId) return
		const updatedNotebook = addCanvas(notebooks, selectedNotebookId, selectedChapterId)
		setNotebooks(updatedNotebook)
	}

	/**
	 * Helper function that adds a new path to the canvas.
	 * @param newPathObject - The new path drawn by the user.
	 */
	const addPathToCanvas = (newPathObject: PathType) => {
		if (!selectedNotebookId || !selectedChapterId || !selectedCanvasId) return

		// Deep copy notebooks
		const updatedNotebooks = [...notebooks]

		// Find notebook, chapter, and canvas indexes
		const notebookIndex = updatedNotebooks.findIndex((n) => n.id === selectedNotebookId)
		if (notebookIndex === -1) return

		const chapterIndex = updatedNotebooks[notebookIndex].chapters.findIndex(
			(ch) => ch.id === selectedChapterId
		)
		if (chapterIndex === -1) return

		const canvasIndex = updatedNotebooks[notebookIndex].chapters[chapterIndex].canvases.findIndex(
			(cv) => cv.id === selectedCanvasId
		)
		if (canvasIndex === -1) return

		// Clone and modify the canvas.
		const currentCanvas =
			updatedNotebooks[notebookIndex].chapters[chapterIndex].canvases[canvasIndex]
		const updatedCanvas = {
			...currentCanvas,
			paths: [...currentCanvas.paths, newPathObject],
			updatedAt: Date.now(),
		}

		// Apply the updates
		updatedNotebooks[notebookIndex].chapters[chapterIndex].canvases[canvasIndex] = updatedCanvas
		updatedNotebooks[notebookIndex].chapters[chapterIndex].updatedAt = Date.now()
		updatedNotebooks[notebookIndex].updatedAt = Date.now()

		// Set the new notebooks array state.
		setNotebooks(updatedNotebooks)
	}

	return {
		handleCreateNotebook,
		handleEditNotebook,
		handleDeleteNotebook,
		handleNewChapter,
		handleNewCanvas,
		addPathToCanvas,
	}
}
