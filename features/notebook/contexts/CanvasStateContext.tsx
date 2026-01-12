import { createContext, ReactNode, useContext, useEffect, useState, useRef } from "react"
import { ScaledSize, useWindowDimensions } from "react-native"
import { PathPoint } from "../../drawing/types/DrawingTypes"
import { SharedValue, makeMutable } from "react-native-reanimated"
import { CanvasRef, useCanvasRef } from "@shopify/react-native-skia"

// Types
type LayoutType = {
	x: number
	y: number
	width: number
	height: number
}

type CurrentPathPointsMap = {
	[id: string]: SharedValue<PathPoint[]>
}

export type CanvasContextType = {
	// Reference to the canvas object.
	canvasRef: React.RefObject<CanvasRef | null>
	// Current layout rectangle of the canvas.
	layout: LayoutType
	// Setter for updating canvas dimensions.
	setLayout: React.Dispatch<React.SetStateAction<LayoutType>>
	// Get or create SharedValue for a canvas
	getCurrentPathPoints: (canvasId: string) => SharedValue<PathPoint[]>
}

export const CanvasStateContext = createContext<CanvasContextType | null>(null)

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

export function CanvasStateProvider({ children }: { children: ReactNode }) {
	const canvasRef = useCanvasRef()
	const window = useWindowDimensions()
	const [layout, setLayout] = useState<LayoutType>(() => computeCanvasLayout(window))

	// Use useRef to store SharedValues (they're not React state)
	const currentPathPointsRef = useRef<CurrentPathPointsMap>({})

	// Get or create SharedValue for a canvas
	const getCurrentPathPoints = (canvasId: string): SharedValue<PathPoint[]> => {
		if (!currentPathPointsRef.current[canvasId]) {
			// Create SharedValue without using useSharedValue hook
			currentPathPointsRef.current[canvasId] = makeMutable<PathPoint[]>([])
		}
		return currentPathPointsRef.current[canvasId]
	}

	useEffect(() => {
		setLayout(computeCanvasLayout(window))
	}, [window])

	return (
		<CanvasStateContext.Provider
			value={{
				canvasRef,
				layout,
				setLayout,
				getCurrentPathPoints,
			}}
		>
			{children}
		</CanvasStateContext.Provider>
	)
}

export const useCanvasContext = () => {
	const ctx = useContext(CanvasStateContext)
	if (!ctx) throw new Error("useCanvasContext must be used within a CanvasStateProvider")
	return ctx
}
