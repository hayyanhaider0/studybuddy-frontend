/**
 * canvas Styles
 *
 * Contains styles relating to components in the canvas including Toolbar,
 * ColorOptions, StrokeOptions, etc.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getCanvasStyles = (colors: ThemeColors, stroke?: string) =>
	StyleSheet.create({
		// Toolbar styles
		toolbarContainer: {
			position: "absolute",
			bottom: 16,
			zIndex: 10,
			width: "100%",
			alignItems: "center",
		},
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
		toolOptions: {
			flexDirection: "row",
			gap: 16,
			paddingTop: 16,
			overflow: "hidden",
		},
		toolMenu: {
			position: "relative",
			padding: 16,
			gap: 16,
			margin: 8,
			borderRadius: 28,
			backgroundColor: colors.primary,
		},
		// Color container styles
		colorContainer: {
			width: 232,
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 8,
		},
		// Option container styles
		optionContainer: {
			width: 84,
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 8,
			backgroundColor: colors.tertiary,
			padding: 8,
			borderRadius: 16,
		},
		options: {
			borderRadius: 999,
			height: 32,
			width: 32,
			borderWidth: 1,
			borderColor: colors.onPrimary,
			alignItems: "center",
			justifyContent: "center",
		},
		// Slider styles
		sliderContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: 16,
			width: 232,
			gap: 8,
		},
		strokeIndicator: {
			backgroundColor: stroke,
			width: 24,
			height: 24,
			borderRadius: 999,
			borderColor: colors.onPrimary,
			borderWidth: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		slider: {
			width: "100%",
			padding: 2,
		},
		tooltipContainer: {
			backgroundColor: "#000",
			borderWidth: 2,
			borderColor: "#fff",
			borderRadius: 999,
			borderBottomEndRadius: 0,
			aspectRatio: 1 / 1,
			transform: [{ translateY: -42 }, { rotate: "45deg" }],
			alignItems: "center",
		},
		tooltipText: {
			color: colors.onPrimary,
			padding: 4,
			transform: [{ rotate: "-45deg" }],
		},
		// Color picker styles
		colorPickerContainer: {
			backgroundColor: colors.primary,
			gap: 16,
			padding: 32,
			borderRadius: 28,
		},
		// Zoom indicator styles
		zoomIndicator: {
			position: "absolute",
			top: 32,
			right: 16,
			padding: 8,
			backgroundColor: colors.primary,
			borderRadius: 999,
			alignItems: "center",
			justifyContent: "center",
			zIndex: 10,
		},
	})
