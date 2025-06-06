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
import { ToolName, ToolSwatches } from "../../types/global"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ColorPickerComponent() {
	const {
		tool,
		toolSettings,
		setSwatches,
		swatchEditInfo,
		colorPicker,
		setColorPicker,
		activeMenu,
	} = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const saveSwatchesToStorage = async (t: ToolName, swatches: ToolSwatches) => {
		try {
			await AsyncStorage.setItem(`${t}_swatches`, JSON.stringify(swatches))
		} catch (e) {
			console.error("Failed to save swatches:", e)
		}
	}
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
						<Handle close={() => setColorPicker(false)} />
						{/* Actual ColorPicker Component */}
						<ColorPicker
							value={toolSettings[tool].color} // Set the picked color
							style={{ gap: 16, width: 235 }}
							onCompleteJS={(e) => {
								if (swatchEditInfo) {
									const { tool, index } = swatchEditInfo
									setSwatches((prev) => {
										const updated = [...prev[tool]]
										updated[index] = e.hex
										const newSwatches = { ...prev, [tool]: updated }
										saveSwatchesToStorage(tool, newSwatches)
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
