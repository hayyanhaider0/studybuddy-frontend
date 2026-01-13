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
import { useDrawingSettings } from "../contexts/DrawingSettingsContext"
import { isDrawingTool } from "../../../types/tools"

export default function ToolOptions({
	isExpanded,
	setIsExpanded,
}: {
	isExpanded: boolean
	setIsExpanded: (expanded: boolean) => void
}) {
	// Get context values.
	const { activeTool } = useTool()
	const { settings } = useDrawingSettings()
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
					let iconColor = theme.colors.onPrimary

					if (isDrawingTool(t.name)) {
						iconColor = settings[t.name].color as string
					}

					const Icon = t.icon

					return (
						<TouchableOpacity
							key={i}
							onPress={isSelected ? () => setIsExpanded(!isExpanded) : t.action}
						>
							{/* Animated image of the tool */}
							<View
								style={{
									backgroundColor: isSelected ? theme.colors.secondary : theme.colors.primary,
									padding: 8,
									borderRadius: 50,
									aspectRatio: 1,
								}}
							>
								<Icon size={20} color={iconColor} />
							</View>
						</TouchableOpacity>
					)
				})}
			</AnimatePresence>
		</View>
	)
}
