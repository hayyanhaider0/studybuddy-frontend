import client from "../../api/client"
import { ApiResponse } from "../../types/global"
import { Chapter } from "../../types/notebook"

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
	isDeleted: boolean
	chapters: Chapter[]
}

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
	isDeleted: boolean
	canvases: []
}

// Notebooks
export const createNotebookApi = async (req: NotebookRequest): Promise<NotebookResponse> => {
	const res = await client.post<ApiResponse<NotebookResponse>>("/notebooks", req)
	return res.data.data!
}

export const getNotebooksApi = async (): Promise<NotebookResponse[]> => {
	const res = await client.get<ApiResponse<NotebookResponse[]>>("/notebooks")
	return res.data.data!
}

// Chapters
export const createChapterApi = async (req: ChapterRequest): Promise<ChapterResponse> => {
	const res = await client.post<ApiResponse<ChapterResponse>>("/chapters", req)
	return res.data.data!
}

export const getChaptersApi = async (
	notebookIds: string[] | undefined
): Promise<ChapterResponse[]> => {
	if (!notebookIds) throw new Error("getChaptersApi: No notebook ids provided.")
	const res = await client.post<ApiResponse<ChapterResponse[]>>("/chapters/by-notebooks", {
		notebookIds,
	})
	return res.data.data!
}
