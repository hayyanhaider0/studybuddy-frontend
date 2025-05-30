/**
 * ZoomContext Component
 *
 * Provides the shared state for zoom values.
 */

import { createContext, ReactNode, useContext } from "react"
import { SharedValue, useSharedValue } from "react-native-reanimated"

type ZoomContextType = {
	// Current scale of the canvas -- zoom value.
	scale: SharedValue<number>
	// Saved previous scale or zoom value.
	savedScale: SharedValue<number>
}

// React context for zoom state.
export const ZoomContext = createContext<ZoomContextType | null>(null)

/**
 * ZoomProvider Component
 *
 * Wraps children components, providing zoom state values via context.
 *
 * @param children - React nodes that consume canvas state.
 */
export function ZoomProvider({ children }: { children: ReactNode }) {
	// Scale/zoom values.
	const scale = useSharedValue(1)
	const savedScale = useSharedValue(1)

	return <ZoomContext.Provider value={{ scale, savedScale }}>{children}</ZoomContext.Provider>
}

/**
 * useZoomContext hook
 *
 * Custom hook to access zoom state values.
 *
 * @throws Error if used outside a ZoomProvider.
 * @returns ZoomContext containing scale/zoom values.
 */
export const useZoomContext = () => {
	const ctx = useContext(ZoomContext)
	if (!ctx) throw new Error("useZoomContext must be used within a ZoomProvider")
	return ctx
}
