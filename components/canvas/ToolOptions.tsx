import { TouchableOpacity, View } from "react-native"
import { useToolDefinitions } from "../../utils/tools"
import { useToolContext } from "../../contexts/ToolContext"
import { MotiImage } from "moti"

export default function ToolOptions() {
	const { tool } = useToolContext()
	const tools = useToolDefinitions()

	return (
		<View style={{ flexDirection: "row", gap: 16, paddingTop: 16, overflow: "hidden" }}>
			{tools.map((t, i) => {
				const isSelected = tool === t.name
				return (
					<TouchableOpacity key={i} onPress={t.action}>
						<MotiImage
							from={{ translateY: -48, height: 96 }}
							animate={{ translateY: isSelected ? 0 : 24 }}
							transition={{ type: "timing", duration: 200 }}
							source={t.image}
							style={{ width: 24 }}
						/>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}
