import { View } from "react-native"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getCanvasStyles } from "../../styles/canvas"
import ColorPickerComponent from "./ColorPickerComponent"
import ToolMenu from "./ToolMenu"

export default function Toolbar() {
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.toolbarContainer}>
			{/* Color picker and its logic */}
			<ColorPickerComponent />

			{/* Pen toolbar panel including color and stroke selection */}
			<ToolMenu />

			{/* Fixed toolbar row at bottom */}
			<View style={styles.toolbar}>
				<ToolOptions />
				<CanvasOptions />
			</View>
		</View>
	)
}
