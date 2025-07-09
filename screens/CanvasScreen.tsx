/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 */

import { useThemeContext } from "../contexts/ThemeContext"
import { Text, Pressable, View } from "react-native"
import Toolbar from "../components/canvas/toolbar/Toolbar"
import ChapterTab from "../components/chapterTab/ChapterTab"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import useNotebookActions from "../hooks/useNotebookActions"
import ZoomIndicator from "../components/canvas/ZoomIndicator"
import CanvasList from "../components/canvas/CanvasList"
import { getCanvasStyles } from "../styles/canvas"
import { useNotebookContext } from "../contexts/NotebookContext"
import { GestureDetector } from "react-native-gesture-handler"
import { useCanvasTranslateGestures } from "../hooks/useCanvasTranslateGestures"

export default function CanvasScreen() {
	// Context Imports
	const { notebooks } = useNotebookContext()
	const { handleCreateNotebook } = useNotebookActions()
	const translateGesture = useCanvasTranslateGestures()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.surface}>
			<ChapterTab />
			<ZoomIndicator />

			{notebooks.length > 0 ? (
				<>
					<Toolbar />
					<GestureDetector gesture={translateGesture}>
						<View style={{ flex: 1, position: "relative" }}>
							<CanvasList />
						</View>
					</GestureDetector>
				</>
			) : (
				<Pressable onPress={handleCreateNotebook} style={styles.addNotebookButton}>
					<Material name='plus-circle-outline' size={64} color={theme.colors.onPrimary} />
					<Text style={[GlobalStyles.paragraph, { paddingHorizontal: 64 }]}>
						Add a new notebook, and start studying now!
					</Text>
				</Pressable>
			)}
		</View>
	)
}
