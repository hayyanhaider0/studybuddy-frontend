import { TouchableOpacity, View } from "react-native"
import { useOptionDefinitions } from "../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function CanvasOptions() {
	const options = useOptionDefinitions()
	const { theme } = useThemeContext()

	return (
		<View style={{ width: 80, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
			{options.map((o, i) => (
				<TouchableOpacity key={i} onPress={o.action}>
					<Icon name={o.icon} size={30} color={theme.colors.buttonText} />
				</TouchableOpacity>
			))}
		</View>
	)
}
