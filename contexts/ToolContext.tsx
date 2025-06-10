/**
 * ToolContext Component
 *
 * Provides shared values for tool related options -- tool, stroke color,
 * stroke width, tool menus, and color picker values.
 */

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ToolName, ToolSwatches } from "../types/global"
import AsyncStorage from "@react-native-async-storage/async-storage"

/////////////////////////////////////////
// TYPES
/////////////////////////////////////////
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

	// Value for whether the toolbar is collapsed or not.
	collapsed: boolean
	// Setter for the toolbar's collapse state.
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>

	// Swatches for all tools.
	swatches: ToolSwatches
	// Setter for swatches for all tools.
	setSwatches: React.Dispatch<React.SetStateAction<ToolSwatches>>
	// Tracker for which swatch is being edited.
	swatchEditInfo: { tool: ToolName; index: number } | null
	// Setter for swatch editing tracker.
	setSwatchEditInfo: React.Dispatch<React.SetStateAction<{ tool: ToolName; index: number } | null>>

	// Currently active menu -- if any.
	activeMenu: ToolName | null
	// Setter for active menu.
	setActiveMenu: React.Dispatch<React.SetStateAction<ToolName | null>>

	// Current state of the color picker.
	colorPicker: boolean
	// Setter for the color picker state -- open or closed.
	setColorPicker: React.Dispatch<React.SetStateAction<boolean>>
}

/////////////////////////////////////////
// DEFAULT VALUES
/////////////////////////////////////////
const DEFAULT_SWATCHES = ["#dc2626", "#fb923c", "#facc15", "#3b82f6", "#10b981", "#000000"]
const DEFAULT_TOOL_SETTINGS = {
	pen: { color: "#dc2626", size: 4, strokeLinecap: "round", strokeLinejoin: "round" },
	eraser: { color: "transparent", size: 4 },
	pencil: { color: "black", size: 1, strokeLinecap: "round", strokeLinejoin: "round" },
	highlighter: { color: "#FFFF004D", size: 32, strokeLinecap: "butt", strokeLinejoin: "bevel" },
	text: { color: "black", size: 8 },
} as const
const DEFAULT_SWATCH_MAP = {
	pen: DEFAULT_SWATCHES,
	eraser: [],
	pencil: DEFAULT_SWATCHES,
	highlighter: DEFAULT_SWATCHES,
	text: DEFAULT_SWATCHES,
}

/////////////////////////////////////////
// CONTEXT
/////////////////////////////////////////
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
	// Tool and tool setting values.
	const [tool, setTool] = useState<ToolName>("pen")
	const [toolSettings, setToolSettings] = useState<ToolSettingsMap>(DEFAULT_TOOL_SETTINGS)
	// Toolbar collapsed values.
	const [collapsed, setCollapsed] = useState(false)
	// Swatch related state.
	const [swatches, setSwatches] = useState<ToolSwatches>(DEFAULT_SWATCH_MAP)
	const [swatchEditInfo, setSwatchEditInfo] = useState<{ tool: ToolName; index: number } | null>(
		null
	)
	const [colorPicker, setColorPicker] = useState<boolean>(false)
	// Active tool menu.
	const [activeMenu, setActiveMenu] = useState<ToolName | null>(null)

	useEffect(() => {
		const loadSwatches = async () => {
			const tools = ["pen", "pencil", "highlighter", "text"]
			const result: Partial<ToolSwatches> = {}

			for (const t of tools) {
				try {
					const swatchStr = await AsyncStorage.getItem(`${t}_swatches`)
					result[tool as ToolName] = swatchStr ? JSON.parse(swatchStr) : DEFAULT_SWATCHES
				} catch (e) {
					console.error(`Failed to load swatches for ${t}:`, e)
					result[tool as ToolName] = DEFAULT_SWATCHES
				}
			}

			setSwatches((prev) => ({ ...prev, ...result }))
		}
		loadSwatches()
	}, [])

	return (
		<ToolContext.Provider
			value={{
				tool,
				setTool,
				toolSettings,
				setToolSettings,
				collapsed,
				setCollapsed,
				swatches,
				setSwatches,
				swatchEditInfo,
				setSwatchEditInfo,
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
