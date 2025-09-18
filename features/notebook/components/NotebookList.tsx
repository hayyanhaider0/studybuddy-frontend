/**
 * NotebookList Component
 *
 * Contains the UI and logic for presenting the user's list of notebooks.
 */

import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { Pressable, View, Text } from "react-native"
import NotebookIcon from "../../../assets/svgs/NotebookIcon"
import { DrawerParamList } from "../../../navigation/DrawerNavigation"
import { Notebook } from "../../../types/notebook"
import { timeAgo, formatDate } from "../../../utils/date"
import Grid from "../../common/components/Grid"
import MiniCanvas from "../../common/components/MiniCanvas"
import { useSort } from "../../common/contexts/SortContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import useGetNotebooks from "../hooks/useGetNotebooks"
import { useEffect } from "react"

export default function NotebookList() {
	// Get context values.
	const { notebooks, setNotebooks, setSelectedNotebookId } = useNotebookContext()
	const { sorts } = useSort()
	const { data } = useGetNotebooks()

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

	// Sorted array of notebooks without amending the original notebooks array.
	const sortedNotebooks = [...notebooks].sort(getSortMethod())

	useEffect(() => {
		if (data) {
			const mapped = (data as Notebook[]).map((n) => ({
				...n,
				chapters: [],
			}))
			setNotebooks(mapped)
		}
	}, [data])

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
							{n.color ? (
								<NotebookIcon fill={n.color || "green"} width='100%' height='100%' />
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
