/**
 * AppProvider Component
 *
 * Combines app level providers like theme, sort, etc.
 */

import { ReactNode } from "react"
import { ThemeProvider } from "../contexts/ThemeContext"
import { SortProvider } from "../contexts/SortContext"
import { NotebookProvider } from "../contexts/NotebookContext"

export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<NotebookProvider>
				<SortProvider>{children}</SortProvider>
			</NotebookProvider>
		</ThemeProvider>
	)
}
