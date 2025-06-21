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
		subtext: {
			fontSize: 10,
			color: colors.textSecondary,
			textAlign: "center",
		},
		button: {
			paddingVertical: 8,
			paddingHorizontal: 16,
			borderRadius: 999,
			alignItems: "center",
		},
		secondaryButton: {
			paddingVertical: 8,
			paddingHorizontal: 16,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: colors.secondary,
			alignItems: "center",
		},
		buttonText: {
			color: colors.onPrimary,
			fontSize: 14,
			fontWeight: "bold",
		},
		input: {
			width: "100%",
			borderRadius: 999,
			paddingVertical: 8,
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
		headerContainer: {
			backgroundColor: colors.primary,
			paddingTop: 48,
			paddingBottom: 16,
			paddingHorizontal: 16,
			borderBottomColor: colors.textPrimary,
		},
		headerItemsContainer: {
			flexDirection: "row",
			gap: 16,
			alignItems: "center",
			justifyContent: "space-between",
		},
		sidebarContainer: {
			backgroundColor: colors.background,
			minHeight: "100%",
			padding: 8,
		},
		sidebarButtonContainer: {
			flexDirection: "row",
			alignItems: "center",
			padding: 4,
		},
		sidebarFocused: {
			flexDirection: "row",
			alignItems: "center",
			width: "100%",
			borderRadius: 999,
			paddingHorizontal: 16,
			gap: 8,
		},
		sidebarUnfocused: {
			backgroundColor: colors.primary,
			borderRadius: 999,
			paddingHorizontal: 16,
			width: "100%",
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
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
		dropdownContainer: {
			position: "absolute",
			backgroundColor: colors.secondary,
			transformOrigin: "top",
			borderRadius: 8,
			justifyContent: "center",
		},
	})
