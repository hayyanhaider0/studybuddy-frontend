/**
 * ColorOptions Component
 *
 * Contains colors used by the user and an RGB option.
 */

import { View } from "react-native"
import { useToolContext } from "../contexts/ToolContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { BrushType } from "../../drawing/types/DrawingTypes"
import Swatch from "./Swatch"
import { Color } from "../../../types/global"

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

	return (
		<View style={styles.colorContainer}>
			{/* Map all the colors */}
			{swatches[tool]?.map((c, i) => (
				<Swatch
					key={i}
					color={c as Color}
					selected={toolSettings[tool].activeSwatchIndex === i}
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
				/>
			))}
		</View>
	)
}
