import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getSettingsStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		category: {
			backgroundColor: colors.primary,
			borderRadius: 36,
			paddingHorizontal: 16,
		},
		subcategory: {
			borderColor: colors.secondary,
			paddingTop: 8,
			paddingBottom: 24,
		},
		about: {
			flexDirection: "row",
			backgroundColor: colors.primary,
			borderRadius: 50,
			paddingVertical: 24,
			paddingHorizontal: 16,
			paddingRight: 24,
			justifyContent: "space-between",
		},
		aboutLinks: {
			backgroundColor: colors.primary,
			borderRadius: 28,
			gap: 8,
			padding: 16,
		},
	})
