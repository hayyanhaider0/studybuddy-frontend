import { createContext, ReactNode, useContext, useState } from "react"
import { PathType } from "../types/types"

type LayoutType = {
	x: number
	y: number
	width: number
	height: number
}

export type CanvasContextType = {
	paths: PathType[]
	setPaths: React.Dispatch<React.SetStateAction<any[]>>
	current: string
	setCurrent: React.Dispatch<React.SetStateAction<string>>
	layout: LayoutType
	setLayout: React.Dispatch<React.SetStateAction<LayoutType>>
}

export const CanvasStateContext = createContext<CanvasContextType | null>(null)

export function CanvasStateProvider({ children }: { children: ReactNode }) {
	const [paths, setPaths] = useState<PathType[]>([])
	const [current, setCurrent] = useState<string>("")
	const [layout, setLayout] = useState<LayoutType>({ x: 0, y: 0, width: 0, height: 0 })

	return (
		<CanvasStateContext.Provider
			value={{ paths, setPaths, current, setCurrent, layout, setLayout }}
		>
			{children}
		</CanvasStateContext.Provider>
	)
}

export const useCanvasContext = () => {
	const ctx = useContext(CanvasStateContext)
	if (!ctx) throw new Error("useCanvasState must be used within a CanvasStateProvider")
	return ctx
}
