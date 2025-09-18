/**
 * Notebook Util
 *
 * Contains helper functions for notebook related content -- including making new notebooks,
 * chapters, and canvases.
 */

import { Canvas, Chapter, Notebook } from "../types/notebook"
import uuid from "react-native-uuid"

/////////////////////////////////////////
// Factory Functions
/////////////////////////////////////////
// Creates a new canvas/page.
const createCanvas = (): Canvas => ({
	id: uuid.v4() as string,
	paths: [],
	undoStack: [],
	redoStack: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
})

/**
 * Creates a new chapter.
 *
 * @param title - Name of the new chapter.
 * @returns A named chapter with a canvas.
 */
const createChapter = (title: string): Chapter => ({
	id: uuid.v4() as string,
	title: title || "My Chapter",
	canvases: [createCanvas()],
	createdAt: Date.now(),
	updatedAt: Date.now(),
})

/**
 * Creates a new notebook.
 *
 * @param title - Name of the new notebook.
 * @returns A named notebook with one chapter called "Chapter 1" and one canvas.
 */
export const createNotebook = (title: string): Notebook => ({
	id: uuid.v4() as string,
	title: title || "My Notebook",
	chapters: [createChapter("Chapter 1")],
	createdAt: Date.now().toString(),
	updatedAt: Date.now().toString(),
	color: "blue",
})

/////////////////////////////////////////
// Mutation Functions
/////////////////////////////////////////
/**
 * Creates a new chapter and adds it to the specified notebook.
 *
 * @param notebook - The notebook the chapter will belong to.
 * @param title - Name of the new chapter.
 * @returns An empty chapter with an array of canvases inside the selected notebook.
 */
export const addChapter = (
	notebooks: Notebook[],
	notebookId: string,
	title: string
): Notebook[] => {
	const updatedNotebooks = notebooks.map((n) =>
		n.id === notebookId
			? {
					...n,
					chapters: [...n.chapters, createChapter(title)],
					updatedAt: Date.now().toString(),
			  }
			: n
	)

	return updatedNotebooks
}

/**
 * Creates a new canvas and adds it to the specified chapter.
 *
 * @param chapter - The chapter the canvas will belong to.
 * @returns An empty canvas inside the selected chapter.
 */
export const addCanvas = (
	notebooks: Notebook[],
	notebookId: string,
	chapterId: string
): Notebook[] => {
	const updatedNotebooks = notebooks.map((n) => {
		if (n.id !== notebookId) return n

		return {
			...n,
			chapters: n.chapters.map((ch) =>
				ch.id === chapterId
					? {
							...ch,
							canvases: [...ch.canvases, createCanvas()],
							updatedAt: Date.now(),
					  }
					: ch
			),
			updatedAt: Date.now().toString(),
		}
	})

	return updatedNotebooks
}

/////////////////////////////////////////
// Getter Functions
/////////////////////////////////////////
export const getNotebook = (notebooks: Notebook[], notebookId: string): Notebook | undefined => {
	const notebook = notebooks.find((n) => n.id === notebookId)
	return notebook
}

export const getChapter = (
	notebooks: Notebook[],
	notebookId: string,
	chapterId: string
): Chapter | undefined => {
	const notebook = getNotebook(notebooks, notebookId)
	const chapter = notebook?.chapters.find((c) => c.id === chapterId)
	return chapter
}

export const getCanvas = (
	notebooks: Notebook[],
	notebookId: string,
	chapterId: string,
	canvasId: string
): Canvas | undefined => {
	const chapter = getChapter(notebooks, notebookId, chapterId)
	const canvas = chapter?.canvases.find((c) => c.id === canvasId)
	return canvas
}
