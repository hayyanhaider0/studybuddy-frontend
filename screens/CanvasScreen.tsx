/**
 * CanvasScreen Component
 *
 * Includes Canvas, Toolbar and other related components.
 * Check out Toolbar.tsx for information on the toolbar.
 */

import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import { useCanvasGestures } from "../hooks/useCanvasGestures"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import Background1 from "../components/canvas/Background1"
import Toolbar from "../components/canvas/Toolbar"
import { useThemeContext } from "../contexts/ThemeContext"
import { Canvas, Path } from "@shopify/react-native-skia"
import { PathType } from "../types/global"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useTransformContext } from "../contexts/TransformContext"
import { LayoutChangeEvent } from "react-native"

export default function CanvasScreen() {
	// Context Imports
	const { paths, current, layout, setLayout } = useCanvasContext()
	const { tool, toolSettings } = useToolContext()
	const { translateX, translateY, scale } = useTransformContext()
	const { theme } = useThemeContext()

	// Gesture
	const gesture = useCanvasGestures()

	// Animated style for transform
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}))

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
		<>
			{/* Backdrop behind the canvas */}
			<GestureHandlerRootView
				style={{
					flex: 1,
					backgroundColor: theme.colors.surface,
				}}
			>
				{/* Toolbar Component */}
				<Toolbar />
				<GestureDetector gesture={gesture}>
					{/* Actual canvas is contained within this animated view */}
					<Animated.View
						style={[{ flex: 1, alignItems: "center", justifyContent: "center" }, animatedStyle]}
					>
						<Canvas style={{ height: 640, width: 360 }} onLayout={handleCanvasLayout}>
							<Background1
								width={layout.width}
								height={layout.height}
								backgroundColor={theme.colors.background}
							/>
							{paths.map((p: PathType, i: number) => (
								<Path
									key={i}
									path={p.path}
									color={p.color}
									style='stroke'
									strokeWidth={p.size}
									strokeCap={p.strokeLinecap}
									strokeJoin='round'
								/>
							))}
							<Path
								path={current}
								color={toolSettings[tool].color}
								style='stroke'
								strokeWidth={toolSettings[tool].size}
								strokeCap={toolSettings[tool].strokeLinecap}
								strokeJoin='round'
							/>
						</Canvas>
					</Animated.View>
				</GestureDetector>
			</GestureHandlerRootView>
		</>
	)
}
