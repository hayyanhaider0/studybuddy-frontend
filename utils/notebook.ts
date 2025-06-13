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
 * @returns A named notebook with a new chapter called "Chapter 1".
 */
export const createNotebook = (title: string): Notebook => ({
	id: uuid.v4() as string,
	title: title || "My Notebook",
	chapters: [createChapter("Chapter 1")],
	createdAt: Date.now(),
	updatedAt: Date.now(),
	fill: "blue",
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
export const addChapter = (notebook: Notebook, title: string): Notebook => ({
	...notebook,
	chapters: [...notebook.chapters, createChapter(title)],
	updatedAt: Date.now(),
})

export const addCanvas = (chapter: Chapter): Chapter => ({
	...chapter,
	canvases: [...chapter.canvases, createCanvas()],
	updatedAt: Date.now(),
})
