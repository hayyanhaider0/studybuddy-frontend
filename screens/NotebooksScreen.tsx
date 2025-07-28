/**
 * NotebooksScreen Component
 *
 * Contains all UI elements used on the Notebooks Screen, including a list of the user's
 * notebooks and a button to add a new notebook. Check out components/notebook for more
 * information.
 */

import { View } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import useNotebookActions from "../hooks/useNotebookActions"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import NotebookList from "../components/notebook/NotebookList"
import { getNotebookStyles } from "../styles/notebook"
import CustomPressable from "../components/common/CustomPressable"
import CustomScrollView from "../components/common/CustomScrollView"

export default function NotebooksScreen() {
	const { handleCreateNotebook } = useNotebookActions() // Get create notebook action.

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getNotebookStyles(theme.colors)

	return (
		<View style={GlobalStyles.container}>
			<CustomScrollView>
				<View style={styles.listContainer}>
					{/* List of Notebooks */}
					<NotebookList />
					{/* Add a new notebook button */}
				</View>
			</CustomScrollView>
			<CustomPressable
				type='primary'
				onPress={handleCreateNotebook}
				floatPos={{ bottom: 64, right: 32 }}
				circle
			>
				<MaterialC name='plus' size={48} color={theme.colors.onPrimary} />
			</CustomPressable>
		</View>
	)
}
