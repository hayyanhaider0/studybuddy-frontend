import { useModal } from "../contexts/ModalContext"
import { useNotebook } from "../contexts/NotebookContext"
import { addCanvas, addChapter, createNotebook } from "../utils/notebook"

export default function useNotebooks() {
	const { setNotebooks, notebook, setNotebook, chapter, setChapter, setCanvas } = useNotebook()
	const { openModal } = useModal()

	const addNotebook = (title: string) => {
		const notebook = createNotebook(title)
		setNotebooks((prev) => [...prev, notebook])
		setNotebook(notebook)
		setChapter(notebook.chapters[0])
		setCanvas(notebook.chapters[0].canvases[0])
	}

	const addChapterToCurrentNotebook = (title: string) => {
		if (!notebook) return
		const updatedNotebook = addChapter(notebook, title)
		setNotebook(updatedNotebook)
	}

	const addCanvasToCurrentChapter = () => {
		if (!notebook || !chapter) return
		const updatedChapter = addCanvas(chapter)

		const updatedNotebook = {
			...notebook,
			chapters: notebook.chapters.map((c) => (c.id === chapter.id ? updatedChapter : c)),
			updatedAt: Date.now(),
		}

		setChapter(updatedChapter)
		setNotebook(updatedNotebook)
	}

	const handleCreateNotebook = () => {
		openModal({
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			buttonText: "Create Notebook",
			onSubmit: (input: string) => addNotebook(input),
		})
	}

	// Allows the user to create a new chapter with a title.
	const handleNewChapter = () => {
		openModal({
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter title...",
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
