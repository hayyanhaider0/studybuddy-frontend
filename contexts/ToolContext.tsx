/**
 * ToolContext Component
 *
 * Provides shared values for tool related options -- tool, stroke color,
 * stroke width, tool menus, and color picker values.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { ToolName } from "../types/global"

type ToolContextType = {
	// Currently selected tool.
	tool: ToolName
	// Setter for tool.
	setTool: React.Dispatch<React.SetStateAction<ToolName>>
	// Current stroke color.
	stroke: string
	// Setter for the stroke color.
	setStroke: React.Dispatch<React.SetStateAction<string>>
	// Currently selected stroke width.
	strokeWidth: number
	// Setter for the stroke width.
	setStrokeWidth: React.Dispatch<React.SetStateAction<number>>
	// Currently picked color from the color picker component.
	pickedColor: string
	// Setter for the picked color from the color picker component.
	setPickedColor: React.Dispatch<React.SetStateAction<string>>
	// Currently active menu -- if any.
	activeMenu: ToolName | null
	// Setter for active menu.
	setActiveMenu: React.Dispatch<React.SetStateAction<ToolName | null>>
	// Current state of the color picker.
	colorPicker: boolean
	// Setter for the color picker state -- open or closed.
	setColorPicker: React.Dispatch<React.SetStateAction<boolean>>
}

// React context for tool.
export const ToolContext = createContext<ToolContextType | null>(null)

/**
 * ToolProvider Component
 *
 * Wraps children components, providing tool values via context.
 *
 * @param children -
 */
export function ToolProvider({ children }: { children: ReactNode }) {
	// Tool, stroke, and stroke width values.
	const [tool, setTool] = useState<ToolName>("pen")
	const [stroke, setStroke] = useState<string>("black")
	const [strokeWidth, setStrokeWidth] = useState<number>(4)
	// Color picker values.
	const [pickedColor, setPickedColor] = useState<string>("red")
	const [colorPicker, setColorPicker] = useState<boolean>(false)
	// Active tool menu.
	const [activeMenu, setActiveMenu] = useState<ToolName | null>(null)

	return (
		<ToolContext.Provider
			value={{
				tool,
				setTool,
				stroke,
				setStroke,
				pickedColor,
				setPickedColor,
				strokeWidth,
				setStrokeWidth,
				activeMenu,
				setActiveMenu,
				colorPicker,
				setColorPicker,
			}}
		>
			{children}
		</ToolContext.Provider>
	)
}

/**
 * useToolContext hook
 *
 * Custom hook to access tool context values.
 *
 * @throws Error if used outside a ToolProvider.
 * @returns ToolContext containing tool context values.
 */
export const useToolContext = () => {
	const ctx = useContext(ToolContext)
	if (!ctx) throw new Error("useToolContext must be used within a ToolProvider")
	return ctx
}
