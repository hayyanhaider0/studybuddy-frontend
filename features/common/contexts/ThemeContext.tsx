/**
 * ThemeContext Component
 *
 * Provides shared values related to theming.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { themes } from "../../../styles/themes"
import { getGlobalStyles } from "../../../styles/global"
import { Appearance } from "react-native"
import { FontScale, ThemeName } from "../../../enums/global"

type ThemeContextType = {
	// Current theme.
	theme: typeof themes.light
	// Setter for the theme.
	setTheme: (name: ThemeName) => void
	// Boolean to show whether the system theme is being used as the default.
	useSystemTheme: boolean
	// Toggles the use of system theme as the default.
	toggleSystemTheme: () => void
	// The current font scale set by the user.
	fontScale: FontScale
	// Setter for the font scale.
	setFontScale: React.Dispatch<React.SetStateAction<FontScale>>
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
	const systemTheme = Appearance.getColorScheme() || ThemeName.LIGHT
	// Theme based on the system theme.
	const [useSystemTheme, setUseSystemTheme] = useState(true)
	// Name of the current theme.
	const [themeName, setThemeName] = useState<ThemeName>(ThemeName.LIGHT)
	// Find the current theme from an array of all themes.
	const theme = useSystemTheme ? themes[systemTheme as ThemeName] : themes[themeName]
	// Font Size scale multiplier for Study Buddy.
	const [fontScale, setFontScale] = useState(FontScale.MEDIUM)
	// Global styles -- styles/global.ts
	const GlobalStyles = getGlobalStyles(theme.colors, fontScale)

	// Setter for theme
	const setTheme = (name: ThemeName) => {
		if (useSystemTheme) setUseSystemTheme(false)
		setThemeName(name)
	}

	// Uses the system theme as the default theme.
	const toggleSystemTheme = () => {
		setUseSystemTheme((prev) => !prev)
	}

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme,
				useSystemTheme,
				toggleSystemTheme,
				fontScale,
				setFontScale,
				GlobalStyles,
			}}
		>
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
