import { ScrollView } from "react-native"
import { isDrawingTool, canDraw } from "../../../types/tools"
import ToolSettingsSelector from "./ToolSettingsSelector"
import { useTool } from "../contexts/ToolContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../common/contexts/ThemeContext"

export default function ToolbarExpanded({
	colorPickerState,
	setColorPickerState,
}: {
	colorPickerState: { isVisible: boolean; index: number }
	setColorPickerState: (state: { isVisible: boolean; index: number }) => void
}) {
	const { activeTool } = useTool()

	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.toolbar}
		>
			{(isDrawingTool(activeTool) || canDraw(activeTool)) && (
				<ToolSettingsSelector
					colorPickerState={colorPickerState}
					setColorPickerState={setColorPickerState}
				/>
			)}
		</ScrollView>
	)
}
