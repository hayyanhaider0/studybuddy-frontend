/**
 * login Styles
 *
 * Contains styles for login and signup related components.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"
import { fontSizes } from "./scales"

export const getLoginStyles = (colors: ThemeColors, fontScale: number) =>
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
			paddingVertical: 4,
			paddingHorizontal: 16,
		},
		label: {
			position: "absolute",
			backgroundColor: colors.background,
			paddingHorizontal: 4,
			top: -12,
			left: 16,
			fontSize: fontSizes.md * fontScale,
		},
		input: {
			textAlign: "left",
			outlineWidth: 0,
		},
		verificationCodeContainer: {
			width: 32,
			borderWidth: 2,
			borderColor: colors.textPrimary,
			borderRadius: 8,
			fontSize: fontSizes.lg,
			color: colors.textPrimary,
			textAlign: "center",
		},
	})
