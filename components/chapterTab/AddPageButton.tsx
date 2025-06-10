import { LinearGradient } from "expo-linear-gradient"
import { Pressable } from "react-native"
import Material from "react-native-vector-icons/MaterialIcons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import { AnimatePresence, MotiView } from "moti"
import { getChapterTabStyles } from "../../styles/chapterTab"
import useNotebooks from "../../hooks/useNotebooks"
import { useNotebook } from "../../contexts/NotebookContext"

export default function AddPageButton() {
	const { chapter } = useNotebook()
	const { addCanvasToCurrentChapter } = useNotebooks() // Get function from hook

	// Theming
	const { theme } = useThemeContext()

	return (
		<>
			{chapter && (
				<Pressable
					onPress={addCanvasToCurrentChapter}
					style={{
						backgroundColor: theme.colors.secondary,
						borderRadius: 999,
						justifyContent: "center",
						alignItems: "center",
						overflow: "hidden",
					}}
				>
					<LinearGradient
						colors={theme.accent.gradient.colors}
						start={theme.accent.gradient.start}
						end={theme.accent.gradient.end}
					>
						<MaterialC name='plus' size={32} color={theme.accent.onAccent} />
					</LinearGradient>
				</Pressable>
			)}
		</>
	)
}
