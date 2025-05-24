import { createContext, ReactNode, useContext } from "react"
import { SharedValue, useSharedValue } from "react-native-reanimated"

type ZoomContextType = {
	scale: SharedValue<number>
	savedScale: SharedValue<number>
}

export const ZoomContext = createContext<ZoomContextType | null>(null)

export function ZoomProvider({ children }: { children: ReactNode }) {
	const scale = useSharedValue(1)
	const savedScale = useSharedValue(1)

	return <ZoomContext.Provider value={{ scale, savedScale }}>{children}</ZoomContext.Provider>
}

export const useZoomContext = () => {
	const ctx = useContext(ZoomContext)
	if (!ctx) throw new Error("useZoomContext must be used within a ZoomProvider")
	return ctx
}
