/**
 * ToolOptions Component
 *
 * Contains UI for the tool options on the toolbar
 * Check out utils/tools.ts for all available tools
 */

import { TouchableOpacity, View } from "react-native"
import { useToolDefinitions } from "../../utils/tools"
import { useToolContext } from "../../contexts/ToolContext"
import { MotiImage } from "moti"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getCanvasStyles } from "../../styles/canvas"

export default function ToolOptions() {
	const { tool } = useToolContext() // Get tool context
	const tools = useToolDefinitions() // Get all available tool options

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.toolOptions}>
			{/* Map all available tools */}
			{tools.map((t, i) => {
				const isSelected = tool === t.name // Track the currently selected tool
				return (
					<TouchableOpacity key={i} onPress={t.action}>
						{/* Animated image of the tool */}
						<MotiImage
							// Animate up when selected, down when not selected
							from={{ translateY: -48, height: 96 }}
							animate={{ translateY: isSelected ? 0 : 24 }}
							transition={{ type: "timing", duration: 200 }}
							source={t.image}
							style={{ width: 24 }}
						/>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}
