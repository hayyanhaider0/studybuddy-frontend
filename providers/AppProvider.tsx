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
import { AuthProvider } from "../contexts/AuthContext"

export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<ThemeProvider>
				<SettingsProvider>
					<NotebookProvider>
						<SortProvider>{children}</SortProvider>
					</NotebookProvider>
				</SettingsProvider>
			</ThemeProvider>
		</AuthProvider>
	)
}
