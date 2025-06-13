import {
	FlatList,
	LayoutChangeEvent,
	NativeScrollEvent,
	NativeSyntheticEvent,
	useWindowDimensions,
	View,
	ViewStyle,
} from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import DrawingCanvas from "./DrawingCanvas"
import { useRef } from "react"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { useTransformContext } from "../../contexts/TransformContext"
import { useCanvasTranslateGestures } from "../../hooks/useCanvasTranslateGestures"
import { useCanvasContext } from "../../contexts/CanvasStateContext"

export default function CanvasList() {
	const flatListRef = useRef<FlatList>(null)
	const { width: screenWidth } = useWindowDimensions()
	const { setLayout } = useCanvasContext()
	const { chapter, setActiveCanvasId } = useNotebookContext()
	const { scale, translateX, translateY } = useTransformContext()
	const translateGestures = useCanvasTranslateGestures()

	const CANVAS_WIDTH = 360
	const GAP = 4

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

	// Animated style for transform.
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}))

	// Animated container style.
	const containerStyle: ViewStyle = { flex: 1, alignItems: "center", justifyContent: "center" }

	/**
	 * Sets the active canvas to the one currently centered on the screen.
	 *
	 * @param e - The native scroll event from the FlatList.
	 */
	const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!chapter) return // Exit if there's no active chapter.

		// Find the current horizontal scroll offset.
		const scrollX = e.nativeEvent.contentOffset.x
		// Calculate the horizontal center of the screen.
		const screenCenter = scrollX + screenWidth / 2

		// Subtract padding offset -- due to centering first/last canvas.
		const offset = (screenWidth - CANVAS_WIDTH) / 2
		const targetCenter = screenCenter - offset

		// Determine the nearest canvas index based on step size.
		const step = CANVAS_WIDTH + GAP
		const closestIndex = Math.round(targetCenter / step)

		// Clamp index within bnounds.
		const clampedIndex = Math.max(0, Math.min(closestIndex, chapter.canvases.length - 1))

		// Set the active canvas.
		setActiveCanvasId(chapter.canvases[clampedIndex].id)
	}

	return (
		<GestureDetector gesture={translateGestures}>
			{/* Canvas UI allowing for drawing gestures */}
			<Animated.View style={[containerStyle, animatedStyle]}>
				<FlatList
					// Core config
					ref={flatListRef}
					data={chapter?.canvases}
					keyExtractor={(item) => item.id}
					horizontal
					renderItem={({ item }) => (
						<View
							style={{
								width: CANVAS_WIDTH,
								marginRight: GAP,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<DrawingCanvas canvasId={item.id} onLayout={handleCanvasLayout} />
						</View>
					)}
					// Scrolling behaviour
					onScroll={onScroll}
					scrollEventThrottle={16}
					decelerationRate='fast'
					snapToInterval={CANVAS_WIDTH + GAP}
					showsHorizontalScrollIndicator={false}
					// Styling
					contentContainerStyle={{
						paddingHorizontal: (screenWidth - CANVAS_WIDTH) / 2, // centers first and last canvas
					}}
				/>
			</Animated.View>
		</GestureDetector>
	)
}
