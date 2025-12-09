/**
 * NotebookContext
 *
 * Provides shared values for notebook related tasks -- pagination, chapter and notebook
 * selection.
 */

import React, { createContext, ReactNode, useContext, useReducer } from "react"
import {
	NotebookState,
	NOTEBOOK_ACTION,
	notebookReducer,
	INITIAL_STATE,
} from "../reducers/notebookReducer"

// Types for the notebook context.
type NotebookContextType = {
	// List of all notebooks.
	notebookState: NotebookState
	// Setter for the list of all notebooks.
	dispatch: React.Dispatch<NOTEBOOK_ACTION>
}

// React context for pagination, chapter and notebook selection.
const NotebookContext = createContext<NotebookContextType | null>(null)

/**
 * NotebookProvider Component
 *
 * Wraps children components, providing notebook state values via context.
 *
 * @param children - JSX Components that require NotebookProvider shared values.
 */
export const NotebookProvider = ({ children }: { children: ReactNode }) => {
	// Pagination, chapter and notebook state values.
	const [notebookState, dispatch] = useReducer(notebookReducer, INITIAL_STATE)

	return (
		<NotebookContext.Provider
			value={{
				notebookState,
				dispatch,
			}}
		>
			{children}
		</NotebookContext.Provider>
	)
}

/**
 * useNotebook Hook
 *
 * Custom hook to provide shared notebook context values.
 *
 * @throws Error if used outside NotebookProvider.
 * @returns NotebookContext shared values.
 */
export const useNotebookContext = () => {
	const ctx = useContext(NotebookContext)
	if (!ctx) throw new Error("useNotebook must be used within a NotebookProvider")
	return ctx
}
