/**
 * CustomTouchableOpacity Component
 *
 * Simple button that has a title (text) and an action on press.
 */

import { TouchableOpacity, Text } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"

// Props for the component.
type ctoProps = {
	text: string // Title of the button.
	onPress: () => void // Action of the button.
}

export default function CustomTouchableOpacity({ text, onPress }: ctoProps) {
	// Theming
	const { GlobalStyles } = useThemeContext()

	return (
		<TouchableOpacity style={GlobalStyles.button} onPress={onPress}>
			<Text style={GlobalStyles.buttonText}>{text}</Text>
		</TouchableOpacity>
	)
}
