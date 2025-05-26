import { createContext, ReactNode, useContext, useState } from "react"
import { themes } from "../styles/themes"
import { getGlobalStyles } from "../styles/global"

type ThemeName = keyof typeof themes

type ThemeContextType = {
	theme: typeof themes.light
	setTheme: (name: ThemeName) => void
	toggleTheme: () => void
	GlobalStyles: ReturnType<typeof getGlobalStyles>
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [themeName, setThemeName] = useState<ThemeName>("light")
	const theme = themes[themeName]
	const GlobalStyles = getGlobalStyles(theme.colors)

	const setTheme = (name: ThemeName) => {
		setThemeName(name)
	}

	const toggleTheme = () => {
		setThemeName((prev) => (prev === "light" ? "dark" : "light"))
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme, GlobalStyles }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useThemeContext = () => {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error("useThemeContext must be used within a ThemeProvider")
	return ctx
}
