/**
 * notebook Styles
 *
 * Contains styles for the NotebookScreen and related components.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getNotebookStyles = (_colors: ThemeColors) =>
	StyleSheet.create({
		createNotebookButton: {
			width: 72,
			height: 96,
			alignSelf: "flex-start",
			alignItems: "center",
			justifyContent: "center",
		},
	})
