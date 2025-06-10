/**
 * CanvasScreen Component
 *
 * Main screen component that orchestrates the canvas interface.
 * Now simplified to focus on layout and coordination between components.
 */

import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { LayoutChangeEvent, Pressable, Text, TouchableOpacity, View } from "react-native"
import Toolbar from "../components/canvas/toolbar/Toolbar"
import DrawingCanvas from "../components/canvas/DrawingCanvas"
import { useTransformContext } from "../contexts/TransformContext"
import { useEffect, useState } from "react"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { AnimatePresence, MotiView } from "moti"
import { getGlobalStyles } from "../styles/global"
import { getCanvasStyles } from "../styles/canvas"
import ChapterTab from "../components/chapterTab/ChapterTab"
import { useNotebook } from "../contexts/NotebookContext"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import { useModal } from "../contexts/ModalContext"
import useNotebooks from "../hooks/useNotebooks"

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

	// State management
	const [zoomText, setZoomText] = useState<string>("100%")
	const [visible, setVisible] = useState<boolean>(false)

	// Update the text live during scaling.
	useAnimatedReaction(
		() => scale.value,
		(v) => {
			const percent = (v * 100).toFixed(0) + "%"
			runOnJS(setZoomText)(percent)
			if (percent !== "100%") runOnJS(setVisible)(true)
		},
		[]
	)

	// Auto-hide after 3 seconds
	useEffect(() => {
		if (!visible) return

		const timeout = setTimeout(() => setVisible(false), 2000)
		return () => clearTimeout(timeout)
	}, [zoomText, visible])

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
			{visible && (
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
	const { notebooks, chapter } = useNotebook()
	const { addNotebook } = useNotebooks()
	const { setShowModal, setTitle, setDescription, setPlaceholder, setButtonText, setOnPress } =
		useModal()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

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

	const handleCreateNotebook = () => {
		setTitle("Add a New Notebook")
		setDescription("Give your new notebook a name!")
		setPlaceholder("Type the name of your new notebook...")
		setButtonText("Add Notebook")
		setOnPress(() => (input: string) => addNotebook(input))
		setShowModal(true)
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.surface,
			}}
		>
			<ChapterTab />
			<ZoomIndicator />
			<Toolbar />
			{notebooks.length > 0 ? (
				<FlatList
					data={chapter?.canvases}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <DrawingCanvas key={item.id} onLayout={handleCanvasLayout} />}
				/>
			) : (
				<TouchableOpacity
					onPress={handleCreateNotebook}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						paddingBottom: 112,
						gap: 16,
					}}
				>
					<Material name='plus-circle-outline' size={64} color={theme.colors.onPrimary} />
					<Text style={GlobalStyles.paragraph}>Add a new notebook, and start studying now!</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}
