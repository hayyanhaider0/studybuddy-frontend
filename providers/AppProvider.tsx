/**
 * AppProvider Component
 *
 * Combines app level providers like theme, sort, etc.
 */

import { ReactNode } from "react"
import { ThemeProvider } from "../features/common/contexts/ThemeContext"
import { SortProvider } from "../features/common/contexts/SortContext"
import { NotebookProvider } from "../features/notebook/contexts/NotebookContext"
import { SettingsProvider } from "../features/common/contexts/SettingsContext"
import { AuthProvider } from "../features/auth/contexts/AuthContext"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "../api/queryClient"
import { LLMProvider } from "../features/llm/contexts/LLMContext"

export function AppProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<NotebookProvider>
					<ThemeProvider>
						<SettingsProvider>
							<SortProvider>
								<LLMProvider>{children}</LLMProvider>
							</SortProvider>
						</SettingsProvider>
					</ThemeProvider>
				</NotebookProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}
