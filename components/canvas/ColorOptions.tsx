import { Image, TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../contexts/ToolContext"
import { getCanvasStyles } from "../../styles/canvas"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function ColorOptions() {
	const { setStroke, colorPicker, setColorPicker } = useToolContext()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const colors = [
		// Red
		"#dc2626",
		// Orange
		"#fb923c",
		// Yellow
		"#facc15",
		// Blue
		"#3b82f6",
		// Green
		"#10b981",
	]

	return (
		<View
			style={{
				width: 232,
				flexDirection: "row",
				flexWrap: "wrap",
				gap: 8,
			}}
		>
			{colors.map((item, i) => (
				<TouchableOpacity key={i} onPress={() => setStroke(item)} activeOpacity={0.5}>
					<View style={[styles.options, { backgroundColor: item }]} />
				</TouchableOpacity>
			))}
			<TouchableOpacity onPress={() => setColorPicker(!colorPicker)} activeOpacity={0.5}>
				<Image
					source={require("../../assets/canvasImages/rgb_circle.png")}
					style={styles.options}
					resizeMode='contain'
				/>
			</TouchableOpacity>
		</View>
	)
}
