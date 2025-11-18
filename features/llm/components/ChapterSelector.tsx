/**
 * ChapterSelector Component
 */

import { Pressable, Text } from "react-native"
import { getNotebook } from "../../../utils/notebook"
import CustomScrollView from "../../common/components/CustomScrollView"
import MiniCanvas from "../../common/components/MiniCanvas"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useLLMContext } from "../contexts/LLMContext"

export default function ChapterSelector() {
	// Get values from contexts.
	const { notebookState } = useNotebookContext()
	const { selectedChapters, setSelectedChapters } = useLLMContext()

	// Theming.
	const { theme, GlobalStyles } = useThemeContext()

	// Notebook to select chapters from.
	const notebook = getNotebook(notebookState.notebooks, notebookState.selectedNotebookId)!
	// All available chapters in the notebook.
	const chapters = notebook.chapters

	/**
	 * Selects/Unselects a chapter for the user.
	 * @param chapterId - Selected/unselected chapter's ID.
	 */
	const selectChapter = (chapterId: string) => {
		if (selectedChapters.includes(chapterId)) {
			// If the chapter was already selected, unselect it.
			setSelectedChapters(selectedChapters.filter((id) => id !== chapterId))
		} else {
			// Else, add chapter to the selection.
			setSelectedChapters([...selectedChapters, chapterId])
		}
	}

	return (
		<CustomScrollView horizontal>
			{chapters.map((ch) => {
				// Boolean flag to check whether the chapter is selected.
				const isSelected = selectedChapters.includes(ch.id)
				return (
					<Pressable key={ch.id} onPress={() => selectChapter(ch.id)} style={{ marginBottom: 16 }}>
						{/* MiniCanvas for a preview of the chapters first canvas. */}
						<MiniCanvas notebookId={notebook.id} chapterId={ch.id} canvasId={ch.canvases[0].id} />

						{/* Chapter title. */}
						<Text style={GlobalStyles.paragraph}>{ch.title}</Text>

						{/* Circle that includes a tick to show whether the chapter is selected. */}
						<MaterialC
							name={isSelected ? "check-circle" : "checkbox-blank-circle-outline"}
							size={24}
							color={theme.colors.textPrimary}
							style={{ position: "absolute", top: 24, right: 8 }}
						/>
					</Pressable>
				)
			})}
		</CustomScrollView>
	)
}
