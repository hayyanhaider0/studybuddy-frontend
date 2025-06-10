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
	const { setShowModal, setTitle, setDescription, setPlaceholder, setButtonText, setOnPress } =
		useModal()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getCanvasStyles(theme.colors)

	const handleCreateNotebook = () => {
		setTitle("Add a New Notebook")
		setDescription("Give your new notebook a name!")
		setPlaceholder("Type the name of your new notebook...")
		setButtonText("Add Notebook")
		setOnPress(() => (input: string) => addNotebook(input))
		setShowModal(true)
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
