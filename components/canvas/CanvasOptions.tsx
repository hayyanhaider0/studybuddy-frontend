import { ScrollView, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/global"
import { useToolContext } from "../../contexts/ToolContext"
import { useToolDefinitions } from "../../utils/tools"
import { useOptionDefinitions } from "../../utils/options"
import { styles } from "../../styles/canvas"
import ColorOptions from "./ColorOptions"
import Slider from "@react-native-community/slider"
import StrokeOptions from "./StrokeOptions"
import { AnimatePresence, MotiView } from "moti"

export default function CanvasOptions() {
	const { tool, activeMenu } = useToolContext()
	const tools = useToolDefinitions()
	const options = useOptionDefinitions()

	return (
		<View style={{ position: "absolute", bottom: 0, zIndex: 10, width: "100%" }}>
			{/* Expanding panel ABOVE the tool row */}
			<AnimatePresence>
				{activeMenu === "pen" && (
					<MotiView
						from={{ translateY: 120 }}
						animate={{ translateY: 0 }}
						exit={{ translateY: 120 }}
						transition={{ type: "timing", duration: 200 }}
						style={{
							padding: 16,
							margin: 8,
							borderRadius: 25,
							backgroundColor: Colors.primary,
						}}
					>
						<ColorOptions />
						<StrokeOptions />
					</MotiView>
				)}
			</AnimatePresence>

			{/* Fixed toolbar row at bottom */}
			<View
				style={{
					flexDirection: "row",
					backgroundColor: Colors.primary,
					justifyContent: "space-evenly",
					padding: 16,
				}}
			>
				{tools.map((t, i) => {
					const isSelected = tool === t.name
					return (
						<TouchableOpacity key={i} onPress={t.action}>
							<Icon
								name={t.icon}
								size={30}
								color={isSelected ? Colors.accent : Colors.buttonText}
							/>
						</TouchableOpacity>
					)
				})}
				{options.map((o, i) => (
					<TouchableOpacity key={i} onPress={o.action}>
						<Icon name={o.icon} size={30} color={Colors.buttonText} />
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}
