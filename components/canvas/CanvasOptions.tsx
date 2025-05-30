/**
 * CanvasOptions Component
 *
 * UI for other options: undo, redo, clear, menu.
 * Check utils/options.ts for all options and their actions.
 */

import { TouchableOpacity, View } from "react-native"
import { useOptionDefinitions } from "../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getCanvasStyles } from "../../styles/canvas"

export default function CanvasOptions() {
	const options = useOptionDefinitions() // Options logic

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.optionContainer}>
			{/* Map out all options */}
			{options.map((o, i) => (
				<TouchableOpacity key={i} onPress={o.action}>
					<Icon name={o.icon} size={30} color={theme.colors.onPrimary} />
				</TouchableOpacity>
			))}
		</View>
	)
}
