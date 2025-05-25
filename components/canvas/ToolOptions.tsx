import { TouchableOpacity } from "react-native"
import { useToolDefinitions } from "../../utils/tools"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/global"
import { useToolContext } from "../../contexts/ToolContext"

export default function ToolOptions() {
	const { tool } = useToolContext()
	const tools = useToolDefinitions()

	return (
		<>
			{tools.map((t, i) => {
				const isSelected = tool === t.name
				return (
					<TouchableOpacity key={i} onPress={t.action}>
						<Icon name={t.icon} size={30} color={isSelected ? Colors.accent : Colors.buttonText} />
					</TouchableOpacity>
				)
			})}
		</>
	)
}
