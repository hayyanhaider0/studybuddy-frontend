/**
 * useGenerate Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * generate something with AI.
 */

import { useNavigation } from "@react-navigation/native"
import { Notebook } from "../../../types/notebook"
import { RootStackParamList } from "../../../navigation/Navigation"
import { NavProp } from "../../../types/global"

export default function useGenerate() {
	const nav = useNavigation<NavProp<keyof RootStackParamList>>()

	const handleGenerateAINotes = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "notes", notebookId: notebook.id })
	}

	const handleGenerateFlashcards = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "flashcards", notebookId: notebook.id })
	}

	const handleGenerateQuiz = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "quiz", notebookId: notebook.id })
	}

	const handleGenerateExam = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "exam", notebookId: notebook.id })
	}

	return {
		handleGenerateAINotes,
		handleGenerateFlashcards,
		handleGenerateQuiz,
		handleGenerateExam,
	}
}
