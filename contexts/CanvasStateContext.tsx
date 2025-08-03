/**
 * CanvasStateContext Component
 *
 * Provides shared state for canvas drawing, including stored paths,
 * the current drawing tool identifier, and layout dimensions.
 */

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ScaledSize, useWindowDimensions } from "react-native"
import { PathPoint, PathType } from "../components/drawing/types/DrawingTypes"

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
	[id: string]: PathType | null
}

export type CanvasContextType = {
	// Current path being drawn.
	current: CurrentPathMap
	// Setter for the current path being drawn.
	setCurrentPath: (canvasId: string, path: PathType) => void
	// Updates the current path for real time visualization.
	updateCurrentPath: (canvasId: string, point: PathPoint) => void
	// Clears the current path.
	clearCurrentPath: (canvasId: string) => void
	// Current layout rectangle of the canvas.
	layout: LayoutType
	// Setter for updating canvas dimensions.
	setLayout: React.Dispatch<React.SetStateAction<LayoutType>>
}

// React context for CanvasState, initialized to null until provided.
export const CanvasStateContext = createContext<CanvasContextType | null>(null)

/**
 * Computes canvas layout according to window width.
 *
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

	// Setter for the path currently being drawn.
	const setCurrentPath = (canvasId: string, path: PathType) => {
		setCurrent((prev) => ({ ...prev, [canvasId]: path }))
	}

	// Updates the path currently being drawn.
	const updateCurrentPath = (canvasId: string, point: PathPoint) => {
		setCurrent((prev) => {
			const existing = prev[canvasId]
			if (!existing) return prev
			return {
				...prev,
				[canvasId]: { ...existing, points: [...existing.points, point] },
			}
		})
	}

	// Clears the path currently being drawn.
	const clearCurrentPath = (canvasId: string) => {
		setCurrent((prev) => ({ ...prev, [canvasId]: null }))
	}

	useEffect(() => {
		setLayout(computeCanvasLayout(window))
	}, [window])

	return (
		<CanvasStateContext.Provider
			value={{ current, setCurrentPath, updateCurrentPath, clearCurrentPath, layout, setLayout }}
		>
			{children}
		</CanvasStateContext.Provider>
	)
}

/**
 * Custom hook for accessing pan gesture shared values.
 *
 * @throws Error if used outside of CanvasStateProvider.
 * @returns CanvasContext providing shared values.
 */
export const useCanvasContext = () => {
	const ctx = useContext(CanvasStateContext)
	if (!ctx) throw new Error("useCanvasContext must be used within a CanvasStateProvider")
	return ctx
}
