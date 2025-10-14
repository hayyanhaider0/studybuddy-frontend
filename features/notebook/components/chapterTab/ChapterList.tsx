/**
 * ChapterList Component
 *
 * Renders a scrollable chapter list allowing navigation to different chapters
 * within the same notebook.
 */

import React, { useEffect } from "react"
import { FlatList, Pressable, View, Text } from "react-native"
import { getChapterTabStyles } from "../../../../styles/chapterTab"
import { fontSizes } from "../../../../styles/scales"
import { getNotebook, getChapter } from "../../../../utils/notebook"
import CustomPressable from "../../../common/components/CustomPressable"
import { useThemeContext } from "../../../common/contexts/ThemeContext"
import { useNotebookContext } from "../../contexts/NotebookContext"
import useNotebookActions from "../../hooks/useNotebookActions"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function ChapterList() {
	// Get context values
	const { notebookState, dispatch } = useNotebookContext()
	const { handleCreateChapter } = useNotebookActions()

	// Currently selected notebook
	const notebook = getNotebook(notebookState.notebooks, notebookState.selectedNotebookId)!
	// Currently selected chapter
	const chapter = getChapter(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId
	)!

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getChapterTabStyles(theme.colors)

	const openChapterMenu = (i: number) => {
		console.log(`Open menu for chapter with ID: ${notebook.chapters[i].id}`)
	}

	// Sets the active canvas to the last canvas in a chapter upon chapter change.
	useEffect(() => {
		if (chapter && chapter.canvases.length > 0) {
			dispatch({ type: "SELECT_CANVAS", payload: chapter.canvases[chapter.canvases.length - 1].id })
		}
	}, [chapter])

	return (
		<FlatList
			// Core config.
			data={notebook.chapters}
			keyExtractor={(item) => item.id}
			horizontal
			showsHorizontalScrollIndicator={false}
			// Item renderer.
			renderItem={({ item, index }) => {
				const focused = chapter.id === item.id
				const handlePress = () => {
					dispatch({ type: "SELECT_CHAPTER", payload: notebook.chapters[index].id })
					dispatch({ type: "SELECT_CANVAS", payload: notebook.chapters[index].canvases[0].id })
				}
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
				notebookState.notebooks.length > 0
					? () => (
							<CustomPressable
								type='secondary'
								onPress={handleCreateChapter}
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
