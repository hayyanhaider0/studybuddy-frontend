/**
 * global Styles
 *
 * Contains global styles for Studdy Buddy UI.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

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
		subheading: {
			fontSize: 24,
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
			borderColor: colors.secondary,
			alignItems: "center",
		},
		secondaryButton: {
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.secondary,
			alignItems: "center",
		},
		buttonText: {
			color: colors.onPrimary,
			fontSize: 16,
			fontWeight: "bold",
		},
		input: {
			width: "100%",
			borderRadius: 999,
			paddingHorizontal: 16,
			backgroundColor: colors.secondary,
			color: colors.textPrimary,
		},
		link: {
			color: colors.link,
			textDecorationLine: "underline",
		},
		error: {
			color: colors.error,
		},
		modalContainer: {
			width: 292,
			backgroundColor: colors.primary,
			alignItems: "center",
			justifyContent: "center",
			padding: 16,
			borderRadius: 28,
			gap: 16,
		},
		dimBackground: {
			position: "absolute",
			zIndex: 100,
			width: "100%",
			height: "100%",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#000000" + "90",
		},
	})
