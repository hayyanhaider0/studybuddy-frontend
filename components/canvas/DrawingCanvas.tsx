/**
 * DrawingCanvas Component
 *
 * Handles the actual drawing canvas with paths and transforms.
 * Separated from CanvasScreen to reduce complexity.
 */

import {
	Blend,
	BlendMode,
	Canvas,
	Group,
	ImageShader,
	Paint,
	Path,
	Shader,
	useImage,
	useImageAsTexture,
} from "@shopify/react-native-skia"
import { PathType } from "../../types/global"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { LayoutChangeEvent, View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import Background1 from "./Background1"
import { useCanvasContext } from "../../contexts/CanvasStateContext"
import { useToolContext } from "../../contexts/ToolContext"
import { useTransformContext } from "../../contexts/TransformContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { useCanvasGestures } from "../../hooks/useCanvasGestures"

interface DrawingCanvasProps {
	onLayout: (e: LayoutChangeEvent) => void
}

export default function DrawingCanvas({ onLayout }: DrawingCanvasProps) {
	// Context Imports.
	const { paths, current, layout } = useCanvasContext()
	const { tool, toolSettings } = useToolContext()
	const { translateX, translateY, scale } = useTransformContext()
	const { theme } = useThemeContext()

	// Gesture.
	const { translateGestures, drawingGestures } = useCanvasGestures()

	// Animated style for transform.
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}))

	return (
		<GestureDetector gesture={translateGestures}>
			{/* This View allows for gestures outside the canvas like pan and pinch */}
			<View style={{ flex: 1 }}>
				<GestureDetector gesture={drawingGestures}>
					{/* Canvas UI allowing for drawing gestures */}
					<Animated.View
						style={[{ flex: 1, alignItems: "center", justifyContent: "center" }, animatedStyle]}
					>
						<Canvas style={{ height: 640, width: 360 }} onLayout={onLayout}>
							<Background1
								width={layout.width}
								height={layout.height}
								backgroundColor={theme.colors.background}
							/>
							{/* Render completed paths */}
							{paths.map((p: PathType, i: number) => (
								<Path
									path={p.path}
									color={p.color}
									style='stroke'
									strokeWidth={p.size}
									strokeCap={p.strokeLinecap}
									strokeJoin='round'
								/>
							))}
							{/* Render current path being drawn */}
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
			</View>
		</GestureDetector>
	)
}
