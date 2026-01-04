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
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { DrawingTool } from "../../../types/tools"
import { useDrawingSettings } from "../contexts/DrawingSettingsContext"
import { useTool } from "../contexts/ToolContext"
import { Color } from "../../../types/global"

interface ColorPickerComponentProps {
	colorPickerState: { isVisible: boolean; index: number }
}

export default function ColorPickerComponent({ colorPickerState }: ColorPickerComponentProps) {
	const { activeTool } = useTool()
	const { swatches, updateSwatch } = useDrawingSettings()

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<AnimatePresence>
			{/* Only shows when colorPicker is true, and pen menu is active */}
			{colorPickerState.isVisible && (
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
							value={swatches[activeTool as DrawingTool][colorPickerState.index] as string} // Set the picked color
							style={{ gap: 16, width: 235 }}
							onCompleteJS={(e) => {
								const newColor = e.rgba as Color
								updateSwatch(activeTool as DrawingTool, colorPickerState.index, newColor)
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
