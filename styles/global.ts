/**
 * global Styles
 *
 * Contains global styles for Studdy Buddy UI.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"
import { fontSizes } from "./scales"

export const getGlobalStyles = (colors: ThemeColors, fontScale: number) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		heading: {
			fontSize: fontSizes.xl * fontScale,
			fontWeight: "bold",
			color: colors.textPrimary,
			textAlign: "center",
		},
		subheading: {
			fontSize: fontSizes.lg * fontScale,
			fontWeight: "bold",
			color: colors.textPrimary,
			textAlign: "center",
		},
		paragraph: {
			fontSize: fontSizes.md * fontScale,
			color: colors.textPrimary,
			textAlign: "center",
		},
		subtext: {
			fontSize: fontSizes.sm * fontScale,
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
			borderWidth: 1,
			borderColor: colors.secondary,
			alignItems: "center",
			justifyContent: "center",
		},
		buttonText: {
			color: colors.onPrimary,
			fontSize: fontSizes.md * fontScale,
			fontWeight: "bold",
		},
		input: {
			width: "100%",
			borderRadius: 999,
			paddingVertical: 8,
			paddingHorizontal: 16,
			fontSize: fontSizes.md * fontScale,
			backgroundColor: colors.secondary,
			color: colors.textPrimary,
		},
		link: {
			fontSize: fontSizes.md * fontScale,
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
		choiceModalContainer: {
			position: "absolute",
			bottom: 0,
			width: "100%",
			minHeight: "40%",
			maxHeight: "60%",
			backgroundColor: colors.primary,
			borderTopLeftRadius: 36,
			borderTopRightRadius: 36,
			padding: 24,
			gap: 8,
		},
		modalChoices: {
			backgroundColor: colors.secondary,
			width: "100%",
			gap: 1,
			marginVertical: 8,
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
		select: {
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 16,
		},
		option: {
			flexDirection: "row",
			backgroundColor: colors.primary,
			paddingVertical: 8,
			paddingHorizontal: 16,
			borderRadius: 99,
			gap: 8,
			maxWidth: "50%",
		},
	})
