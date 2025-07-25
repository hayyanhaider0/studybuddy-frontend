/**
 * NotebookList Component
 *
 * Contains the UI and logic for presenting the user's list of notebooks.
 */

import { Pressable, Text, View } from "react-native"
import NotebookIcon from "../../assets/svgs/NotebookIcon"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { timeAgo, formatDate } from "../../utils/date"
import { useThemeContext } from "../../contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../../navigation/DrawerNavigation"
import { Notebook } from "../../types/notebook"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useSort } from "../../contexts/SortContext"
import { useContextMenu } from "../../contexts/ContextMenuContext"
import useNotebookActions from "../../hooks/useNotebookActions"
import Grid from "../common/Grid"

export default function NotebookList() {
	// Get context values.
	const { notebooks, setSelectedNotebookId } = useNotebookContext()
	const { handleEditNotebook, handleDeleteNotebook } = useNotebookActions()
	const { sorts } = useSort()
	const { openMenu } = useContextMenu()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	// Navigation
	const nav = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	/**
	 * Select and open the notebook to it's first chapter and its first canvas.
	 * @param notebook - Notebook to navigate to.
	 */
	const selectNotebook = (notebookId: string) => {
		setSelectedNotebookId(notebookId)
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
					ascending ? a.updatedAt - b.updatedAt : b.updatedAt - a.updatedAt
			case "created":
				return (a: Notebook, b: Notebook) =>
					ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
			default:
				return (_a: Notebook, _b: Notebook) => 0
		}
	}

	// Sorted array of notebooks without amending the original notebooks array.
	const sortedNotebooks = [...notebooks].sort(getSortMethod())

	return (
		<Grid
			data={sortedNotebooks.map((n) => (
				// Clickable icon that navigates to the canvas after selecting the notebook.
				<Pressable key={n.id} onPress={() => selectNotebook(n.id)}>
					<View style={{ flexDirection: "row" }}>
						{/* Notebook icon with editable color */}
						<NotebookIcon fill={n.fill} width={80} height={96} />
						{/* Clickable menu icon */}
						<Pressable
							onPress={(e) => {
								e.currentTarget.measureInWindow((x, y) => {
									openMenu({
										options: [
											{ label: "Edit", onPress: () => handleEditNotebook(n) },
											{ label: "Delete", onPress: () => handleDeleteNotebook(n) },
										],
										position: { x, y },
									})
								})
							}}
							style={{ position: "absolute", top: 4, right: 0 }}
						>
							<MaterialC name='dots-vertical' size={24} color={theme.colors.textPrimary} />
						</Pressable>
					</View>
					{/* Title and time data of the notebook */}
					<Text
						style={[GlobalStyles.paragraph, { paddingVertical: 4 }]}
						ellipsizeMode='middle'
						numberOfLines={1}
					>
						{n.title}
					</Text>
					<Text style={GlobalStyles.subtext}>{`Updated ${timeAgo(n.updatedAt)}`}</Text>
					<Text style={GlobalStyles.subtext}>{`Created ${formatDate(n.createdAt)}`}</Text>
				</Pressable>
			))}
			cols={3}
		/>
	)
}
