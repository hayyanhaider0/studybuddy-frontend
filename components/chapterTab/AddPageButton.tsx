/**
 * AddPageButton Component
 *
 * Allows the user to add a new canvas/page to the current chapter.
 */

import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import useNotebooks from "../../hooks/useNotebooks"
import { useNotebook } from "../../contexts/NotebookContext"
import CustomPressable from "../common/CustomPressable"
import { getChapterTabStyles } from "../../styles/chapterTab"

export default function AddPageButton() {
	// Get context imports.
	const { chapter } = useNotebook()
	const { addCanvasToCurrentChapter } = useNotebooks() // Get function from hook

	// Theming
	const { theme } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	return (
		<>
			{chapter && (
				<CustomPressable
					type='primary'
					onPress={addCanvasToCurrentChapter}
					style={styles.addPageButton}
				>
					<MaterialC name='plus' size={28} color={theme.accent.onAccent} />
				</CustomPressable>
			)}
		</>
	)
}
