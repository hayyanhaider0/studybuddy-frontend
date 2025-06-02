/**
 * ColorOptions Component
 *
 * Contains colors used by the user and an RGB option.
 */

import { Image, TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../contexts/ToolContext"
import { getCanvasStyles } from "../../styles/canvas"
import { useThemeContext } from "../../contexts/ThemeContext"
import { ToolName } from "../../types/global"

export default function ColorOptions({ tool }: { tool: ToolName }) {
	const { setToolSettings, colorPicker, setColorPicker } = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const toolSwatches: Record<ToolName, string[]> = {
		pen: [
			// Red
			"#dc2626",
			// Orange
			"#fb923c",
			// Yellow
			"#facc15",
			// Blue
			"#3b82f6",
			// Green
			"#10b981",
			// Black
			"#000000",
		],
		pencil: [
			// Red
			"#dc2626",
			// Blue
			"#3b82f6",
			// Orange
			"#fb923c",
			// Yellow
			"#facc15",
			// Green
			"#10b981",
			// Black
			"#000000",
		],
		highlighter: [
			// Blue
			"#3b82f6",
			// Red
			"#dc2626",
			// Orange
			"#fb923c",
			// Yellow
			"#facc15",
			// Green
			"#10b981",
			// Black
			"#000000",
		],
		eraser: [],
		text: [],
	}

	const swatches = toolSwatches[tool]

	return (
		swatches.length > 0 && (
			<View style={styles.colorContainer}>
				{/* Map all the colors */}
				{swatches.map((item, i) => (
					<TouchableOpacity
						key={i}
						onPress={() => {
							setToolSettings((prev) => ({ ...prev, [tool]: { ...prev[tool], color: item } }))
							setColorPicker(false)
						}}
						onLongPress={() => setColorPicker(true)}
						activeOpacity={0.5}
					>
						<View style={[styles.options, { backgroundColor: item }]} />
					</TouchableOpacity>
				))}
			</View>
		)
	)
}
