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
export const createCanvas = (): Canvas => ({
	id: uuid.v4() as string,
	paths: [],
	undoStack: [],
	redoStack: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
	lastAccessedAt: Date.now(),
})

/////////////////////////////////////////
// Mutation Functions
/////////////////////////////////////////
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
							updatedAt: Date.now().toString(),
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
