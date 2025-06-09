/**
 * Notebook Util
 *
 * Contains helper functions for notebook related content -- including making new notebooks,
 * chapters, and canvases.
 */

import { Chapter, Notebook } from "../types/notebook"

/**
 * Creates a new notebook.
 *
 * @param title - Name of the new notebook.
 * @returns An empty named notebook.
 */
export const createNotebook = (title: string): Notebook => ({
	id: crypto.randomUUID(),
	title,
	chapters: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
})

/**
 * Creates a new chapter and adds it to the specified notebook.
 *
 * @param notebook - The notebook the chapter will belong to.
 * @param title - Name of the new chapter.
 * @returns An empty chapter with an array of canvases inside the selected notebook.
 */
export const addChapter = (notebook: Notebook, title: string): Notebook => {
	const newChapter: Chapter = {
		id: crypto.randomUUID(),
		title,
		canvases: [],
		createdAt: Date.now(),
		updatedAt: Date.now(),
	}

	return {
		...notebook,
		chapters: [...notebook.chapters, newChapter],
		updatedAt: Date.now(),
	}
}
