import { FlatList, Pressable, View, Text } from "react-native"
import { useNotebook } from "../../contexts/NotebookContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getChapterTabStyles } from "../../styles/chapterTab"
import { getGlobalStyles } from "../../styles/global"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import useNotebooks from "../../hooks/useNotebooks"
import { useModal } from "../../contexts/ModalContext"

export default function ChapterList() {
	const { notebooks, notebook, setChapter } = useNotebook()
	const { addChapterToCurrentNotebook } = useNotebooks()
	const { setShowModal, setTitle, setDescription, setPlaceholder, setButtonText, setOnPress } =
		useModal()
	const chapters = notebook?.chapters || []

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

	const handleNewChapter = () => {
		setTitle("Add a New Chapter")
		setDescription("Give your new chapter a name!")
		setPlaceholder("Type the name of your new chapter...")
		setButtonText("Add Chapter")
		setOnPress(() => (input: string) => addChapterToCurrentNotebook(input))
		setShowModal(true)
		console.log(notebook)
		console.log(notebook?.chapters)
	}

	return (
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			data={notebook?.chapters}
			renderItem={({ item, index }) => (
				<Pressable
					onPress={() => selectChapter(index)}
					onLongPress={() => openChapterMenu(index)}
					style={({ pressed }) => [
						styles.list,
						{ backgroundColor: pressed ? theme.colors.tertiary : theme.colors.secondary },
					]}
				>
					<Text style={GlobalStyles.buttonText}>{item.title}</Text>
				</Pressable>
			)}
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
								<MaterialC name='plus' size={24} color={theme.colors.onPrimary} />
							</Pressable>
					  )
					: null
			}
		/>
	)
}
