import { useState } from "react"
import { Notebook } from "../../../types/notebook"
import { ModalType, useModal } from "../../common/contexts/ModalContext"

export default function useGenerate() {
	const [selectedChoices, setSelectedChoices] = useState<string[]>([])
	const { openModal } = useModal()

	const handleGenerateAINotes = (notebook: Notebook) => {
		setSelectedChoices([])

		const handleSelect = (id: string) => {
			setSelectedChoices((prev) =>
				prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
			)
		}

		openModal({
			type: ModalType.MULTIPLE_CHOICE,
			title: `Generate AI Notes for ${notebook.title}`,
			description: `This will create a new file containing AI-generated notes based on the content in your canvases.
Select the chapters you’d like to include before continuing.`,
			selectedIndices: [],
			choices: notebook.chapters.map((ch) => {
				return {
					label: ch.title,
					onPress: () => handleSelect(ch.id),
					getSelected: () => selectedChoices.includes(ch.id),
				}
			}),
			onConfirm: (selectedIndices?: number[]) => {
				const selectedChapters = selectedIndices?.map((i) => notebook.chapters[i].id) || []
				console.log("Selected Chapters:", selectedChapters)
				setSelectedChoices(selectedChapters)

				// Send selected chapter ids and notebook id to the backend
				// The backend then finds all the canvases linked to the selected chapters
				// All those canvases are keyed to their chapters, that are keyed to the notebook title
				// {
				//     notebook: {
				//         title: "Notebook_Title",
				//         chapters: [
				//             {
				//                 title: "Chapter 1",
				//                 canvases: [{canvas}, {canvas}, {canvas}]
				//             },
				//             {
				//                 title: "Chapter 2",
				//                 canvases: [{canvas}, {canvas}, {canvas}]
				//             },
				//         ]
				//     }
				// }
			},
		})
	}

	return { handleGenerateAINotes }
}
