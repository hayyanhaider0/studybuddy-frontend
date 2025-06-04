/**
 * ToolContext Component
 *
 * Provides shared values for tool related options -- tool, stroke color,
 * stroke width, tool menus, and color picker values.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { ToolName } from "../types/global"

type ToolSettings = {
	color: string
	size: number
	strokeLinecap?: "butt" | "round"
	strokeLinejoin?: "bevel" | "round"
}

type ToolSettingsMap = {
	[toolName in ToolName]: ToolSettings
}

type ToolContextType = {
	// Currently selected tool.
	tool: ToolName
	// Setter for tool.
	setTool: React.Dispatch<React.SetStateAction<ToolName>>
	// Tool settings: tool color and size.
	toolSettings: ToolSettingsMap
	// Setter for all tools settings.
	setToolSettings: React.Dispatch<React.SetStateAction<ToolSettingsMap>>
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
	// Tool and tool setting values.
	const [tool, setTool] = useState<ToolName>("pen")
	const [toolSettings, setToolSettings] = useState<ToolSettingsMap>({
		pen: { color: "black", size: 4, strokeLinecap: "round", strokeLinejoin: "round" },
		eraser: { color: "transparent", size: 4 },
		pencil: { color: "black", size: 1, strokeLinecap: "round", strokeLinejoin: "round" },
		highlighter: { color: "#FFFF004D", size: 32, strokeLinecap: "butt", strokeLinejoin: "bevel" },
		text: { color: "black", size: 8 },
	})
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
				toolSettings,
				setToolSettings,
				pickedColor,
				setPickedColor,
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
