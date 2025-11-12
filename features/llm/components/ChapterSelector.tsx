import { Pressable, Text, View } from "react-native"
import { getNotebook } from "../../../utils/notebook"
import CustomScrollView from "../../common/components/CustomScrollView"
import MiniCanvas from "../../common/components/MiniCanvas"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useEffect, useState } from "react"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function ChapterSelector() {
	const [selectedIndices, setSelectedIndices] = useState<number[]>([])
	const { notebookState } = useNotebookContext()
	const { theme, GlobalStyles } = useThemeContext()

	const notebook = getNotebook(notebookState.notebooks, notebookState.selectedNotebookId)!
	const chapters = notebook.chapters

	const selectChapter = (index: number) => {
		if (selectedIndices.includes(index)) {
			setSelectedIndices(selectedIndices.filter((idx) => idx !== index))
		} else {
			setSelectedIndices([...selectedIndices, index])
		}
	}

	useEffect(() => {
		setSelectedIndices([...chapters.map((_, i) => i)])
	}, [chapters])

	return (
		<CustomScrollView horizontal>
			{chapters.map((ch, i) => (
				<Pressable key={ch.id} onPress={() => selectChapter(i)} style={{ marginBottom: 16 }}>
					<MiniCanvas notebookId={notebook.id} chapterId={ch.id} canvasId={ch.canvases[0].id} />
					<Text style={GlobalStyles.paragraph}>{ch.title}</Text>
					<MaterialC
						name={selectedIndices.includes(i) ? "check-circle" : "checkbox-blank-circle-outline"}
						size={24}
						color={theme.colors.textPrimary}
						style={{ position: "absolute", top: 24, right: 8 }}
					/>
				</Pressable>
			))}
		</CustomScrollView>
	)
}
