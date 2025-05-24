import { createContext, ReactNode, useContext } from "react"
import { SharedValue, useSharedValue } from "react-native-reanimated"

type PanContextType = {
	translateX: SharedValue<number>
	translateY: SharedValue<number>
	offsetX: SharedValue<number>
	offsetY: SharedValue<number>
}

export const PanContext = createContext<PanContextType | null>(null)

export function PanProvider({ children }: { children: ReactNode }) {
	const offsetX = useSharedValue(0)
	const offsetY = useSharedValue(0)
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)

	return (
		<PanContext.Provider value={{ offsetX, offsetY, translateX, translateY }}>
			{children}
		</PanContext.Provider>
	)
}

export const usePanContext = () => {
	const ctx = useContext(PanContext)
	if (!ctx) throw new Error("usePanContext must be used within a PanProvider")
	return ctx
}
