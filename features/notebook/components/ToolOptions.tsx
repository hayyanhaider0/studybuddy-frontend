/**
 * ToolOptions Component
 *
 * Contains UI for the tool options on the toolbar
 * Check out utils/tools.ts for all available tools
 */

import { TouchableOpacity, View } from "react-native"
import { useToolDefinitions } from "../../../utils/tools"
import { AnimatePresence } from "moti"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useTool } from "../contexts/ToolContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function ToolOptions() {
	// Get context values.
	const { activeTool } = useTool()
	const tools = useToolDefinitions()

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		// Collapsable tool options view
		<View style={styles.toolOptions}>
			<AnimatePresence>
				{/* Map all available tools */}
				{tools.map((t, i) => {
					const isSelected = activeTool === t.name
					return (
						<TouchableOpacity key={i} onPress={t.action}>
							{/* Animated image of the tool */}
							<View
								style={{
									backgroundColor: isSelected ? theme.colors.secondary : theme.colors.primary,
									padding: 8,
									borderColor: theme.colors.secondary,
									borderWidth: 1,
									borderRadius: 50,
									aspectRatio: 1,
								}}
							>
								<MaterialC name={t.icon} size={24} color={theme.colors.onPrimary} />
							</View>
						</TouchableOpacity>
					)
				})}
			</AnimatePresence>
		</View>
	)
}
