import { FlatList, Pressable, View, Text } from "react-native"
import { useNotebook } from "../../contexts/NotebookContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getChapterTabStyles } from "../../styles/chapterTab"
import { getGlobalStyles } from "../../styles/global"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import useNotebooks from "../../hooks/useNotebooks"
import { useModal } from "../../contexts/ModalContext"
import { useEffect } from "react"
import CustomPressable from "../common/CustomPressable"

export default function ChapterList() {
	// Get context values
	const { notebooks, notebook, chapter, setChapter, setActiveCanvasId } = useNotebook()
	const { addChapterToCurrentNotebook } = useNotebooks()
	const { openModal } = useModal()

	// Available chapters in the current notebook.
	const chapters = notebook?.chapters || []

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getChapterTabStyles(theme.colors)

	const selectChapter = (i: number) => {
		if (!notebook) return
		const newChapter = notebook.chapters[i]
		if (newChapter) {
			console.log(`Selected Chapter: \n\tIndex: ${i}\n\tID: ${newChapter.id}`)
			setChapter(newChapter)
		}
	}

	const openChapterMenu = (i: number) => {
		console.log(`Open menu for chapter with ID: ${chapters[i].id}`)
	}

	// Allows the user to create a new chapter with a title.
	const handleNewChapter = () => {
		openModal({
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter title...",
			buttonText: "Create Chapter",
			onSubmit: (input) => addChapterToCurrentNotebook(input),
		})
	}

	// Sets the active canvas to the first canvas in a chapter upon chapter change.
	useEffect(() => {
		if (chapter && chapter.canvases.length > 0) {
			setActiveCanvasId(chapter?.canvases[0].id)
		}
	}, [chapter])

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			data={notebook?.chapters}
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
							style={GlobalStyles.button}
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
			ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
			ListFooterComponent={
				notebooks.length > 0
					? () => (
							<Pressable
								onPress={handleNewChapter}
								style={({ pressed }) => [
									styles.addChapterButton,
									{
										backgroundColor: pressed ? theme.colors.tertiary : theme.colors.secondary,
									},
								]}
							>
								<MaterialC name='plus' size={32} color={theme.colors.onPrimary} />
							</Pressable>
					  )
					: null
			}
		/>
	)
}
