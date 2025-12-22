import { ScrollView, View } from "react-native"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import ToolSettingsSelector from "./ToolSettingsSelector"
import { useTool } from "../contexts/ToolContext"
import { canDraw, isDrawingTool } from "../../../types/tools"

export default function Toolbar() {
	const { activeTool } = useTool()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.toolbarContainer}>
			{/* Fixed toolbar row at bottom */}
			<ScrollView
				contentContainerStyle={styles.toolbar}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				<ToolOptions />
				{(isDrawingTool(activeTool) || canDraw(activeTool)) && <ToolSettingsSelector />}
				<CanvasOptions />
			</ScrollView>
		</View>
	)
}
