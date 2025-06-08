/**
 * ToolOptions Component
 *
 * Contains UI for the tool options on the toolbar
 * Check out utils/tools.ts for all available tools
 */

import { Image, TouchableOpacity, View } from "react-native"
import { useToolDefinitions } from "../../../utils/tools"
import { useToolContext } from "../../../contexts/ToolContext"
import { MotiImage, MotiView } from "moti"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useState } from "react"
import { useCanvasActions } from "../../../hooks/useCanvasActions"

export default function ToolOptions() {
	const { tool, collapsed, setCollapsed } = useToolContext() // Get tool context
	const tools = useToolDefinitions() // Get all available tool options

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const selectedTool = tools.find((t) => t.name === tool) // Track the currently selected tool

	return (
		<MotiView
			animate={{ width: collapsed ? 36 : 184 }}
			transition={{ type: "spring", damping: 20, stiffness: 150, mass: 1 }}
			style={styles.toolOptions}
		>
			{collapsed ? (
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
		</MotiView>
	)

	if (collapsed) {
		return (
			<TouchableOpacity
				onPress={() => setCollapsed(false)}
				style={{ width: 24, height: 96, overflow: "hidden" }}
			>
				<Image
					source={selectedTool?.image}
					style={{ width: 24, height: 96, transform: [{ translateY: 12 }] }}
				/>
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.toolOptions}>
			{/* Map all available tools */}
			{tools.map((t, i) => {
				const isSelected = tool === t.name
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
