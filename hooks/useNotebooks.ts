import { useNotebook } from "../contexts/NotebookContext"
import { Notebook } from "../types/notebook"
import { addCanvas, addChapter, createNotebook } from "../utils/notebook"

export default function useNotebooks() {
	const { notebooks, setNotebooks, notebook, setNotebook, chapter, setChapter, canvas, setCanvas } =
		useNotebook()

	const addNotebook = (title: string) => {
		const notebook = createNotebook(title)
		setNotebooks((prev) => [...prev, notebook])
		setNotebook(notebook)
		setChapter(notebook.chapters[0])
		setCanvas(notebook.chapters[0].canvases[0])
	}

	const addChapterToCurrentNotebook = (title: string) => {
		if (!notebook) return
		const updated = addChapter(notebook, title)
		setNotebook(updated)
	}

	const addCanvasToCurrentChapter = () => {
		if (!notebook || !chapter) return
		const updated = addCanvas(chapter)
		setChapter(updated)
	}

	return {
		addNotebook,
		addChapterToCurrentNotebook,
		addCanvasToCurrentChapter,
	}
}
