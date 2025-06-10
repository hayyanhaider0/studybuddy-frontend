import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getChapterTabStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			position: "relative",
			width: "100%",
			backgroundColor: colors.primary,
			padding: 8,
			paddingTop: 48,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 10,
		},
		list: {
			borderRadius: 999,
			padding: 16,
			paddingVertical: 8,
		},
		addChapterButton: {
			borderRadius: 999,
			padding: 6,
			aspectRatio: 1 / 1,
			marginLeft: 4,
		},
		paginationContainer: {
			position: "absolute",
			top: 88,
			right: 0,
			flexDirection: "row",
			backgroundColor: colors.primary,
			borderBottomStartRadius: 26,
			paddingVertical: 8,
			marginLeft: 8,
			zIndex: -10,
		},
	})
