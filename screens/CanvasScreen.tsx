/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 */

import { useThemeContext } from "../features/common/contexts/ThemeContext"
import { Text, Pressable, View } from "react-native"
import Toolbar from "../features/notebook/components/canvas/toolbar/Toolbar"
import ChapterTab from "../features/notebook/components/chapterTab/ChapterTab"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import useNotebookActions from "../features/notebook/hooks/useNotebookActions"
import ZoomIndicator from "../features/notebook/components/canvas/ZoomIndicator"
import CanvasList from "../features/notebook/components/canvas/CanvasList"
import { getCanvasStyles } from "../styles/canvas"
import { useNotebookContext } from "../features/notebook/contexts/NotebookContext"
import { GestureDetector } from "react-native-gesture-handler"
import { useCanvasTranslateGestures } from "../features/notebook/hooks/useCanvasTranslateGestures"
import useGetNotebooks from "../features/notebook/hooks/useGetNotebooks"
import LoadingSpinner from "../features/common/components/LoadingSpinner"

export default function CanvasScreen() {
	// Context Imports
	const { notebooks } = useNotebookContext()
	const { handleCreateNotebook } = useNotebookActions()
	const translateGesture = useCanvasTranslateGestures()
	const { isLoading } = useGetNotebooks()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.surface}>
			<ChapterTab />
			<ZoomIndicator />

			{isLoading ? (
				<LoadingSpinner />
			) : notebooks.length > 0 ? (
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
