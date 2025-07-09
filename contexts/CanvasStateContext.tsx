/**
 * CanvasStateContext Component
 *
 * Provides shared state for canvas drawing, including stored paths,
 * the current drawing tool identifier, and layout dimensions.
 */

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { SkPath } from "@shopify/react-native-skia"
import { ScaledSize, useWindowDimensions } from "react-native"

// Types
type LayoutType = {
	// X-coordinate of the canvas origin.
	x: number
	// Y-coordinate of the canvas origin.
	y: number
	// Width of the canvas area.
	width: number
	// Height of the canvas area.
	height: number
}

type CurrentPathMap = {
	[id: string]: SkPath
}

export type CanvasContextType = {
	// Current path being drawn.
	current: CurrentPathMap
	// Setter for the current path being drawn.
	setCurrent: React.Dispatch<React.SetStateAction<CurrentPathMap>>
	// Current layout rectangle of the canvas.
	layout: LayoutType
	// Setter for updating canvas dimensions.
	setLayout: React.Dispatch<React.SetStateAction<LayoutType>>
}

// React context for CanvasState, initialized to null until provided.
export const CanvasStateContext = createContext<CanvasContextType | null>(null)

/**
 * Computes canvas layout according to window width.
 * @param window - Size of the window.
 * @returns A layout object.
 */
function computeCanvasLayout(window: ScaledSize): LayoutType {
	const aspectRatio = 16 / 9

	const width = window.width
	const height = width * aspectRatio

	return {
		x: 0,
		y: 0,
		width,
		height,
	}
}

/**
 * CanvasStateProvider Component
 *
 * Wraps children components, providing canvas state values via context.
 *
 * @param children - Components that require access to canvas state values.
 */
export function CanvasStateProvider({ children }: { children: ReactNode }) {
	const window = useWindowDimensions()
	// Path currently being drawn.
	const [current, setCurrent] = useState<CurrentPathMap>({})
	// Canvas coordinates and layout dimensions.
	const [layout, setLayout] = useState<LayoutType>(() => computeCanvasLayout(window))

	useEffect(() => {
		setLayout(computeCanvasLayout(window))
	}, [window])

	return (
		<CanvasStateContext.Provider value={{ current, setCurrent, layout, setLayout }}>
			{children}
		</CanvasStateContext.Provider>
	)
}

/**
 * useCanvasContext hook
 *
 * Custom hook for accessing pan gesture shared values.
 * Must be used within a CanvasStateProvider.
 *
 * @throws Error if used outside of CanvasStateProvider.
 * @returns CanvasContext providing shared values.
 */
export const useCanvasContext = () => {
	const ctx = useContext(CanvasStateContext)
	if (!ctx) throw new Error("useCanvasContext must be used within a CanvasStateProvider")
	return ctx
}
