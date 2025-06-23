/**
 * AppProvider Component
 *
 * Combines app level providers like theme, sort, etc.
 */

import { ReactNode } from "react"
import { ThemeProvider } from "../contexts/ThemeContext"
import { SortProvider } from "../contexts/SortContext"
import { NotebookProvider } from "../contexts/NotebookContext"
import { SettingsProvider } from "../contexts/SettingsContext"

export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<SettingsProvider>
				<NotebookProvider>
					<SortProvider>{children}</SortProvider>
				</NotebookProvider>
			</SettingsProvider>
		</ThemeProvider>
	)
}
