import { StrokeCap, StrokeJoin } from "@shopify/react-native-skia"
import client from "../../../api/client"
import { ApiResponse, Color } from "../../../types/global"
import { Canvas, Chapter, Notebook } from "../../../types/notebook"
import { BrushType, PathPoint, PathType } from "../../drawing/types/DrawingTypes"

// Notebooks
export interface NotebookRequest {
	title: string
	color?: Color
}

export interface NotebookResponse {
	id: string
	title: string
	color: string
	createdAt: string
	updatedAt: string
	lastAccessedAt: string
	chapters?: ChapterResponse[]
	isDeleted: boolean
}

// Chapters
export interface ChapterRequest {
	title: string
	order: number
	notebookId: string
}

export interface ChapterResponse {
	id: string
	notebookId: string
	title: string
	order: number
	createdAt: string
	updatedAt: string
	canvases?: CanvasResponse[]
	isDeleted: boolean
}

// Canvases
export interface CanvasRequest {
	chapterId: string
	order: number
}

export interface CanvasResponse {
	id: string
	chapterId: string
	order: number
	createdAt: string
	updatedAt: string
	lastAccessedAt: string
	isDeleted: boolean
}

// Paths
export interface PathRequest {
	tempId: string
	canvasId: string
	points: PathPoint[]
	brushType: string
	baseWidth: number
	color: string
	opacity: number
}

export interface PathResponse {
	id: string
	canvasId: string
	points: PathPoint[]
	brushType: string
	baseWidth: number
	color: string
	opacity: number
}

export interface PathCreateResponse {
	id: string
	tempId: string
}

