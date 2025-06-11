import {
	FlatList,
	LayoutChangeEvent,
	NativeScrollEvent,
	NativeSyntheticEvent,
	useWindowDimensions,
	View,
} from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import DrawingCanvas from "./DrawingCanvas"
import { useRef } from "react"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useNotebook } from "../../contexts/NotebookContext"
import { useTransformContext } from "../../contexts/TransformContext"
import { useCanvasTranslateGestures } from "../../hooks/useCanvasTranslateGestures"
import { useCanvasContext } from "../../contexts/CanvasStateContext"

export default function CanvasList() {
	const { setLayout } = useCanvasContext()
	const { chapter, setActiveCanvasId } = useNotebook()
	const { scale, translateX, translateY } = useTransformContext()
	const translateGestures = useCanvasTranslateGestures()

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

	const CANVAS_WIDTH = 360
	const GAP = 4
	const { width: screenWidth } = useWindowDimensions()

	const flatListRef = useRef<FlatList>(null)

	const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!chapter) return

		const scrollX = e.nativeEvent.contentOffset.x
		const screenCenter = scrollX + screenWidth / 2
		const offset = (screenWidth - CANVAS_WIDTH) / 2

		const targetCenter = screenCenter - offset
		const step = CANVAS_WIDTH + GAP

		const closestIndex = Math.round(targetCenter / step)
		const clampedIndex = Math.max(0, Math.min(closestIndex, chapter.canvases.length - 1))

		setActiveCanvasId(chapter.canvases[clampedIndex].id)
	}

	return (
		<GestureDetector gesture={translateGestures}>
			{/* Canvas UI allowing for drawing gestures */}
			<Animated.View
				style={[{ flex: 1, alignItems: "center", justifyContent: "center" }, animatedStyle]}
			>
				<FlatList
					ref={flatListRef}
					data={chapter?.canvases}
					horizontal
					decelerationRate='fast'
					snapToInterval={CANVAS_WIDTH + GAP}
					contentContainerStyle={{
						paddingHorizontal: (screenWidth - CANVAS_WIDTH) / 2, // centers first and last canvas
					}}
					keyExtractor={(item) => item.id}
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
					showsHorizontalScrollIndicator={false}
					onScroll={onScroll}
					scrollEventThrottle={16}
				/>
			</Animated.View>
		</GestureDetector>
	)
}
