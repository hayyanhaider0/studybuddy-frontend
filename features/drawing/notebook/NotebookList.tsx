/**
 * NotebookList Component
 *
 * Contains the UI and logic for presenting the user's list of notebooks.
 */

import { Pressable, Text, View } from "react-native"
import NotebookIcon from "../../../assets/svgs/NotebookIcon"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { timeAgo, formatDate } from "../../../utils/date"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../../../navigation/DrawerNavigation"
import { Notebook } from "../../../types/notebook"
import { useSort } from "../../common/contexts/SortContext"
import Grid from "../../common/components/Grid"
import MiniCanvas from "../../common/components/MiniCanvas"

export default function NotebookList() {
	// Get context values.
	const { notebooks, setSelectedNotebookId } = useNotebookContext()
	const { sorts } = useSort()

	// Theming
	const { GlobalStyles } = useThemeContext()

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
				<Pressable
					key={n.id}
					onPress={() => selectNotebook(n.id)}
					onLongPress={() => console.log("Editing Mode")}
				>
					<View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
						{/* Icon/Canvas container */}
						<View style={{ aspectRatio: 9 / 16, width: "80%" }}>
							{n.fillColor ? (
								<NotebookIcon fill={n.fillColor || "green"} width='100%' height='100%' />
							) : (
								<MiniCanvas id={n.id} />
							)}
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
								{`${timeAgo(n.updatedAt)}`}
							</Text>
							<Text style={[GlobalStyles.subtext, { textAlign: "center" }]}>
								{`Created ${formatDate(n.createdAt)}`}
							</Text>
						</View>
					</View>
				</Pressable>
			))}
			cols={3}
		/>
	)
}
