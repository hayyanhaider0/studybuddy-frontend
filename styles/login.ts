/**
 * login Styles
 *
 * Contains styles for login and signup related components.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getLoginStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		screen: {
			flexGrow: 1,
			padding: 32,
			paddingVertical: 64,
		},
		// Input styles
		inputContainer: {
			width: "100%",
			gap: 32,
		},
		inputBox: {
			position: "relative",
			borderWidth: 1,
			borderColor: colors.textPrimary,
			borderRadius: 999,
			width: "100%",
			paddingVertical: 12,
			paddingHorizontal: 16,
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
			outlineWidth: 0,
		},
	})
