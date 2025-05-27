import { TouchableOpacity, View } from "react-native"
import { useOptionDefinitions } from "../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function CanvasOptions() {
	const options = useOptionDefinitions()
	const { theme } = useThemeContext()

	return (
		<View
			style={{
				width: 84,
				flexDirection: "row",
				flexWrap: "wrap",
				gap: 8,
				backgroundColor: theme.colors.tertiary,
				padding: 8,
				borderRadius: 16,
			}}
		>
			{options.map((o, i) => (
				<TouchableOpacity key={i} onPress={o.action}>
					<Icon name={o.icon} size={30} color={theme.colors.onPrimary} />
				</TouchableOpacity>
			))}
		</View>
	)
}
