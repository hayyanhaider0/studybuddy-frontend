import { TouchableOpacity, View } from "react-native"
import { useOptionDefinitions } from "../../utils/options"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/global"

export default function CanvasOptions() {
	const options = useOptionDefinitions()

	return (
		<View style={{ width: 80, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
			{options.map((o, i) => (
				<TouchableOpacity key={i} onPress={o.action}>
					<Icon name={o.icon} size={30} color={Colors.buttonText} />
				</TouchableOpacity>
			))}
		</View>
	)
}
