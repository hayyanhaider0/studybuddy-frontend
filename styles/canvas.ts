import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/types"

export const getCanvasStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		toolbar: {
			flexDirection: "row",
			backgroundColor: colors.primary,
			paddingLeft: 28,
			paddingRight: 16,
			gap: 16,
			borderRadius: 28,
			alignItems: "center",
			justifyContent: "space-around",
		},
		options: {
			borderRadius: 999,
			height: 32,
			width: 32,
			borderWidth: 2,
			borderColor: colors.onPrimary,
			alignItems: "center",
			justifyContent: "center",
		},
	})
