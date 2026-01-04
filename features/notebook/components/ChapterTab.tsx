/**
 * ChapterTab Component
 *
 * The top tab shown on the CanvasScreen -- includes a button to open the sidebar menu, an extendable
 * ChapterList component, and an AddPageButton component.
 */

import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { AnimatePresence, MotiView } from "moti"
import React, { useState } from "react"
import { GestureResponderEvent, Pressable, Text, TouchableOpacity, View } from "react-native"
import { DrawerParamList } from "../../../navigation/DrawerNavigation"
import { getChapterTabStyles } from "../../../styles/chapterTab"
import { getNotebook, getChapter, getCanvas } from "../../../utils/notebook"
import { Canvas as CanvasType } from "../../../types/notebook"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import useNotebookActions from "../hooks/useNotebookActions"
import ChapterList from "./ChapterList"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useContextMenu } from "../../common/contexts/ContextMenuContext"
import ZoomIndicator from "./ZoomIndicator"

export default function ChapterTab() {
	// Get context values.
	const { notebookState } = useNotebookContext()
	const { handleChangeBackground, handleDeleteCanvas } = useNotebookActions()
	const { openMenu } = useContextMenu()
	const nav = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	const notebook = getNotebook(notebookState.notebooks, notebookState.selectedNotebookId)
	const chapter = getChapter(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId
	)
	const canvas = getCanvas(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId,
		notebookState.selectedCanvasId
	)

	const [extended, setExtended] = useState<boolean>(false) // Extended state for ChapterTab component.

	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	// Open a context menu for the current canvas.
	const handleCanvasMenu = (canvas: CanvasType, event: GestureResponderEvent) => {
		const { pageX, pageY } = event.nativeEvent

		openMenu({
			position: { x: pageX, y: pageY },
			options: [
				{ label: "Change Background", onPress: () => handleChangeBackground(canvas) },
				{ label: "Duplicate", onPress: () => console.log("Duplicate") },
				{ label: "Export", onPress: () => console.log("Export") },
				{ label: "Delete", onPress: () => handleDeleteCanvas(canvas) },
			],
		})
	}

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
				<TouchableOpacity onPress={() => nav.toggleDrawer()} style={{ padding: 8 }}>
					<MaterialC name='chevron-right' size={24} color={theme.colors.textPrimary} />
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
						{chapter && canvas && (
							<Pressable onPress={(e) => handleCanvasMenu(canvas, e)}>
								<MaterialC name='dots-vertical' size={28} color={theme.colors.textPrimary} />
							</Pressable>
						)}
					</>
				)}
				<ZoomIndicator />
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
