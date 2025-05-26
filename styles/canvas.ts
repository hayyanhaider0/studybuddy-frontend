import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/types"

export const getCanvasStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		options: {
			borderRadius: 999,
			height: 32,
			width: 32,
			borderWidth: 2,
			borderColor: colors.buttonText,
			alignItems: "center",
			justifyContent: "center",
		},
	})
