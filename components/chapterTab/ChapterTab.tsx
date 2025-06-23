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
import AddPageButton from "./AddPageButton"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { getGlobalStyles } from "../../styles/global"
import { useState } from "react"
import { MotiView } from "moti"

export default function ChapterTab() {
	const [extended, setExtended] = useState<boolean>(true) // Extended state for ChapterTab component.

	// Get context values.
	const { notebook } = useNotebookContext()
	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const styles = getChapterTabStyles(theme.colors)

	return (
		<MotiView
			// Increase the height of the container to reveal the chapter tab upon extension.
			animate={{ height: extended ? (notebook ? 133 : 96) : 96 }}
			transition={{ type: "timing", duration: 200 }}
			style={styles.container}
		>
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
						<Pressable
							onPress={() => setExtended(!extended)}
							style={{
								flex: 1,
								width: "50%",
								flexDirection: "row",
								alignItems: "center",
								flexWrap: "nowrap",
								paddingRight: 32,
								paddingBottom: 1,
							}}
						>
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
						<AddPageButton />
					</>
				)}
			</View>
			{/* Renders all the chapters in the active notebook and allows navigation through them */}
			{notebook && <ChapterList />}
		</MotiView>
	)
}
