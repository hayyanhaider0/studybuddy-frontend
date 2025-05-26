import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/types"

export const getGlobalStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		heading: {
			fontSize: 32,
			fontWeight: "bold",
			color: colors.text,
			textAlign: "center",
		},
		paragraph: {
			fontSize: 16,
			color: colors.text,
			textAlign: "center",
		},
		button: {
			backgroundColor: colors.accent,
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 999,
			alignItems: "center",
			width: "100%",
		},
		buttonText: {
			color: colors.buttonText,
			fontSize: 16,
			fontWeight: "bold",
		},
		link: {
			color: colors.link,
			textDecorationLine: "underline",
		},
		error: {
			color: colors.error,
		},
	})
