/**
 * useNotebookActions Hook
 *
 * Contains all the required functions related to notebooks, chapters, and canvases.
 * Also contains helper functions that open a modal when required.
 */

import { useModal } from "../contexts/ModalContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { addCanvas, addChapter, createNotebook } from "../utils/notebook"

export default function useNotebookActions() {
	// Get context values.
	const { setNotebooks, notebook, setNotebook, chapter, setChapter, setCanvas } =
		useNotebookContext()
	const { openModal } = useModal()

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
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			buttonText: "Create Notebook",
			onSubmit: (input: string) => addNotebook(input),
		})
	}

	// Helper function to create a new chapter with a title.
	const handleNewChapter = () => {
		openModal({
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter name...",
			buttonText: "Create Chapter",
			onSubmit: (input) => addChapterToCurrentNotebook(input),
		})
	}

	return {
		handleCreateNotebook,
		handleNewChapter,
		addCanvasToCurrentChapter,
	}
}
