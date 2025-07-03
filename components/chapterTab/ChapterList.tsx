/**
 * ChapterList Component
 *
 * Renders a scrollable chapter list allowing navigation to different chapters
 * within the same notebook.
 */

import { FlatList, Pressable, View, Text } from "react-native"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getChapterTabStyles } from "../../styles/chapterTab"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import useNotebookActions from "../../hooks/useNotebookActions"
import { useEffect } from "react"
import CustomPressable from "../common/CustomPressable"
import { fontSizes } from "../../styles/scales"

export default function ChapterList() {
	// Get context values
	const { notebooks, notebook, chapter, setChapter, setActiveCanvasId } = useNotebookContext()
	const { handleNewChapter } = useNotebookActions()

	// Available chapters in the current notebook.
	const chapters = notebook?.chapters || []

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getChapterTabStyles(theme.colors)

	/**
	 * Allows the user to select a chapter from the chapter tab to navigate to it.
	 *
	 * @param i - Index of the selected chapter.
	 */
	const selectChapter = (i: number) => {
		if (!notebook) return // Exit if notebook doesn't exist.
		const newChapter = notebook.chapters[i]
		setChapter(newChapter)
	}

	const openChapterMenu = (i: number) => {
		console.log(`Open menu for chapter with ID: ${chapters[i].id}`)
	}

	// Sets the active canvas to the first canvas in a chapter upon chapter change.
	useEffect(() => {
		if (chapter && chapter.canvases.length > 0) {
			setActiveCanvasId(chapter?.canvases[0].id)
		}
	}, [chapter])

	return (
		<FlatList
			// Core config.
			data={notebook?.chapters}
			keyExtractor={(item) => item.id}
			horizontal
			showsHorizontalScrollIndicator={false}
			// Item renderer.
			renderItem={({ item, index }) => {
				if (!notebook || !chapter) return null
				const focused = chapter.id === item.id
				const handlePress = () => selectChapter(index)
				const handleLongPress = () => openChapterMenu(index)

				if (focused) {
					return (
						<CustomPressable
							type='primary'
							title={item.title}
							onPress={() => null}
							onLongPress={handleLongPress}
						/>
					)
				}
				return (
					<Pressable
						onPress={handlePress}
						onLongPress={handleLongPress}
						style={({ pressed }) => [
							styles.list,
							{ backgroundColor: pressed ? theme.colors.tertiary : theme.colors.secondary },
						]}
					>
						<Text style={GlobalStyles.buttonText}>{item.title}</Text>
					</Pressable>
				)
			}}
			// Item separator.
			ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
			// List footer -- adds a new chapter to the list and notebook.
			ListFooterComponent={
				notebooks.length > 0
					? () => (
							<CustomPressable
								type='secondary'
								onPress={handleNewChapter}
								circle
								style={{ marginLeft: 8 }}
							>
								<MaterialC name='plus' size={fontSizes.xl} color={theme.colors.onPrimary} />
							</CustomPressable>
					  )
					: null
			}
			contentContainerStyle={{ alignItems: "center" }}
		/>
	)
}
