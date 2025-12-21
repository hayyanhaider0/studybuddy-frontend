import { FlatList, Pressable, View, Text } from "react-native"
import DrawingCanvas from "./DrawingCanvas"
import { useRef } from "react"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { getChapter } from "../../../utils/notebook"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { useTransformContext } from "../contexts/TransformContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import useNotebookActions from "../hooks/useNotebookActions"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { getCanvasStyles } from "../../../styles/canvas"

export default function CanvasList() {
	// Get context values.
	const flatListRef = useRef<FlatList>(null)
	const { layout } = useCanvasContext()
	const { handleCreateCanvas } = useNotebookActions()
	const { notebookState, dispatch } = useNotebookContext()
	const { scale, translateX, translateY } = useTransformContext()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	// Get the currently selected chapter.
	const chapter = getChapter(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId
	)

	if (!chapter) return

	// Animated style for transform.
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}))

	return (
		<Animated.View
			style={[animatedStyle, { height: layout.height + 16, width: layout.width + 16 }]}
		>
			{/* Canvas UI allowing for drawing gestures */}
			<FlatList
				// Core config
				ref={flatListRef}
				data={chapter?.canvases}
				keyExtractor={(item) => item.id}
				horizontal
				renderItem={({ item }) => (
					<View style={{ padding: 8, backgroundColor: theme.colors.surface }}>
						<DrawingCanvas canvasId={item.id} />
					</View>
				)}
				// Scrolling behaviour
				getItemLayout={(_, index) => ({
					length: layout.width + 16,
					offset: (layout.width + 16) * index,
					index,
				})}
				scrollEventThrottle={16}
				decelerationRate='fast'
				snapToInterval={layout.width + 16}
				showsHorizontalScrollIndicator={false}
				viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
				onViewableItemsChanged={({ viewableItems }) => {
					if (viewableItems.length === 0) return
					dispatch({ type: "SELECT_CANVAS", payload: viewableItems[0].item.id })
				}}
				// Add canvas button (the dim canvas in the list)
				ListFooterComponent={() => (
					<View style={{ padding: 8 }}>
						<DrawingCanvas canvasId='' />
						<Pressable
							onPress={() => handleCreateCanvas(chapter.canvases.length)}
							style={[styles.addCanvasButton, { height: layout.height, width: layout.width }]}
						>
							<MaterialC name='plus-circle-outline' size={64} color={theme.colors.textSecondary} />
							<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
								Tap to add a canvas
							</Text>
						</Pressable>
					</View>
				)}
			/>
		</Animated.View>
	)
}
