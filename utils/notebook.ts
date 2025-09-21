/**
 * Notebook Util
 *
 * Contains helper functions for notebook related content -- including making new notebooks,
 * chapters, and canvases.
 */

import { Canvas, Chapter, Notebook } from "../types/notebook"

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
