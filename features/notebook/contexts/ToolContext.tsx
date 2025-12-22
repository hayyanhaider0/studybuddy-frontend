/**
 * ToolContext Component
 *
 * Provides shared values for the currently active tool.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { ToolType } from "../../../types/tools"

type ToolContextType = {
	// Currently active tool.
	activeTool: ToolType
	// Setter for the active tool.
	setActiveTool: (tool: ToolType) => void
}

// React context for tool.
export const ToolContext = createContext<ToolContextType | null>(null)

/**
 * ToolProvider Component
 *
 * Wraps children components, providing tool values via context.
 *
 * @param children - JSX Components that require ToolProvider shared values.
 */
export function ToolProvider({ children }: { children: ReactNode }) {
	const [activeTool, setActiveTool] = useState<ToolType>("pen")

	return (
		<ToolContext.Provider value={{ activeTool, setActiveTool }}>{children}</ToolContext.Provider>
	)
}

/**
 * useTool hook
 *
 * Custom hook to access tool context values.
 *
 * @throws Error if used outside a ToolProvider.
 * @returns ToolContext containing tool context values.
 */
export const useTool = () => {
	const ctx = useContext(ToolContext)
	if (!ctx) throw new Error("useTool must be used within a ToolProvider")
	return ctx
}
