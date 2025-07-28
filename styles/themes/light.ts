/**
 * light Theme
 *
 * Includes name, barStyle (top of the phone), and colors for the light theme.
 */

import { ColorValue } from "react-native"
import { ThemeName } from "../../enums/global"

export const lightTheme = {
	name: ThemeName.LIGHT,
	barStyle: "dark-content",
	colors: {
		primary: "#E6E6E6",
		secondary: "#D6D6D6",
		tertiary: "#C6C6C6",
		surface: "#DEDEDE",
		background: "#F0F0F0",

		textPrimary: "#1A1A1A",
		textSecondary: "#4A4A4A",
		placeholder: "#7A7A7A",
		error: "#D32F2F",
		link: "#1A73E8",
		onPrimary: "#1A1A1A",
		onSecondary: "#1A1A1A",
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
