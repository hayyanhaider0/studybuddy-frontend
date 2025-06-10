/**
 * canvas Styles
 *
 * Contains styles relating to components in the canvas including Toolbar,
 * ColorOptions, StrokeOptions, etc.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getCanvasStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		// The surface sits behind canvases
		surface: {
			flex: 1,
			backgroundColor: colors.surface,
			alignItems: "center",
			justifyContent: "center",
		},
		// Add notebook button shown when there's no notebooks
		addNotebookButton: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			paddingBottom: 112,
			gap: 16,
		},
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
			justifyContent: "space-around",
			gap: 16,
			paddingTop: 16,
			overflow: "hidden",
		},
		toolMenu: {
			position: "relative",
			padding: 16,
			gap: 24,
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
			backgroundColor: colors.secondary,
			padding: 8,
			borderRadius: 16,
		},
		options: {
			borderRadius: 999,
			height: 32,
			width: 32,
			alignItems: "center",
			justifyContent: "center",
			color: colors.onSecondary,
		},
		// Slider styles
		sliderContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			width: 232,
		},
		slider: {
			width: "70%",
			marginVertical: 2,
		},
		tooltipContainer: {
			backgroundColor: colors.tertiary,
			borderRadius: 999,
			width: 24,
			height: 48,
			alignItems: "center",
			bottom: 24,
			zIndex: 10,
		},
		tooltipText: {
			paddingTop: 4,
			color: colors.onPrimary,
			fontWeight: "bold",
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
			top: 104,
			right: 16,
			padding: 8,
			backgroundColor: colors.primary,
			borderRadius: 999,
			alignItems: "center",
			justifyContent: "center",
			zIndex: 10,
		},
	})
