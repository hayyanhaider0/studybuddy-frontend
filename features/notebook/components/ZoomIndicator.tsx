/**
 * ZoomIndicator Component
 *
 * Shows the current scale value in percentage. Allows for long pressing
 * which resets the canvas scale and translations to the default.
 */
import { Text, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { AnimatePresence, MotiView } from "moti"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useTransformContext } from "../contexts/TransformContext"

export default function ZoomIndicator() {
	// Get values from context.
	const { scale, translateX, translateY } = useTransformContext()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

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
