/**
 * Notebook Util
 *
 * Contains helper functions for notebook related content -- including making new notebooks,
 * chapters, and canvases.
 */

import { StrokeCap, StrokeJoin } from "@shopify/react-native-skia"
import { BrushType, PathType } from "../features/drawing/types/DrawingTypes"
import {
	CanvasResponse,
	ChapterResponse,
	NotebookResponse,
	PathResponse,
} from "../features/notebook/api/api"
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
	notebooksResp: NotebookResponse[],
	chaptersResp: ChapterResponse[],
	canvasesResp: CanvasResponse[],
	pathsResp: PathResponse[]
): Notebook[] => {
	return notebooksResp.map(
		(nb): Notebook => ({
			id: nb.id,
			title: nb.title,
			color: nb.color ?? null,
			createdAt: new Date(nb.createdAt).getTime(),
			updatedAt: new Date(nb.updatedAt).getTime(),
			lastAccessedAt: 0,
			chapters: chaptersResp
				.filter((ch) => ch.notebookId === nb.id)
				.map(
					(ch): Chapter => ({
						id: ch.id,
						notebookId: ch.notebookId,
						title: ch.title,
						order: ch.order,
						createdAt: new Date(ch.createdAt).getTime(),
						updatedAt: new Date(ch.updatedAt).getTime(),
						canvases: canvasesResp
							.filter((cv) => cv.chapterId === ch.id)
							.map(
								(cv): Canvas => ({
									id: cv.id,
									chapterId: cv.chapterId,
									order: cv.order,
									createdAt: new Date(cv.createdAt).getTime(),
									updatedAt: new Date(cv.updatedAt).getTime(),
									lastAccessedAt: 0,
									undoStack: [],
									redoStack: [],
									paths: pathsResp
										.filter((p) => p.canvasId === cv.id)
										.map(
											(p): PathType => ({
												id: p.id,
												canvasId: cv.id,
												points: p.points,
												brush: {
													type: p.brushType.toLowerCase() as BrushType,
													color: p.color,
													baseWidth: p.baseWidth,
													opacity: p.opacity,
													strokeCap: StrokeCap.Round,
													strokeJoin: StrokeJoin.Round,
													minWidth: p.baseWidth * 0.5,
													maxWidth: p.baseWidth * 1.5,
												},
												bbox: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
											})
										),
								})
							),
					})
				),
		})
	)
}

/////////////////////////////////////////
// Mutator Functions
/////////////////////////////////////////
export const addNotebook = (title: string, color: Color, now: number, length: number): Notebook => {
	const id = `temp-${uuid.v4()}`
	const notebook: Notebook = {
		id,
		title: title || `Notebook ${length}`,
		chapters: [addChapter(id, `Chapter 1`, 0, now)],
		createdAt: now,
		updatedAt: now,
		lastAccessedAt: now,
		color,
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
		canvases: [addCanvas(id, 0, now)],
		order,
		createdAt: now,
		updatedAt: now,
	}

	return chapter
}

export const addCanvas = (chapterId: string, order: number, now: number): Canvas => {
	const canvas: Canvas = {
		id: `temp-${uuid.v4()}`,
		chapterId,
		order,
		paths: [],
		undoStack: [],
		redoStack: [],
		createdAt: now,
		updatedAt: now,
		lastAccessedAt: now,
	}

	return canvas
}

/////////////////////////////////////////
// Getter Functions
/////////////////////////////////////////
export const getNotebook = (notebooks: Notebook[], notebookId: string): Notebook => {
	const notebook = notebooks.find((n) => n.id === notebookId)

	if (!notebook) throw new Error("[GET_NOTEBOOK: UTILS/NOTEBOOK.TS]: Notebook not found!")

	return notebook
}

export const getChapter = (
	notebooks: Notebook[],
	notebookId: string,
	chapterId: string
): Chapter => {
	const notebook = getNotebook(notebooks, notebookId)
	const chapter = notebook?.chapters.find((c) => c.id === chapterId)
	if (!chapter) throw new Error("[GET_CHAPTER: UTILS/NOTEBOOK.TS]: Chapter not found!")
	return chapter
}

export const getCanvas = (
	notebooks: Notebook[],
	notebookId: string,
	chapterId: string,
	canvasId: string
): Canvas => {
	const chapter = getChapter(notebooks, notebookId, chapterId)
	const canvas = chapter?.canvases.find((c) => c.id === canvasId)
	if (!canvas) throw new Error("[GET_CANVAS: UTILS/NOTEBOOK.TS]: Canvas not found!")
	return canvas
}
