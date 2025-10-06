import client from "../../api/client"
import { ApiResponse } from "../../types/global"
import { PathPoint } from "../drawing/types/DrawingTypes"

// Notebooks
export interface NotebookRequest {
	title: string
	color?: string
}

export interface NotebookResponse {
	id: string
	title: string
	color: string
	createdAt: string
	updatedAt: string
	lastAccessedAt: string
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
}

// Paths
export interface PathRequest {
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

// Notebooks
export const createNotebookApi = async (req: NotebookRequest): Promise<NotebookResponse> => {
	const res = await client.post<ApiResponse<NotebookResponse>>("/notebooks", req)
	return res.data.data!
}

export const getNotebooksApi = async (): Promise<NotebookResponse[]> => {
	const res = await client.get<ApiResponse<NotebookResponse[]>>("/notebooks")

	console.log("Notebooks:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

// Chapters
export const createChapterApi = async (req: ChapterRequest): Promise<ChapterResponse> => {
	const res = await client.post<ApiResponse<ChapterResponse>>("/chapters", req)
	return res.data.data!
}

export const getChaptersApi = async (notebookIds: string[]): Promise<ChapterResponse[]> => {
	if (!notebookIds) throw new Error("getChaptersApi: No notebook ids provided.")
	const res = await client.post<ApiResponse<ChapterResponse[]>>("/chapters/by-notebooks", {
		notebookIds,
	})
	console.log("Chapters:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

// Canvases
export const createCanvasApi = async (req: CanvasRequest): Promise<CanvasResponse> => {
	const res = await client.post<ApiResponse<CanvasResponse>>("/canvases", req)
	return res.data.data!
}

export const getCanvasesApi = async (chapterIds: string[]): Promise<CanvasResponse[]> => {
	const res = await client.post<ApiResponse<CanvasResponse[]>>("/canvases/by-chapters", {
		chapterIds,
	})
	console.log("Canvas:", JSON.stringify(res.data, null, 2))
	return res.data.data!
}

// Paths
export const createPathApi = async (req: PathRequest) => {
	const res = await client.post<ApiResponse<void>>("/paths", req)
	return res.data.data!
}

export const getPathsApi = async (canvasIds: string[]) => {
	const res = await client.post<ApiResponse<PathResponse[]>>("/paths/by-canvases", canvasIds)
	return res.data.data!
}
