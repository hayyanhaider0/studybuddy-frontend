import { View } from "react-native"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { useThemeContext } from "../../../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../../../styles/canvas"
import ColorPickerComponent from "./ColorPickerComponent"
import ToolMenu from "./ToolMenu"
import { MotiView } from "moti"
import { useToolContext } from "../../../contexts/ToolContext"

export default function Toolbar() {
	const { collapsed } = useToolContext()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.toolbarContainer}>
			{/* Color picker and its logic */}
			<ColorPickerComponent />

			{/* Pen toolbar panel including color and stroke selection */}
			<ToolMenu />

			{/* Fixed toolbar row at bottom */}
			<MotiView
				animate={{ borderRadius: collapsed ? 50 : 25 }}
				transition={{ type: "timing" }}
				style={styles.toolbar}
			>
				<ToolOptions />
				<CanvasOptions />
			</MotiView>
		</View>
	)
}
