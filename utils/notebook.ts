/**
 * Notebook Util
 *
 * Contains helper functions for notebook related content -- including making new notebooks,
 * chapters, and canvases.
 */

import { PathType } from "../features/drawing/types/DrawingTypes"
import { Canvas, Chapter, Notebook } from "../types/notebook"
import { Color } from "../types/global"
import uuid from "react-native-uuid"

/**
 * Builds a tree structure of notebooks, chapters, canvases, and paths using data received from the API.
 *
 * @param notebooks - List of notebooks received from the API.
 * @param chapters - List of chapters received from the API.
 * @param canvases - List of canvases received from the API.
 * @param paths - List of paths received from the API.
 * @returns A tree structure of notebooks, chapters, canvases, and paths.
 */
export const buildNotebooksTree = (
	notebooks: Notebook[],
	chapters: Chapter[],
	canvases: Canvas[],
	paths: PathType[]
): Notebook[] => {
	return notebooks.map((nb) => {
		// Chapters that already exist on the notebook
		const notebookChapters = nb.chapters?.map((ch) => mapChapter(ch, canvases, paths)) || []

		// Chapters fetched separately that aren't in notebook.chapters yet
		const extraChapters = chapters
			.filter((ch) => ch.notebookId === nb.id && !notebookChapters.some((c) => c.id === ch.id))
			.map((ch) => mapChapter(ch, canvases, paths))

		return {
			...nb,
			chapters: [...notebookChapters, ...extraChapters],
		}
	})
}

const mapChapter = (ch: Chapter, canvases: Canvas[], paths: PathType[]): Chapter => {
	// Canvases that already exist on the chapter
	const chapterCanvases = ch.canvases?.map((cv) => mapCanvas(cv, paths)) || []

	// Canvases fetched separately that aren't in chapter.canvases yet
	const extraCanvases = canvases
		.filter((cv) => cv.chapterId === ch.id && !chapterCanvases.some((c) => c.id === cv.id))
		.map((cv) => mapCanvas(cv, paths))

	return {
		...ch,
		canvases: [...chapterCanvases, ...extraCanvases],
	}
}

const mapCanvas = (cv: Canvas, paths: PathType[]): Canvas => {
	const canvasPaths = paths.filter((p) => p.canvasId === cv.id)
	return {
		...cv,
		paths: canvasPaths,
	}
}

/////////////////////////////////////////
// Mutator Functions
/////////////////////////////////////////
export const addNotebook = (title: string, color: Color, now: number, num: number): Notebook => {
	const id = `temp-${uuid.v4()}`
	const notebook: Notebook = {
		id,
		title: title || `Notebook ${num}`,
		chapters: [addChapter(id, `Chapter 1`, 0, now)],
		createdAt: now,
		updatedAt: now,
		lastAccessedAt: now,
		color,
		isDeleted: false,
	}

	return notebook
}

export const addChapter = (
	notebookId: string,
	title: string,
	order: number,
	now: number
): Chapter => {
	const id = `temp-${uuid.v4()}`
	const chapter: Chapter = {
		id,
		notebookId,
		title: title || `Chapter ${order + 1}`,
		canvases: [addCanvas(id, notebookId, 0, now)],
		order,
		createdAt: now,
		updatedAt: now,
		isDeleted: false,
	}

	return chapter
}

export const addCanvas = (
	chapterId: string,
	notebookId: string,
	order: number,
	now: number
): Canvas => {
	const canvas: Canvas = {
		id: `temp-${uuid.v4()}`,
		chapterId,
		notebookId,
		order,
		paths: [],
		color: null,
		pattern: "solid",
		undoStack: [],
		redoStack: [],
		createdAt: now,
		updatedAt: now,
		lastAccessedAt: now,
		isDeleted: false,
	}

	return canvas
}

/////////////////////////////////////////
// Getter Functions
/////////////////////////////////////////
export const getNotebook = (
	notebooks: Notebook[],
	notebookId: string | undefined
): Notebook | undefined => {
	return notebooks.find((n) => n.id === notebookId)
}

export const getChapter = (
	notebooks: Notebook[],
	notebookId: string | undefined,
	chapterId: string | undefined
): Chapter | undefined => {
	const notebook = getNotebook(notebooks, notebookId)
	return notebook?.chapters.find((c) => c.id === chapterId)
}

export const getCanvas = (
	notebooks: Notebook[],
	notebookId: string | undefined,
	chapterId: string | undefined,
	canvasId: string | undefined
): Canvas | undefined => {
	const chapter = getChapter(notebooks, notebookId, chapterId)
	return chapter?.canvases.find((c) => c.id === canvasId)
}

export const getChapterById = (notebooks: Notebook[], chapterId: string): Chapter | undefined => {
	return notebooks
		.find((n) => n.chapters.some((ch) => ch.id === chapterId))
		?.chapters.find((ch) => ch.id === chapterId)
}

export const getCanvasById = (notebooks: Notebook[], canvasId: string): Canvas | undefined => {
	return notebooks
		.find((n) => n.chapters.some((ch) => ch.canvases.some((cv) => cv.id === canvasId)))
		?.chapters.find((ch) => ch.canvases.find((cv) => cv.id === canvasId))
		?.canvases.find((cv) => cv.id === canvasId)
}
