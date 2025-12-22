/**
 * CanvasOptions Component
 *
 * UI for other options: undo, redo, clear, menu.
 * Check utils/options.ts for all options and their actions.
 */

import { Pressable, View } from "react-native"
import { useOptionDefinitions } from "../../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { MotiView } from "moti"

export default function CanvasOptions() {
	const options = useOptionDefinitions() // Options logic

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.optionContainer}>
			{/* Map out all options */}
			{options.map((o, i) => {
				return (
					<Pressable key={i} onPress={o.action} disabled={o.disabled}>
						<MotiView
							from={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "timing", delay: 200 }}
						>
							<Icon
								name={o.icon}
								size={32}
								color={o.disabled ? theme.colors.textSecondary : theme.colors.textPrimary}
							/>
						</MotiView>
					</Pressable>
				)
			})}
		</View>
	)
}
