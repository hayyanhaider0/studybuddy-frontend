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
			color: colors.textPrimary,
			textAlign: "center",
		},
		paragraph: {
			fontSize: 16,
			color: colors.textPrimary,
			textAlign: "center",
		},
		button: {
			backgroundColor: colors.secondary,
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.textSecondary,
			alignItems: "center",
			width: "100%",
		},
		buttonText: {
			color: colors.onPrimary,
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
