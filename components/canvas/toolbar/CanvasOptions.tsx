/**
 * CanvasOptions Component
 *
 * UI for other options: undo, redo, clear, menu.
 * Check utils/options.ts for all options and their actions.
 */

import { TouchableOpacity, View } from "react-native"
import { useOptionDefinitions } from "../../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useToolContext } from "../../../contexts/ToolContext"
import { MotiView } from "moti"
import { useEffect, useState } from "react"

export default function CanvasOptions() {
	const options = useOptionDefinitions() // Options logic
	const { collapsed } = useToolContext()

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const [showAll, setShowAll] = useState(collapsed)

	useEffect(() => {
		if (!collapsed) {
			const timeout = setTimeout(() => setShowAll(true), 300) // Delay in ms
			return () => clearTimeout(timeout)
		} else {
			setShowAll(false) // Reset when collapsing
		}
	}, [collapsed])

	return (
		<MotiView
			animate={{ width: collapsed ? 48 : 84, height: collapsed ? 48 : 84 }}
			transition={{ type: "timing" }}
			style={styles.optionContainer}
		>
			{/* Map out all options */}
			{options?.map((o, i) => {
				if (collapsed && o.name !== "collapse") return null
				if (!collapsed && !showAll && o.name !== "collapse") return null

				return (
					<TouchableOpacity key={i} onPress={o.action}>
						<Icon name={o.icon} size={30} color={theme.colors.textPrimary} />
					</TouchableOpacity>
				)
			})}
		</MotiView>
	)
}
