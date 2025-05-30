/**
 * CanvasScreen Component
 *
 * Includes Canvas, Toolbar and other related components.
 * Check out Toolbar.tsx for information on the toolbar.
 */

import Svg, { Path } from "react-native-svg"
import { View } from "react-native"
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useCanvasGestures } from "../hooks/useCanvasGestures"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useZoomContext } from "../contexts/ZoomContext"
import Background1 from "../components/canvas/Background1"
import { usePanContext } from "../contexts/PanContext"
import Toolbar from "../components/canvas/Toolbar"
import { useThemeContext } from "../contexts/ThemeContext"

export default function CanvasScreen() {
	// Context Imports
	const { paths, current, setLayout } = useCanvasContext()
	const { stroke, strokeWidth } = useToolContext()
	const { scale } = useZoomContext()
	const { translateX, translateY } = usePanContext()
	const { theme, GlobalStyles } = useThemeContext()

	// Gesture
	const gesture = useCanvasGestures()

	// Canvas transformation
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ translateX: translateX.value },
			{ translateY: translateY.value },
		],
	}))

	return (
		<>
			{/* Toolbar Component */}
			<Toolbar />

			{/* Canvas Component */}
			{/* Backdrop behind the canvas */}
			<GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
				<GestureDetector gesture={gesture}>
					{/* Actual canvas is contained within this animated view */}
					<Animated.View style={[GlobalStyles.container, animatedStyle]}>
						{/* Background of the canvas */}
						<View style={{ flex: 1 }}>
							<Background1 />
						</View>

						{/* Drawable component */}
						<Svg style={{ flex: 1, zIndex: 10 }} onLayout={(e) => setLayout(e.nativeEvent.layout)}>
							{paths.map((p, i) => (
								<Path
									key={i}
									d={p.d}
									stroke={p.color}
									strokeWidth={p.sw}
									fill='none'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							))}
							{current && (
								<Path
									d={current}
									stroke={stroke}
									strokeWidth={strokeWidth}
									fill='none'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							)}
						</Svg>
					</Animated.View>
				</GestureDetector>
			</GestureHandlerRootView>
		</>
	)
}
