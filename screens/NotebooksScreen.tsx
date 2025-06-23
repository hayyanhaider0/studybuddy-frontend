/**
 * NotebooksScreen Component
 *
 * Contains all UI elements used on the Notebooks Screen, including a list of the user's
 * notebooks and a button to add a new notebook. Check out components/notebook for more
 * information.
 */

import { Pressable, Text, View } from "react-native"
import { getGlobalStyles } from "../styles/global"
import { useThemeContext } from "../contexts/ThemeContext"
import useNotebookActions from "../hooks/useNotebookActions"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { ScrollView } from "react-native-gesture-handler"
import NotebookList from "../components/notebook/NotebookList"
import { getNotebookStyles } from "../styles/notebook"

export default function NotebooksScreen() {
	const { handleCreateNotebook } = useNotebookActions() // Get create notebook action.

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getNotebookStyles(theme.colors)

	return (
		<ScrollView style={GlobalStyles.container}>
			<View style={styles.listContainer}>
				{/* List of Notebooks */}
				<NotebookList />
				{/* Add a new notebook button */}
				<Pressable onPress={handleCreateNotebook} style={styles.createNotebookButton}>
					<MaterialC name='plus-circle-outline' size={36} color={theme.colors.textPrimary} />
					<Text style={[GlobalStyles.subtext, { paddingTop: 4 }]}>Add New Notebook</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}
