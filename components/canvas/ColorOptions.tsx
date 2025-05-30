/**
 * ColorOptions Component
 *
 * Contains colors used by the user and an RGB option.
 */

import { Image, TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../contexts/ToolContext"
import { getCanvasStyles } from "../../styles/canvas"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function ColorOptions() {
	const { setStroke, colorPicker, setColorPicker } = useToolContext() // Get tool context

	// Theming
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
		<View style={styles.colorContainer}>
			{/* Map all the colors */}
			{colors.map((item, i) => (
				<TouchableOpacity key={i} onPress={() => setStroke(item)} activeOpacity={0.5}>
					<View style={[styles.options, { backgroundColor: item }]} />
				</TouchableOpacity>
			))}

			{/* RGB option using a color picker */}
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
