import { createContext, ReactNode, useContext, useState } from "react"
import { PathType } from "../navigation/types"

export type CanvasContextType = {
	paths: PathType[]
	setPaths: React.Dispatch<React.SetStateAction<any[]>>
	current: string
	setCurrent: React.Dispatch<React.SetStateAction<string>>
}

export const CanvasStateContext = createContext<CanvasContextType | null>(null)

export function CanvasStateProvider({ children }: { children: ReactNode }) {
	const [paths, setPaths] = useState<PathType[]>([])
	const [current, setCurrent] = useState<string>("")

	return (
		<CanvasStateContext.Provider value={{ paths, setPaths, current, setCurrent }}>
			{children}
		</CanvasStateContext.Provider>
	)
}

export const useCanvasContext = () => {
	const ctx = useContext(CanvasStateContext)
	if (!ctx) throw new Error("useCanvasState must be used within a CanvasStateProvider")
	return ctx
}
