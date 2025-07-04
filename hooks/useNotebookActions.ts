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
		notebook,
		setNotebook,
		chapter,
		setChapter,
		setCanvas,
		activeCanvasId,
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
		setNotebook(notebook)
		setChapter(notebook.chapters[0])
		setCanvas(notebook.chapters[0].canvases[0])
	}

	/**
	 * Edits a notebook for the user.
	 *
	 * @param notebook - Notebook to be edited.
	 * @param title - New chapter title, if any.
	 * @param fill - New cover icon color, if any.
	 */
	const editNotebook = (notebook: Notebook, title?: string, fill?: string) => {
		const updated = notebooks.map((n) =>
			n.id === notebook.id
				? { ...n, title: title ?? n.title, fill: fill ?? n.fill, updatedAt: Date.now() }
				: n
		)
		setNotebooks(updated)
	}

	/**
	 * Deletes a notebook from the user's account.
	 * @param notebook - Notebook to be deleted
	 */
	const deleteNotebook = (notebook: Notebook) => {
		const updated = notebooks.filter((n) => n.id !== notebook.id)
		setNotebooks(updated)
	}

	/**
	 * Adds a chapter to the active notebook.
	 *
	 * @param title - Name of the new chapter.
	 */
	const addChapterToCurrentNotebook = (title: string) => {
		if (!notebook) return // Exit if there's no active notebook.
		const updatedNotebook = addChapter(notebook, title)
		setNotebook(updatedNotebook)
	}

	// Adds a canvas/page to the active chapter.
	const addCanvasToCurrentChapter = () => {
		if (!notebook || !chapter) return // Exit if there's no active notebook or chapter.
		const updatedChapter = addCanvas(chapter)

		// Update the notebook after adding a canvas to the chapter.
		const updatedNotebook = {
			...notebook,
			chapters: notebook.chapters.map((c) => (c.id === chapter.id ? updatedChapter : c)),
			updatedAt: Date.now(),
		}

		setChapter(updatedChapter)
		setNotebook(updatedNotebook)
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
			onSubmit: (input: string) => editNotebook(notebook, input),
		})
	}

	const handleDeleteNotebook = (notebook: Notebook) => {
		openModal({
			type: ModalType.CONFIRM,
			title: `Delete ${notebook.title}?`,
			description:
				"Are you sure you want to delete this notebook? This action can not be undone, and all of your progress will be lost.",
			buttonText: "Delete",
			onConfirm: () => deleteNotebook(notebook),
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
			onSubmit: (input) => addChapterToCurrentNotebook(input),
		})
	}

	/**
	 * Helper function that adds a new path to the canvas.
	 * @param newPathObject - The new path drawn by the user.
	 */
	const addPathToCanvas = (newPathObject: PathType) => {
		// Update notebook.
		setNotebook((prev) => {
			if (!prev) return prev

			// Update chapter.
			const updatedChapters = prev.chapters.map((ch) =>
				ch.id === chapter?.id
					? {
							...ch,
							// Update canvas.
							canvases: ch.canvases.map((c) =>
								c.id === activeCanvasId
									? {
											...c,
											paths: [...(c.paths || []), newPathObject],
											updatedAt: Date.now(),
									  }
									: c
							),
							updatedAt: Date.now(),
					  }
					: ch
			)

			return {
				...prev,
				chapters: updatedChapters,
				updatedAt: Date.now(),
			}
		})
	}

	return {
		handleCreateNotebook,
		handleEditNotebook,
		handleDeleteNotebook,
		handleNewChapter,
		addCanvasToCurrentChapter,
		addPathToCanvas,
	}
}
