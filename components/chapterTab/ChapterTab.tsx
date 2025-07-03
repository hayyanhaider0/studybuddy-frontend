/**
 * ChapterTab Component
 *
 * The top tab shown on the CanvasScreen -- includes a button to open the sidebar menu, an extendable
 * ChapterList component, and an AddPageButton component.
 */

import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useCanvasActions } from "../../hooks/useCanvasActions"
import { getChapterTabStyles } from "../../styles/chapterTab"
import ChapterList from "./ChapterList"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { useState } from "react"
import { AnimatePresence, MotiView } from "moti"
import CustomPressable from "../common/CustomPressable"
import useNotebookActions from "../../hooks/useNotebookActions"

export default function ChapterTab() {
	const [extended, setExtended] = useState<boolean>(true) // Extended state for ChapterTab component.

	// Get context values.
	const { notebook, chapter } = useNotebookContext()
	const { addCanvasToCurrentChapter } = useNotebookActions()
	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: theme.colors.primary,
				}}
			>
				{/* Opens the sidebar drawer */}
				<TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
					<MaterialC name='chevron-right' size={24} color={theme.colors.onPrimary} />
				</TouchableOpacity>
				{/* Renders only when there's an active notebook */}
				{notebook && (
					<>
						{/* The whole title is a button which extends the top bar to reveal the ChapterList */}
						<Pressable onPress={() => setExtended(!extended)} style={styles.titleButton}>
							{/* Notebook title */}
							<Text
								style={[GlobalStyles.subheading, { textAlign: "left", padding: 8 }]}
								numberOfLines={1}
								ellipsizeMode='middle'
							>
								{notebook.title}
							</Text>
							{/* Icon to show state of extended */}
							<MaterialC
								name={extended ? "chevron-up" : "chevron-down"}
								size={24}
								color={theme.colors.onPrimary}
							/>
						</Pressable>
						{/* Add a new canvas/page */}
						{chapter && (
							<CustomPressable type='primary' onPress={addCanvasToCurrentChapter} circle>
								<MaterialC name='plus' size={28} color={theme.accent.onAccent} />
							</CustomPressable>
						)}
					</>
				)}
			</View>
			{/* Renders all the chapters in the active notebook and allows navigation through them */}
			<AnimatePresence>
				{extended && (
					<MotiView
						from={{ height: 0 }}
						animate={{ height: 44 }}
						exit={{ height: 0 }}
						style={{ overflow: "hidden", transformOrigin: "top" }}
						transition={{ type: "timing", duration: 200 }}
					>
						{notebook && <ChapterList />}
					</MotiView>
				)}
			</AnimatePresence>
		</View>
	)
}
