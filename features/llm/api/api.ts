import client from "../../../api/client"
import { ApiResponse } from "../../../types/global"
import { Chapter } from "../../../types/notebook"
import { EducationLevel, Occupation } from "../../auth/contexts/AuthContext"

export interface NotesRequest {
	taskType: "notes" | "flashcards" | "quiz" | "exam"
	occupation: Occupation | null
	educationLevel: EducationLevel | null
	notebookName: string
	chaptersWithCanvases: { chapterName: string; canvases: string[] }[]
	options: Record<string, string | boolean>
}

export interface NotesResponse {
	notebookName: string
	chapters: Chapter[]
}

export const generate = async (req: NotesRequest): Promise<NotesResponse> => {
	const res = await client.post<ApiResponse<NotesResponse>>("/ai/generate", req)
	return res.data.data!
}
