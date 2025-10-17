import { Notebook } from "../../../types/notebook"

export default function useGenerate() {
	const handleGenerateAINotes = (notebook: Notebook) => {
		console.log("Generating AI notes for", notebook.title)
	}

	return { handleGenerateAINotes }
}
