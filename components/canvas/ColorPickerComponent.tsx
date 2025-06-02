/**
 * ColorPickerComponent Component
 *
 * Contains UI and logic for the color picker.
 */

import { AnimatePresence, MotiView } from "moti"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import ColorPicker, {
	LuminanceSlider,
	OpacitySlider,
	Panel3,
	Preview,
} from "reanimated-color-picker"
import { useToolContext } from "../../contexts/ToolContext"
import { getCanvasStyles } from "../../styles/canvas"
import { useThemeContext } from "../../contexts/ThemeContext"
import Handle from "../common/Handle"
import { useCanvasGestures } from "../../hooks/useCanvasGestures"

export default function ColorPickerComponent() {
	const {
		tool,
		setToolSettings,
		colorPicker,
		setColorPicker,
		pickedColor,
		setPickedColor,
		activeMenu,
	} = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<AnimatePresence>
			{/* Only shows when colorPicker is true, and pen menu is active */}
			{colorPicker && activeMenu === "pen" && (
				<GestureHandlerRootView>
					<MotiView
						// Animate up behind the toolbar
						from={{ opacity: 0, translateY: 120 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 120 }}
						transition={{ type: "timing", duration: 300 }}
						style={styles.colorPickerContainer}
					>
						<Handle close={() => setColorPicker(false)} />
						{/* Actual ColorPicker Component */}
						<ColorPicker
							value={pickedColor} // Set the picked color
							style={{ gap: 16, width: 235 }}
							onCompleteJS={(e) => {
								setPickedColor(e.hex)
								setToolSettings((prev) => ({
									...prev,
									[tool]: {
										...prev[tool],
										color: e.hex,
									},
								}))
							}}
						>
							{/* Hex value of the color */}
							<Preview textStyle={{ textTransform: "uppercase" }} />
							{/* Circular RGB panel */}
							<Panel3 />
							<LuminanceSlider />
							<OpacitySlider />
						</ColorPicker>
					</MotiView>
				</GestureHandlerRootView>
			)}
		</AnimatePresence>
	)
}
