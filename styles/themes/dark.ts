/**
 * dark Theme
 *
 * Includes name, barStyle (top of the phone), and colors for the dark theme.
 */

import { ColorValue } from "react-native"
import { ThemeName } from "../../enums/global"

export const darkTheme = {
	name: ThemeName.DARK,
	barStyle: "light-content",
	colors: {
		primary: "#1A1A1A", // darkest
		secondary: "#2A2A2A",
		tertiary: "#3A3A3A",
		surface: "#333333", // brightest surface
		background: "#121212",
		textPrimary: "#E0E0E0",
		textSecondary: "#A0A0A0",
		error: "#F28B82", // still red for visibility
		placeholder: "#7A7A7A",
		link: "#8AB4F8", // only colored
		onPrimary: "#FFFFFF",
		onSecondary: "#121212",
	},
	accent: {
		gradient: {
			colors: ["#11998e", "#38ef7d"] as readonly [ColorValue, ColorValue, ...ColorValue[]],
			start: { x: 0, y: 0 },
			end: { x: 1, y: 1 },
		},
		onAccent: "#ffffff",
	},
}
