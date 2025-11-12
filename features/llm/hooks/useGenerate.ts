import { useNavigation } from "@react-navigation/native"
import { Notebook } from "../../../types/notebook"
import { RootStackParamList } from "../../../navigation/Navigation"
import { NavProp } from "../../../types/global"

export default function useGenerate() {
	const nav = useNavigation<NavProp<keyof RootStackParamList>>()

	const handleGenerateAINotes = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "notes", notebookName: notebook.title })
	}

	const handleGenerateFlashcards = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "flashcards", notebookName: notebook.title })
	}

	const handleGenerateQuiz = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "quiz", notebookName: notebook.title })
	}

	const handleGenerateExam = (notebook: Notebook) => {
		nav.navigate("generate" as any, { taskType: "exam", notebookName: notebook.title })
	}

	return {
		handleGenerateAINotes,
		handleGenerateFlashcards,
		handleGenerateQuiz,
		handleGenerateExam,
	}
}
