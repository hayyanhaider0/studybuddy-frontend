/**
 * PanContext Component
 *
 * Provides shared values for pan gestures, including current translations
 * and accumulated offsets.
 */

import { createContext, ReactNode, useContext } from "react"
import { SharedValue, useSharedValue } from "react-native-reanimated"

type PanContextType = {
	// Current translation along the x axis during an active gesture.
	translateX: SharedValue<number>
	// Current translation along the y axis during an active gesture.
	translateY: SharedValue<number>
	// Accumulated x offset from previous gesture(s).
	offsetX: SharedValue<number>
	// Accumulated y offset from previous gesture(s).
	offsetY: SharedValue<number>
}

// React context for providing pan gesture shared values.
export const PanContext = createContext<PanContextType | null>(null)

/**
 * PanProvider Component
 *
 * Initializes pan gesture shared values and provides them via context.
 *
 * @param children - Components that require access to pan gesture values.
 * @returns JSX element wrapping children with PanContext provider.
 */
export function PanProvider({ children }: { children: ReactNode }) {
	// Current gesture translations during an active gesture.
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)

	// Accumulated offsets from previous gesture interactions.
	const offsetX = useSharedValue(0)
	const offsetY = useSharedValue(0)

	return (
		<PanContext.Provider value={{ offsetX, offsetY, translateX, translateY }}>
			{children}
		</PanContext.Provider>
	)
}

/**
 * usePanContext hook
 *
 * Custom hook for accessing pan gesture shared values.
 * Must be used within a PanProvider.
 *
 * @throws Error if used outside of PanProvider.
 * @returns PanContext providing shared values.
 */
export const usePanContext = () => {
	const ctx = useContext(PanContext)
	if (!ctx) throw new Error("usePanContext must be used within a PanProvider")
	return ctx
}
