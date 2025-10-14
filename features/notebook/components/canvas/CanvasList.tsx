import {
	Dimensions,
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
	View,
	ViewStyle,
} from "react-native"
import DrawingCanvas from "./DrawingCanvas"
import { useRef } from "react"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { useTransformContext } from "../../contexts/TransformContext"
import { useCanvasContext } from "../../contexts/CanvasStateContext"
import { getChapter } from "../../../../utils/notebook"

export default function CanvasList() {
	// Get context values.
	const flatListRef = useRef<FlatList>(null)
	const { layout } = useCanvasContext()
	const { notebookState, dispatch } = useNotebookContext()
	const { scale, translateX, translateY } = useTransformContext()
	const screen = Dimensions.get("screen")

	// Get the currently selected chapter.
	const chapter = getChapter(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId
	)

	// DEFAULT VALUES.
	const GAP = 4

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
	const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!chapter) return // Exit if there's no active chapter.

		// Find the current horizontal scroll offset.
		const scrollX = e.nativeEvent.contentOffset.x
		// Calculate the horizontal center of the screen.
		const screenCenter = scrollX + screen.width / 2

		// Subtract padding offset -- due to centering first/last canvas.
		const offset = (screen.width - layout.width) / 2
		const targetCenter = screenCenter - offset

		// Determine the nearest canvas index based on step size.
		const step = layout.width + GAP
		const closestIndex = Math.round(targetCenter / step)

		// Clamp index within bnounds.
		const clampedIndex = Math.max(0, Math.min(closestIndex, chapter.canvases.length - 1))

		// Set the active canvas.
		dispatch({ type: "SELECT_CANVAS", payload: chapter.canvases[clampedIndex].id })
	}

	return (
		<Animated.View style={[containerStyle, animatedStyle, { minHeight: layout.height }]}>
			{/* Canvas UI allowing for drawing gestures */}
			<FlatList
				// Core config
				ref={flatListRef}
				data={chapter?.canvases}
				keyExtractor={(item) => item.id}
				horizontal
				renderItem={({ item, index }) => (
					<View
						style={{
							width: layout.width,
							alignItems: "center",
							justifyContent: "center",
							marginRight:
								chapter?.canvases.length && index !== chapter?.canvases.length - 1 ? GAP : 0,
						}}
					>
						<DrawingCanvas canvasId={item.id} />
					</View>
				)}
				// Scrolling behaviour
				onMomentumScrollEnd={onMomentumScrollEnd}
				scrollEventThrottle={16}
				decelerationRate='fast'
				snapToInterval={layout.width + GAP}
				showsHorizontalScrollIndicator={false}
				// Styling
				contentContainerStyle={{
					paddingHorizontal: (screen.width - layout.width) / 2, // centers first and last canvas
				}}
			/>
		</Animated.View>
	)
}
