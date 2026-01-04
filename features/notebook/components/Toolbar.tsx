import { ScrollView, View } from "react-native"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import ToolSettingsSelector from "./ToolSettingsSelector"
import { useTool } from "../contexts/ToolContext"
import { canDraw, isDrawingTool } from "../../../types/tools"
import { useState } from "react"
import ColorPickerComponent from "./ColorPickerComponent"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Toolbar() {
	const [colorPickerState, setColorPickerState] = useState({ isVisible: false, index: -1 })
	const { activeTool } = useTool()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.toolbarContainer}>
			<SafeAreaView edges={["bottom"]}>
				<ColorPickerComponent colorPickerState={colorPickerState} />
				{/* Fixed toolbar row at bottom */}
				<ScrollView
					contentContainerStyle={styles.toolbar}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<ToolOptions />
					{(isDrawingTool(activeTool) || canDraw(activeTool)) && (
						<ToolSettingsSelector
							colorPickerState={colorPickerState}
							setColorPickerState={setColorPickerState}
						/>
					)}
					<CanvasOptions />
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}
