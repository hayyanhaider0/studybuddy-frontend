/**
 * notebook Styles
 *
 * Contains styles for the NotebookScreen and related components.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getNotebookStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		listContainer: {
			flexDirection: "row",
			flexWrap: "wrap",
			padding: 32,
			gap: 16,
			justifyContent: "center",
			alignItems: "center",
		},
		createNotebookButton: {
			width: 72,
			height: 96,
			backgroundColor: colors.secondary,
			alignSelf: "flex-start",
			alignItems: "center",
			justifyContent: "center",
		},
	})
