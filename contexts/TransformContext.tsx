/**
 * PanContext Component
 *
 * Provides shared values for pan gestures, including current translations
 * and accumulated offsets.
 */

import { createContext, ReactNode, useContext } from "react"
import { SharedValue, useSharedValue } from "react-native-reanimated"

type TransformContextType = {
	// Current translation along the x axis during an active gesture.
	translateX: SharedValue<number>
	// Current translation along the y axis during an active gesture.
	translateY: SharedValue<number>
	// Accumulated x offset from previous gesture(s).
	offsetX: SharedValue<number>
	// Accumulated y offset from previous gesture(s).
	offsetY: SharedValue<number>
	// Current scale of the canvas -- zoom value.
	scale: SharedValue<number>
	// Saved previous scale or zoom value.
	savedScale: SharedValue<number>
}

// React context for providing gesture shared values.
export const TransformContext = createContext<TransformContextType | null>(null)

/**
 * TransformProvider Component
 *
 * Initializes pan gesture shared values and provides them via context.
 *
 * @param children - Components that require access to pan gesture values.
 * @returns JSX element wrapping children with PanContext provider.
 */
export function TransformProvider({ children }: { children: ReactNode }) {
	// Current gesture translations during an active gesture.
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)

	// Accumulated offsets from previous gesture interactions.
	const offsetX = useSharedValue(0)
	const offsetY = useSharedValue(0)

	// Scale/zoom values.
	const scale = useSharedValue(1)
	const savedScale = useSharedValue(1)

	return (
		<TransformContext.Provider
			value={{ offsetX, offsetY, translateX, translateY, scale, savedScale }}
		>
			{children}
		</TransformContext.Provider>
	)
}

/**
 * useTransformContext hook
 *
 * Custom hook for accessing pan gesture shared values.
 * Must be used within a TransformProvider.
 *
 * @throws Error if used outside of TransformProvider.
 * @returns PanContext providing shared values.
 */
export const useTransformContext = () => {
	const ctx = useContext(TransformContext)
	if (!ctx) throw new Error("useTransformContext must be used within a TransformProvider")
	return ctx
}
