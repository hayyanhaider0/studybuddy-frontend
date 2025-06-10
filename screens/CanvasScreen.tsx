/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 */

import { useThemeContext } from "../contexts/ThemeContext"
import { Text, Pressable, View } from "react-native"
import Toolbar from "../components/canvas/toolbar/Toolbar"
import { getGlobalStyles } from "../styles/global"
import ChapterTab from "../components/chapterTab/ChapterTab"
import { useNotebook } from "../contexts/NotebookContext"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import { useModal } from "../contexts/ModalContext"
import useNotebooks from "../hooks/useNotebooks"
import ZoomIndicator from "../components/canvas/ZoomIndicator"
import CanvasList from "../components/canvas/CanvasList"
import { getCanvasStyles } from "../styles/canvas"

export default function CanvasScreen() {
	// Context Imports
	const { notebooks } = useNotebook()
	const { addNotebook } = useNotebooks()
	const { openModal } = useModal()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getCanvasStyles(theme.colors)

	const handleCreateNotebook = () => {
		openModal({
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			buttonText: "Create Notebook",
			onSubmit: (input: string) => addNotebook(input),
		})
	}

	return (
		<View style={styles.surface}>
			<ChapterTab />
			<ZoomIndicator />
			<Toolbar />
			{notebooks.length > 0 ? (
				<CanvasList />
			) : (
				<Pressable onPress={handleCreateNotebook} style={styles.addNotebookButton}>
					<Material name='plus-circle-outline' size={64} color={theme.colors.onPrimary} />
					<Text style={GlobalStyles.paragraph}>Add a new notebook, and start studying now!</Text>
				</Pressable>
			)}
		</View>
	)
}
