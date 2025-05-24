import { createContext, ReactNode, useContext, useState } from "react"
import { ToolName } from "../navigation/types"

type ToolContextType = {
	tool: ToolName
	setTool: React.Dispatch<React.SetStateAction<ToolName>>
	stroke: string
	setStroke: React.Dispatch<React.SetStateAction<string>>
	strokeWidth: number
	setStrokeWidth: React.Dispatch<React.SetStateAction<number>>
	activeMenu: ToolName | null
	setActiveMenu: React.Dispatch<React.SetStateAction<ToolName | null>>
}

export const ToolContext = createContext<ToolContextType | null>(null)

export function ToolProvider({ children }: { children: ReactNode }) {
	const [tool, setTool] = useState<ToolName>("pen")
	const [stroke, setStroke] = useState<string>("black")
	const [strokeWidth, setStrokeWidth] = useState<number>(4)
	const [activeMenu, setActiveMenu] = useState<ToolName | null>(null)

	return (
		<ToolContext.Provider
			value={{
				tool,
				setTool,
				stroke,
				setStroke,
				strokeWidth,
				setStrokeWidth,
				activeMenu,
				setActiveMenu,
			}}
		>
			{children}
		</ToolContext.Provider>
	)
}

export const useToolContext = () => {
	const ctx = useContext(ToolContext)
	if (!ctx) throw new Error("useToolState must be used within a ToolProvider")
	return ctx
}
