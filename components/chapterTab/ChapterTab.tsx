import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useCanvasActions } from "../../hooks/useCanvasActions"
import { getChapterTabStyles } from "../../styles/chapterTab"
import ChapterList from "./ChapterList"
import AddPageButton from "./AddPageButton"
import { useNotebook } from "../../contexts/NotebookContext"
import { getGlobalStyles } from "../../styles/global"
import { useState } from "react"
import { AnimatePresence, MotiView } from "moti"

export default function ChapterTab() {
	const [extended, setExtended] = useState<boolean>(true)
	const { notebook } = useNotebook()
	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getChapterTabStyles(theme.colors)

	return (
		<View style={styles.container}>
			{notebook && (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: theme.colors.primary,
					}}
				>
					<TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
						<MaterialC name='dots-horizontal' size={24} color={theme.colors.onPrimary} />
					</TouchableOpacity>
					<Pressable
						onPress={() => setExtended(!extended)}
						style={{ flexDirection: "row", alignItems: "center", marginRight: "auto" }}
					>
						<Text style={[GlobalStyles.subheading, { textAlign: "left", padding: 8 }]}>
							{notebook?.title}
						</Text>
						<MaterialC
							name={extended ? "chevron-up" : "chevron-down"}
							size={24}
							color={theme.colors.onPrimary}
						/>
					</Pressable>
					<AddPageButton />
				</View>
			)}
			<AnimatePresence>
				{extended && (
					<MotiView
						from={{ translateY: -40, zIndex: -10 }}
						animate={{ translateY: 0 }}
						exit={{ translateY: -40, zIndex: -10 }}
						transition={{ type: "timing", duration: 100 }}
						style={{ flexDirection: "row" }}
					>
						<ChapterList />
					</MotiView>
				)}
			</AnimatePresence>
		</View>
	)
}
