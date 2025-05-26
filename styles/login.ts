import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/types"

export const getLoginStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		screen: {
			flexGrow: 1,
			padding: 32,
			paddingVertical: 64,
		},
		inputContainer: {
			width: "100%",
			gap: 32,
		},
		inputBox: {
			position: "relative",
			borderWidth: 1,
			borderColor: colors.text,
			borderRadius: 999,
			width: "100%",
			paddingHorizontal: 16,
			paddingVertical: 8,
		},
		label: {
			position: "absolute",
			backgroundColor: colors.background,
			paddingHorizontal: 4,
			top: -12,
			left: 16,
			fontSize: 16,
		},
		input: {
			textAlign: "left",
			paddingVertical: 4,
			outlineWidth: 0,
		},
	})