// Notebooks
export const createNotebook = async (req: NotebookRequest): Promise<NotebookResponse> => {
	const res = await client.post<ApiResponse<NotebookResponse>>("/notebooks", req)
	console.log("Creating notebook:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

export const fetchNotebooks = async (): Promise<NotebookResponse[]> => {
	const res = await client.get<ApiResponse<NotebookResponse[]>>("/notebooks")
	console.log("Notebooks:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

export const deleteNotebook = async (id: string): Promise<void> => {
	if (!id || id.startsWith("temp")) return
	const res = await client.delete<ApiResponse<void>>(`/notebooks/${id}`)
	return res.data.data!
}

export const mapToNotebook = (res: NotebookResponse): Notebook => {
	const notebook = {
		...res,
		createdAt: new Date(res.createdAt).getTime(),
		updatedAt: new Date(res.updatedAt).getTime(),
		lastAccessedAt: new Date(res.lastAccessedAt).getTime(),
		chapters: res.chapters?.map(mapToChapter) || [],
	}

	return notebook
}

// Chapters
export const createChapter = async (req: ChapterRequest): Promise<ChapterResponse> => {
	if (req.title.trim() === "") {
		req.title = `Chapter ${req.order + 1}`
	}
	const res = await client.post<ApiResponse<ChapterResponse>>("/chapters", req)
	return res.data.data!
}

export const fetchChapters = async (notebookIds: string[]): Promise<ChapterResponse[]> => {
	if (!notebookIds) throw new Error("[fetchChapters]: No notebook ids provided.")
	const res = await client.post<ApiResponse<ChapterResponse[]>>("/chapters/by-notebooks", {
		notebookIds,
	})
	console.log("Chapters:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

export const deleteChapter = async (id: string): Promise<void> => {
	console.log("Deleing chapter with id:", id)
	if (!id || id.startsWith("temp")) return
	const res = await client.delete<ApiResponse<void>>(`/chapters/${id}`)
	console.log("Deleted chapter:", res.data.data)
	return res.data.data!
}

export const mapToChapter = (res: ChapterResponse): Chapter => {
	const chapter = {
		...res,
		createdAt: new Date(res.createdAt).getTime(),
		updatedAt: new Date(res.updatedAt).getTime(),
		canvases: res.canvases?.map(mapToCanvas) || [],
	}

	return chapter
}

// Canvases
export const createCanvas = async (req: CanvasRequest): Promise<CanvasResponse> => {
	const res = await client.post<ApiResponse<CanvasResponse>>("/canvases", req)
	return res.data.data!
}

export const fetchCanvases = async (chapterIds: string[]): Promise<CanvasResponse[]> => {
	if (!chapterIds) throw new Error("[fetchCanvases]: No chapter ids provided.")
	const res = await client.post<ApiResponse<CanvasResponse[]>>("/canvases/by-chapters", {
		chapterIds,
	})
	console.log("Canvas:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

export const deleteCanvas = async (id: string): Promise<void> => {
	if (!id || id.startsWith("temp")) return
	const res = await client.delete<ApiResponse<void>>(`/canvases/${id}`)
	return res.data.data!
}

export const mapToCanvas = (res: CanvasResponse): Canvas => {
	const canvas = {
		...res,
		createdAt: new Date(res.createdAt).getTime(),
		updatedAt: new Date(res.updatedAt).getTime(),
		lastAccessedAt: new Date(res.lastAccessedAt).getTime(),
		paths: [],
		undoStack: [],
		redoStack: [],
	}

	return canvas
}

// Paths
export const createPaths = async (req: PathRequest[]): Promise<PathCreateResponse[]> => {
	if (!req) throw new Error("notebooks/api.ts/[CREATE_PATHS]: Request must be provided.")
	const res = await client.post<ApiResponse<PathCreateResponse[]>>("/paths", req)
	return res.data.data!
}

export const fetchPaths = async (canvasIds: string[]): Promise<PathResponse[]> => {
	if (!canvasIds) throw new Error("notebooks/api.ts/[FETCH_PATHS]: canvasIds must be provided.")
	const res = await client.post<ApiResponse<PathResponse[]>>("/paths/by-canvases", canvasIds)
	return res.data.data!
}

export const deletePaths = async (pathIds: string[]): Promise<void> => {
	if (!pathIds || pathIds.length === 0)
		throw new Error("notebooks/api.ts/[DELETE_PATHS]: pathIds must be provided.")
	const pathIdsWithoutTemp = pathIds.filter((id) => !id.startsWith("temp"))
	if (pathIdsWithoutTemp.length === 0) return
	const res = await client.delete<ApiResponse<void>>("/paths", { data: pathIdsWithoutTemp })
	return res.data.data!
}

export const mapToPathRequest = (path: PathType): PathRequest => {
	const req: PathRequest = {
		tempId: path.id,
		canvasId: path.canvasId,
		points: path.points,
		brushType: path.brush.type.toUpperCase(),
		baseWidth: path.brush.baseWidth,
		color: path.brush.color,
		opacity: path.brush.opacity,
	}

	return req
}

export const mapToPathType = (res: PathResponse): PathType => {
	const path: PathType = {
		id: res.id,
		canvasId: res.canvasId,
		points: res.points,
		brush: {
			type: res.brushType as BrushType,
			color: res.color,
			baseWidth: res.baseWidth,
			minWidth: res.baseWidth * 0.5,
			maxWidth: res.baseWidth * 1.5,
			opacity: res.opacity,
			strokeCap: StrokeCap.Round,
			strokeJoin: StrokeJoin.Round,
		},
		bbox: {
			minX: Math.min(...res.points.map((pts) => pts.x)),
			maxX: Math.max(...res.points.map((pts) => pts.x)),
			minY: Math.min(...res.points.map((pts) => pts.y)),
			maxY: Math.max(...res.points.map((pts) => pts.y)),
		},
	}

	return path
}

// Syncing
export const sync = async (req: any): Promise<void> => {
	if (!req) throw new Error("notebooks/api.ts/[SYNC]: Request must be provided.")
	const res = await client.post<ApiResponse<void>>("/sync", req)
	return res.data.data!
}
