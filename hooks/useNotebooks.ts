import { useNotebook } from "../contexts/NotebookContext"
import { addCanvas, addChapter, createNotebook } from "../utils/notebook"

export default function useNotebooks() {
	const { setNotebooks, notebook, setNotebook, chapter, setChapter, setCanvas } = useNotebook()

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

	return {
		addNotebook,
		addChapterToCurrentNotebook,
		addCanvasToCurrentChapter,
	}
}
