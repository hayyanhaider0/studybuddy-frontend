import client from "../../api/client"
import { ApiResponse } from "../../types/global"
import { Chapter } from "../../types/notebook"
import { getToken } from "../../utils/secureStore"

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
	isDeleted: boolean
	chapters: Chapter[]
}

export const createNotebookApi = async (req: NotebookRequest): Promise<NotebookResponse> => {
	const token = await getToken()

	if (!token) {
		throw new Error("No authentication token found.")
	}

	const res = await client.post<ApiResponse<NotebookResponse>>("/notebooks", req, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const response = res.data

	if (!response?.success || !response?.data) {
		throw new Error(response.message || "Failed to create notebook.")
	}

	return response.data
}

export const getNotebooksApi = async (): Promise<NotebookResponse[]> => {
	const token = await getToken()

	if (!token) {
		throw new Error("No authentication token found.")
	}

	const res = await client.get<ApiResponse<NotebookResponse[]>>("/notebooks", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	const response = res.data

	if (!response?.success || !response?.data) {
		throw new Error(response.message || "Failed to fetch notebooks.")
	}

	return response.data
}
