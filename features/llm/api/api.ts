import client from "../../../api/client"
import { ApiResponse } from "../../../types/global"
import { Chapter } from "../../../types/notebook"
import { EducationLevel, Occupation } from "../../auth/contexts/AuthContext"

export interface GenerateRequest {
	taskType: "notes" | "flashcards" | "quiz" | "exam"
	occupation: Occupation | null
	educationLevel: EducationLevel | null
	notebookName: string
	chaptersWithCanvases: { chapterName: string; canvases: string[] }[]
	options: Record<string, string | boolean>
}

export interface GenerateResponse {
	notebookName: string
	chapters: Chapter[]
}

export const generate = async (req: GenerateRequest): Promise<GenerateResponse> => {
	const res = await client.post<ApiResponse<GenerateResponse>>("/ai/generate", req)
	return res.data.data!
}
