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
import { getGlobalStyles } from "../../styles/global"
import { useNavigation } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../../navigation/DrawerNavigation"
import { Notebook } from "../../types/notebook"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useSort } from "../../contexts/SortContext"
import { useEffect } from "react"

export default function NotebookList() {
	// Get context values.
	const { notebooks, setNotebook } = useNotebookContext()
	const { sorts } = useSort()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	// Navigation
	const nav = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	/**
	 * Select and open the notebook to it's first chapter and its first canvas.
	 * @param notebook - Notebook to navigate to.
	 */
	const selectNotebook = (notebook: Notebook) => {
		setNotebook(notebook)
		nav.navigate("canvas")
	}

	const getSortMethod = () => {
		const sort = sorts.notebooks
		let result = (a: Notebook, b: Notebook) => a.title.localeCompare(b.title)

		switch (sort) {
			case "name-asc":
				result = (a: Notebook, b: Notebook) => a.title.localeCompare(b.title)
				return result
			case "name-desc":
				result = (a: Notebook, b: Notebook) => b.title.localeCompare(a.title)
				return result
			case "updated-newest":
				result = (a: Notebook, b: Notebook) => a.updatedAt - b.updatedAt
				return result
			case "updated-oldest":
				result = (a: Notebook, b: Notebook) => b.updatedAt - a.updatedAt
				return result
			case "created-newest":
				result = (a: Notebook, b: Notebook) => a.createdAt - b.createdAt
				return result
			case "created-oldest":
				result = (a: Notebook, b: Notebook) => b.createdAt - a.createdAt
				return result
			default:
				return (a: Notebook, b: Notebook) => 0
		}
	}

	const sortedNotebooks = [...notebooks].sort(getSortMethod())
	return (
		<>
			{sortedNotebooks.map((n) => (
				// Clickable icon that navigates to the canvas after selecting the notebook.
				<Pressable
					key={n.id}
					onPress={() => selectNotebook(n)}
					style={{ width: "28%", justifyContent: "center", alignItems: "center" }}
				>
					<View style={{ flexDirection: "row" }}>
						{/* Notebook icon with editable color */}
						<NotebookIcon fill={n.fill} width={80} height={96} />
						{/* Clickable menu icon */}
						<Pressable style={{ position: "absolute", top: 4, right: -16 }}>
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
		</>
	)
}
