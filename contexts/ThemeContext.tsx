/**
 * ThemeContext Component
 *
 * Provides shared values related to theming.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { themes } from "../styles/themes"
import { getGlobalStyles } from "../styles/global"
import { Appearance } from "react-native"

// Types
export type ThemeName = keyof typeof themes // All available themes.
export const themeNames: ThemeName[] = Object.keys(themes) as ThemeName[]
// Check out styles/themes for more information.

type ThemeContextType = {
	// Current theme.
	theme: typeof themes.light
	// Setter for the theme.
	setTheme: (name: ThemeName) => void
	// Toggles light and dark themes -- REMOVE ONCE DROPDOWN FOR THEMES IS IN PLACE.
	toggleTheme: () => void
	// Global styles -- check out styles/global.ts for more information.
	GlobalStyles: ReturnType<typeof getGlobalStyles>
}

// React context for Theme
export const ThemeContext = createContext<ThemeContextType | null>(null)

/**
 * ThemeProvider Component
 *
 * Wraps the whole app, providing theme and global style values.
 *
 * @param children - React components that need to utilize theming.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
	// Get the system theme.
	const systemTheme = Appearance.getColorScheme()
	// Name of the current theme.
	const [themeName, setThemeName] = useState<ThemeName>(systemTheme || "light")
	// Find the current theme from an array of all themes.
	const theme = themes[themeName]
	// Global styles -- styles/global.ts
	const GlobalStyles = getGlobalStyles(theme.colors)

	/**
	 * setTheme function
	 *
	 * Setter for the current theme.
	 *
	 * @param name - Name of the new theme.
	 */
	const setTheme = (name: ThemeName) => {
		setThemeName(name)
	}

	// REMOVE ONCE THEME DROPDOWN IS IMPLEMENTED.
	const toggleTheme = () => {
		setThemeName((prev) => (prev === "light" ? "dark" : "light"))
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme, GlobalStyles }}>
			{children}
		</ThemeContext.Provider>
	)
}

/**
 * useThemeContext hook
 *
 * Custom hook to access theme values.
 *
 * @throws Error if used outside of a ThemeProvider.
 * @returns ThemeContext containing theming values.
 */
export const useThemeContext = () => {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error("useThemeContext must be used within a ThemeProvider")
	return ctx
}
