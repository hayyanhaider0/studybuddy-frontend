/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 * Now simplified to focus on layout and coordination between components.
 */

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native"
import Toolbar from "../components/canvas/Toolbar"
import DrawingCanvas from "../components/canvas/DrawingCanvas"
import { useTransformContext } from "../contexts/TransformContext"
import { useState } from "react"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { AnimatePresence, MotiView } from "moti"
import { getGlobalStyles } from "../styles/global"
import { getCanvasStyles } from "../styles/canvas"

/**
 * ZoomIndicator Component
 *
 * Shows the current scale value in percentage. Allows for long pressing
 * which resets the canvas scale and translations to the default.
 */
function ZoomIndicator() {
	// Contexts imports
	const { scale, translateX, translateY } = useTransformContext()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getCanvasStyles(theme.colors)

	// Actual text
	const [zoomText, setZoomText] = useState<string>("100%")

	// Update the text live during scaling.
	useAnimatedReaction(
		() => scale.value,
		(v) => {
			runOnJS(setZoomText)((v * 100).toFixed(0) + "%")
		},
		[]
	)

	/**
	 * resetTransformations Function
	 *
	 * Resets all canvas transformations -- scale and translates.
	 */
	const resetTransformations = () => {
		scale.value = 1
		translateX.value = 0
		translateY.value = 0
	}

	return (
		<AnimatePresence>
			{zoomText !== "100%" && (
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					style={styles.zoomIndicator}
				>
					<Pressable onPress={() => resetTransformations()}>
						<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>{zoomText}</Text>
					</Pressable>
				</MotiView>
			)}
		</AnimatePresence>
	)
}

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
			<ZoomIndicator />
			{/* Toolbar Component */}
			<Toolbar />

			{/* Drawing Canvas Component */}
			<DrawingCanvas onLayout={handleCanvasLayout} />
		</GestureHandlerRootView>
	)
}
