import { LinearGradient } from "expo-linear-gradient"
import { Pressable } from "react-native"
import Material from "react-native-vector-icons/MaterialIcons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import { AnimatePresence, MotiView } from "moti"
import { getChapterTabStyles } from "../../styles/chapterTab"
import useNotebooks from "../../hooks/useNotebooks"
import { useNotebook } from "../../contexts/NotebookContext"

export default function Pagination({ extended }: { extended: boolean }) {
	const { addCanvasToCurrentChapter } = useNotebooks()
	const { canvas, setCanvas, chapter } = useNotebook()

	const { theme } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	const pagination = (increment: number) => {
		if (!chapter || !canvas) return
		const i = chapter.canvases.findIndex((c) => c.id === canvas.id)
		setCanvas((prev) => {
			if (i + increment < chapter.canvases.length) return chapter.canvases[i + increment]
			return prev
		})
	}

	return (
		<AnimatePresence>
			{extended && (
				<MotiView
					from={{ translateY: -36, opacity: 0 }}
					animate={{ translateY: 0, opacity: 1 }}
					exit={{ translateY: -36, opacity: 0 }}
					transition={{ duration: 100, type: "timing" }}
					style={styles.paginationContainer}
				>
					<Pressable
						onPress={() => pagination(-1)}
						style={{
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 8,
						}}
					>
						<Material name='arrow-back-ios-new' size={24} color={theme.colors.textPrimary} />
					</Pressable>
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
					<Pressable
						onPress={() => pagination(-1)}
						style={{
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 8,
						}}
					>
						<Material name='arrow-forward-ios' size={24} color={theme.colors.textPrimary} />
					</Pressable>
				</MotiView>
			)}
		</AnimatePresence>
	)
}
