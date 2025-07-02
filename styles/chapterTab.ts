/**
 * chapterTab Styles
 *
 * Contains styles relating to components in the chapterTab including ChapterTab,
 * ChapterList, and the AddPageButton.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getChapterTabStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		// ChapterTab styles
		container: {
			position: "relative",
			width: "100%",
			backgroundColor: colors.primary,
			padding: 8,
			paddingTop: 40,
			zIndex: 10,
		},
		// ChapterList styles
		list: {
			borderRadius: 999,
			paddingVertical: 8,
			paddingHorizontal: 16,
		},
		// Button styles
		addChapterButton: {
			alignItems: "center",
			padding: 3,
			justifyContent: "center",
			aspectRatio: 1 / 1,
			marginLeft: 4,
		},
		addPageButton: {
			padding: 4,
			aspectRatio: 1 / 1,
			borderRadius: 999,
			marginLeft: 8,
			alignItems: "center",
		},
		titleButton: {
			flex: 1,
			width: "50%",
			flexDirection: "row",
			alignItems: "center",
			flexWrap: "nowrap",
			paddingRight: 32,
			paddingBottom: 1,
		},
	})
