import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getChapterTabStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			position: "relative",
			width: "100%",
			backgroundColor: colors.primary,
			padding: 8,
			paddingTop: 40,
			zIndex: 10,
		},
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
		addPageButton: {
			padding: 4,
			aspectRatio: 1 / 1,
			borderRadius: 999,
			marginLeft: 8,
			alignItems: "center",
		},
	})
