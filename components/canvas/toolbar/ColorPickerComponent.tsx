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
import { useToolContext } from "../../../contexts/ToolContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { saveItemToStorage } from "../../../utils/storage"

export default function ColorPickerComponent() {
	const { tool, toolSettings, setSwatches, swatchEditInfo, colorPicker, activeMenu } =
		useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<AnimatePresence>
			{/* Only shows when colorPicker is true, and pen menu is active */}
			{colorPicker && activeMenu !== null && (
				<GestureHandlerRootView>
					<MotiView
						// Animate up behind the toolbar
						from={{ opacity: 0, translateY: 120 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 120 }}
						transition={{ type: "timing", duration: 300 }}
						style={styles.colorPickerContainer}
					>
						{/* Actual ColorPicker Component */}
						<ColorPicker
							value={toolSettings[tool].color} // Set the picked color
							style={{ gap: 16, width: 235 }}
							onCompleteJS={(e) => {
								if (swatchEditInfo) {
									// Get the tool and swatch index.
									const { tool, index } = swatchEditInfo
									// Set the swatches for the tool upon new color selection.
									setSwatches((prev) => {
										const updated = [...prev[tool]]
										updated[index] = e.hex
										const newSwatches = { ...prev, [tool]: updated }
										// Save the swatches to local storage.
										saveItemToStorage(tool, JSON.stringify(newSwatches))
										return newSwatches
									})
								}
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
