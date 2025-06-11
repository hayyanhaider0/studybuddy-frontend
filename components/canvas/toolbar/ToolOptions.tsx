/**
 * ToolOptions Component
 *
 * Contains UI for the tool options on the toolbar
 * Check out utils/tools.ts for all available tools
 */

import { Image, TouchableOpacity } from "react-native"
import { useToolDefinitions } from "../../../utils/tools"
import { useToolContext } from "../../../contexts/ToolContext"
import { AnimatePresence, MotiImage, MotiView } from "moti"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"

export default function ToolOptions() {
	const { tool, collapsed } = useToolContext() // Get tool context
	const tools = useToolDefinitions() // Get all available tool options

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const selectedTool = tools.find((t) => t.name === tool) // Track the currently selected tool

	return (
		// Collapsable tool options view
		<MotiView
			animate={{ width: collapsed ? 32 : 184, height: collapsed ? 72 : 110 }}
			transition={{ type: "spring", damping: 20, stiffness: 150, mass: 1 }}
			style={styles.toolOptions}
		>
			<AnimatePresence>
				{collapsed ? (
					// Show only the selected tool when the toolbar is collapsed.
					<TouchableOpacity
						onPress={selectedTool?.action}
						style={{ width: 24, height: 96, overflow: "hidden" }}
					>
						<Image
							source={selectedTool?.image}
							style={{ width: 24, height: 96, transform: [{ translateY: 0 }] }}
						/>
					</TouchableOpacity>
				) : (
					// When not collapsed, show all available tools.
					<>
						{/* Map all available tools */}
						{tools.map((t, i) => {
							const isSelected = tool === t.name
							return (
								<TouchableOpacity key={i} onPress={t.action}>
									{/* Animated image of the tool */}
									<MotiImage
										// Animate up when selected, down when not selected
										from={{ height: 96 }}
										animate={{ translateY: isSelected ? 0 : 24 }}
										transition={{ type: "timing", duration: 200 }}
										source={t.image}
										style={{ width: 24 }}
									/>
								</TouchableOpacity>
							)
						})}
					</>
				)}
			</AnimatePresence>
		</MotiView>
	)
}
