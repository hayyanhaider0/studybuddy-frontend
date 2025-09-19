import client from "../../api/client"
import { ApiResponse } from "../../types/global"
import { Chapter } from "../../types/notebook"
import { getToken } from "../../utils/secureStore"

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
}

export interface ChapterResponse {
	id: string
	notebookId: string
	title: string
	createdAt: string
	updatedAt: string
	isDeleted: boolean
	canvases: []
}

// Notebooks
export const createNotebookApi = async (req: NotebookRequest): Promise<NotebookResponse> => {
	const token = await getToken()

	if (!token) {
		throw new Error("No authentication token found.")
	}

	try {
		const res = await client.post<ApiResponse<NotebookResponse>>("/notebooks", req, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		const response: ApiResponse<NotebookResponse> = res.data
		return response.data!
	} catch (e: any) {
		throw new Error(e.data.message || "Failed to create notebook.")
	}
}

export const getNotebooksApi = async (): Promise<NotebookResponse[]> => {
	const token = await getToken()

	if (!token) {
		throw new Error("No authentication token found.")
	}

	try {
		const res = await client.get<ApiResponse<NotebookResponse[]>>("/notebooks", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		const response: ApiResponse<NotebookResponse[]> = res.data
		return response.data!
	} catch (e: any) {
		throw new Error(e.data.message || "Failed to fetch notebooks.")
	}
}

// Chapters
export const createChapterApi = async (): Promise<ChapterResponse> => {
	const token = checkToken()

	try {
		const res = await client.post<ApiResponse<ChapterResponse>>("/chapters", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		const response: ApiResponse<ChapterResponse> = res.data
		return response.data!
	} catch (e: any) {
		throw new Error(e.data.message || "Failed to create chapter.")
	}
}

export const getChaptersApi = async (): Promise<ChapterResponse[]> => {
	const token = checkToken()

	try {
		const res = await client.get<ApiResponse<ChapterResponse[]>>("/chapters", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		const response: ApiResponse<ChapterResponse[]> = res.data
		return response.data!
	} catch (e: any) {
		throw new Error(e.data.message || "Failed to fetch chapters.")
	}
}

const checkToken = () => {
	const token = getToken()
	if (!token) {
		throw new Error("No authentication token found.")
	}
	return token
}
