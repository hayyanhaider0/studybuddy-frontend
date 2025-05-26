import { TouchableOpacity, Text } from "react-native"
import { getGlobalStyles } from "../../styles/global"
import { useThemeContext } from "../../contexts/ThemeContext"

type ctoProps = {
	text: string
	onPress: () => void
}

export default function CustomTouchableOpacity({ text, onPress }: ctoProps) {
	const { GlobalStyles } = useThemeContext()

	return (
		<TouchableOpacity style={GlobalStyles.button} onPress={onPress}>
			<Text style={GlobalStyles.buttonText}>{text}</Text>
		</TouchableOpacity>
	)
}
