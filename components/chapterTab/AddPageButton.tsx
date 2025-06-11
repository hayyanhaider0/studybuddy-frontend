import { LinearGradient } from "expo-linear-gradient"
import { Pressable } from "react-native"
import Material from "react-native-vector-icons/MaterialIcons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import { AnimatePresence, MotiView } from "moti"
import { getChapterTabStyles } from "../../styles/chapterTab"
import useNotebooks from "../../hooks/useNotebooks"
import { useNotebook } from "../../contexts/NotebookContext"
import CustomPressable from "../common/CustomPressable"

export default function AddPageButton() {
	const { chapter } = useNotebook()
	const { addCanvasToCurrentChapter } = useNotebooks() // Get function from hook

	// Theming
	const { theme } = useThemeContext()

	return (
		<>
			{chapter && (
				<CustomPressable
					type='primary'
					onPress={addCanvasToCurrentChapter}
					style={{ padding: 4, aspectRatio: 1 / 1, borderRadius: 999, marginLeft: 8 }}
				>
					<MaterialC name='plus' size={28} color={theme.accent.onAccent} />
				</CustomPressable>
			)}
		</>
	)
}
