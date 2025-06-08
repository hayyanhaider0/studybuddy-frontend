/**
 * ColorOptions Component
 *
 * Contains colors used by the user and an RGB option.
 */

import { TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../../contexts/ToolContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { ToolName } from "../../../types/global"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import tinycolor from "tinycolor2"

export default function ColorOptions({ tool }: { tool: ToolName }) {
	const { toolSettings, setToolSettings, swatches, setSwatchEditInfo, setColorPicker } =
		useToolContext() // Get tool context

	const activeColor = toolSettings[tool].color // Currently active color for the active tool.

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
	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.colorContainer}>
			{/* Map all the colors */}
			{swatches[tool]?.map((c, i) => (
				<TouchableOpacity
					key={i}
					// Change the color on press and close the color picker.
					onPress={() => {
						setToolSettings((prev) => ({ ...prev, [tool]: { ...prev[tool], color: c } }))
						setColorPicker(false)
					}}
					// Open up a color wheel and let user edit the swatch.
					onLongPress={() => {
						setSwatchEditInfo({ tool: tool, index: i })
						setColorPicker(true)
					}}
					activeOpacity={0.2}
				>
					{/* Color Swatch */}
					<View style={[styles.options, { backgroundColor: c }]}>
						{/* Render a check mark within the selected swatch. */}
						{i === swatches[tool].findIndex((c: string) => c === activeColor) && (
							<Icon name='check-bold' size={16} color={checkMarkColor(c)} />
						)}
					</View>
				</TouchableOpacity>
			))}
		</View>
	)
}
