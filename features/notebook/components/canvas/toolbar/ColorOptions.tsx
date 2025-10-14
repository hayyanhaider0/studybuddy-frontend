/**
 * ColorOptions Component
 *
 * Contains colors used by the user and an RGB option.
 */

import { TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../../contexts/ToolContext"
import { getCanvasStyles } from "../../../../../styles/canvas"
import { useThemeContext } from "../../../../common/contexts/ThemeContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import tinycolor from "tinycolor2"
import { BrushType } from "../../../../drawing/types/DrawingTypes"

export default function ColorOptions({ tool }: { tool: BrushType }) {
	const {
		toolSettings,
		setToolSettings,
		swatches,
		setSwatchEditInfo,
		colorPicker,
		setColorPicker,
	} = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	/**
	 * checkMarkColor Function
	 *
	 * Helper function to get the color of the check mark on the selected swatch.
	 *
	 * @param color - Color of the background
	 * @returns White if background color is dark, black if light.
	 */
	const checkMarkColor = (color: string) => {
		return tinycolor(color).isDark() ? "#fff" : "#000"
	}

	return (
		<View style={styles.colorContainer}>
			{/* Map all the colors */}
			{swatches[tool]?.map((c, i) => (
				<TouchableOpacity
					key={i}
					// Change the color on press and close the color picker.
					onPress={() => {
						// Track the currently selected swatch.
						const isSelected = toolSettings[tool].activeSwatchIndex === i

						// If swatch is selected, toggle the color picker.
						if (isSelected) {
							setSwatchEditInfo({ tool, index: i })
							setColorPicker(!colorPicker)
							// If swatch is not selected, set the new swatch, and close the color picker.
						} else {
							setToolSettings((prev) => ({
								...prev,
								[tool]: {
									...prev[tool],
									color: c,
									activeSwatchIndex: i,
								},
							}))
							setColorPicker(false)
						}
					}}
					activeOpacity={0.2}
				>
					{/* Color Swatch */}
					<View style={[styles.options, { backgroundColor: c }]}>
						{/* Render a check mark within the selected swatch. */}
						{i === toolSettings[tool].activeSwatchIndex && (
							<Icon name='check-bold' size={16} color={checkMarkColor(c)} />
						)}
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}
