import { TouchableOpacity } from "react-native"
import { useToolDefinitions } from "../../utils/tools"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useToolContext } from "../../contexts/ToolContext"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function ToolOptions() {
	const { tool } = useToolContext()
	const tools = useToolDefinitions()
	const { theme } = useThemeContext()

	return (
		<>
			{tools.map((t, i) => {
				const isSelected = tool === t.name
				return (
					<TouchableOpacity key={i} onPress={t.action}>
						<Icon
							name={t.icon}
							size={30}
							color={isSelected ? theme.colors.accent : theme.colors.buttonText}
						/>
					</TouchableOpacity>
				)
			})}
		</>
	)
}
