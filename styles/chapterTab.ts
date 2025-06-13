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
		addChapterButton: {
			borderRadius: 999,
			padding: 2,
			aspectRatio: 1 / 1,
			marginLeft: 4,
		},
		// AddPageButton styles
		addPageButton: {
			padding: 4,
			aspectRatio: 1 / 1,
			borderRadius: 999,
			marginLeft: 8,
			alignItems: "center",
		},
	})
