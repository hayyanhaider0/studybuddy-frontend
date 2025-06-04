/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 * Now simplified to focus on layout and coordination between components.
 */

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { LayoutChangeEvent } from "react-native"
import Toolbar from "../components/canvas/Toolbar"
import DrawingCanvas from "../components/canvas/DrawingCanvas"

export default function CanvasScreen() {
	// Context Imports
	const { setLayout } = useCanvasContext()
	const { theme } = useThemeContext()

	/**
	 * handleCanvasLayout Function
	 *
	 * Sets the layout values to the canvas's actual values.
	 *
	 * @param e - Layout change event.
	 */
	const handleCanvasLayout = (e: LayoutChangeEvent) => {
		const { x, y, width, height } = e.nativeEvent.layout
		// Update layout
		setLayout({ x, y, width, height })
	}

	return (
		<GestureHandlerRootView
			style={{
				flex: 1,
				backgroundColor: theme.colors.surface,
			}}
		>
			{/* Toolbar Component */}
			<Toolbar />

			{/* Drawing Canvas Component */}
			<DrawingCanvas onLayout={handleCanvasLayout} />
		</GestureHandlerRootView>
	)
}
