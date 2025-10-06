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
} from "../features/notebook/api"
import { Canvas, Chapter, Notebook } from "../types/notebook"

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
												pid: "",
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
