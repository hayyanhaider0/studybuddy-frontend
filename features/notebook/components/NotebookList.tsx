/**
 * NotebookList Component
 *
 * Contains the UI and logic for presenting the user's list of notebooks.
 */

import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { Pressable, View, Text, GestureResponderEvent } from "react-native"
import NotebookIcon from "../../../assets/svgs/NotebookIcon"
import { DrawerParamList } from "../../../navigation/DrawerNavigation"
import { Notebook } from "../../../types/notebook"
import { timeAgo, formatDate } from "../../../utils/date"
import Grid from "../../common/components/Grid"
import MiniCanvas from "../../common/components/MiniCanvas"
import { useSort } from "../../common/contexts/SortContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { getChapter, getNotebook } from "../../../utils/notebook"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useContextMenu } from "../../common/contexts/ContextMenuContext"
import useNotebookActions from "../hooks/useNotebookActions"
import useGenerate from "../../llm/hooks/useGenerate"

export default function NotebookList() {
	// Get context values.
	const { notebookState, dispatch } = useNotebookContext()
	// Theming
	const { GlobalStyles, theme } = useThemeContext()
	const { sorts } = useSort()
	const { openMenu } = useContextMenu()
	const { handleEditNotebook, handleDeleteNotebook } = useNotebookActions()
	const { handleGenerateAINotes } = useGenerate()

	// Navigation
	const nav = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	if (notebookState.notebooks.length === 0) {
		return (
			<Text style={[GlobalStyles.paragraph, { textAlign: "left", paddingHorizontal: 16 }]}>
				No notebooks found. Add a notebook to get started!
			</Text>
		)
	}

	/**
	 * Select and open the notebook to it's first chapter and its first canvas.
	 * @param notebook - Notebook to navigate to.
	 */
	const selectNotebook = (notebookId: string) => {
		dispatch({ type: "SELECT_NOTEBOOK", payload: notebookId })
		const notebook = getNotebook(notebookState.notebooks, notebookId)
		dispatch({ type: "SELECT_CHAPTER", payload: notebook?.chapters[0].id! })
		const chapter = getChapter(notebookState.notebooks, notebookId, notebookState.selectedChapterId)
		dispatch({ type: "SELECT_CANVAS", payload: chapter?.canvases[0].id! })
		nav.navigate("canvas")
	}

	/**
	 * Gets the selected sorted method for notebooks from the sort util.
	 *
	 * @returns Selected sorting method for notebooks.
	 */
	const getSortMethod = () => {
		const { type, ascending } = sorts.notebooks

		switch (type) {
			case "name":
				return (a: Notebook, b: Notebook) =>
					ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
			case "updated":
				return (a: Notebook, b: Notebook) =>
					ascending
						? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
						: new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			case "created":
				return (a: Notebook, b: Notebook) =>
					ascending
						? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			default:
				return (_a: Notebook, _b: Notebook) => 0
		}
	}

	const handleNotebookMenu = (notebook: Notebook, event: GestureResponderEvent) => {
		event.target.measure((_x, _y, _w, _h, pageX: number, pageY: number) => {
			openMenu({
				position: { x: pageX, y: pageY },
				options: [
					{
						label: "Edit",
						onPress: () => handleEditNotebook(notebook),
					},
					{
						label: "Delete",
						onPress: () => handleDeleteNotebook(notebook),
					},
					{
						label: "Generate AI Notes",
						onPress: () => handleGenerateAINotes(notebook),
					},
					{
						label: "Generate Flashcards",
						onPress: () => console.log("Generate Flashcards"),
					},
					{
						label: "Generate Quiz",
						onPress: () => console.log("Generate Quiz"),
					},
					{
						label: "Generate Exam",
						onPress: () => console.log("Generate Exam"),
					},
				],
			})
		})
	}

	// Sorted array of notebooks without amending the original notebooks array.
	const sortedNotebooks = [...notebookState.notebooks].sort(getSortMethod())

	return (
		<Grid
			data={sortedNotebooks.map((n) => (
				// Clickable icon that navigates to the canvas after selecting the notebook.
				<Pressable
					key={n.id}
					onPress={() => selectNotebook(n.id)}
					onLongPress={() => console.log("Editing Mode")}
				>
					<View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
						{/* Icon/Canvas container */}
						<View style={{ aspectRatio: 9 / 16, width: "80%", flexDirection: "row" }}>
							{n.color ? (
								<NotebookIcon fill={n.color || "green"} width='100%' height='100%' />
							) : (
								<MiniCanvas id={n.id} />
							)}
							<Pressable
								onPress={(e) => handleNotebookMenu(n, e)}
								style={{
									position: "absolute",
									top: 12,
									right: -24,
								}}
							>
								<MaterialC name='dots-vertical' size={24} color={theme.colors.textPrimary} />
							</Pressable>
						</View>

						<View style={{ paddingTop: 8 }}>
							<Text
								style={[GlobalStyles.paragraph, { paddingVertical: 4, textAlign: "center" }]}
								ellipsizeMode='middle'
								numberOfLines={1}
							>
								{n.title}
							</Text>
							<Text style={[GlobalStyles.subtext, { textAlign: "center" }]}>
								{`${timeAgo(new Date(n.updatedAt).getTime())}`}
							</Text>
							<Text style={[GlobalStyles.subtext, { textAlign: "center" }]}>
								{`Created ${formatDate(new Date(n.createdAt).getTime())}`}
							</Text>
						</View>
					</View>
				</Pressable>
			))}
			cols={3}
		/>
	)
}
