/**
 * CanvasOptions Component
 *
 * UI for other options: undo, redo, clear, menu.
 * Check utils/options.ts for all options and their actions.
 */

import { Pressable } from "react-native"
import { useOptionDefinitions } from "../../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../../contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useToolContext } from "../../../contexts/ToolContext"
import { MotiView } from "moti"

export default function CanvasOptions() {
	const options = useOptionDefinitions() // Options logic
	const { collapsed } = useToolContext()

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<MotiView
			animate={{
				width: collapsed ? 48 : 84,
				height: collapsed ? 48 : 84,
				borderRadius: collapsed ? 30 : 16,
			}}
			transition={{ type: "timing" }}
			style={styles.optionContainer}
		>
			{/* Map out all options */}
			{options?.map((o, i) => {
				if (collapsed && o.name !== "collapse") return null

				return (
					<Pressable key={i} onPress={o.action}>
						<MotiView
							from={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "timing", delay: 200 }}
						>
							<Icon name={o.icon} size={30} color={theme.colors.textPrimary} />
						</MotiView>
					</Pressable>
				)
			})}
		</MotiView>
	)
}
