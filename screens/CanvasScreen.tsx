import Svg, { Path } from "react-native-svg"
import { View } from "react-native"
import CanvasOptions from "../components/canvas/CanvasOptions"
import { GlobalStyles } from "../styles/global"
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useCanvasGestures } from "../hooks/useCanvasGestures"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useZoomContext } from "../contexts/ZoomContext"
import Background1 from "../components/canvas/Background1"
import { usePanContext } from "../contexts/PanContext"

export default function CanvasScreen() {
	const { paths, current } = useCanvasContext()
	const { stroke, strokeWidth } = useToolContext()
	const { scale } = useZoomContext()
	const { translateX, translateY } = usePanContext()

	const gesture = useCanvasGestures()

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ scale: scale.value },
			{ translateX: translateX.value },
			{ translateY: translateY.value },
		],
	}))

	return (
		<>
			<CanvasOptions />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<GestureDetector gesture={gesture}>
					<Animated.View style={[GlobalStyles.container, animatedStyle]}>
						<View style={{ flex: 1 }}>
							<Background1 />
						</View>
						<Svg style={{ flex: 1, zIndex: 10 }}>
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
