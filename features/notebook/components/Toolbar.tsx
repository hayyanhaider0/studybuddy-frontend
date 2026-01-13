import { ScrollView, useWindowDimensions, View } from "react-native"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../styles/canvas"
import ToolSettingsSelector from "./ToolSettingsSelector"
import { useTool } from "../contexts/ToolContext"
import { canDraw, isDrawingTool } from "../../../types/tools"
import { useEffect, useState } from "react"
import ColorPickerComponent from "./ColorPickerComponent"
import { SafeAreaView } from "react-native-safe-area-context"
import ToolbarExpanded from "./ToolbarExpanded"

export default function Toolbar() {
	const [isExpanded, setIsExpanded] = useState(false)
	const { width } = useWindowDimensions()
	const [colorPickerState, setColorPickerState] = useState({ isVisible: false, index: -1 })
	const { activeTool } = useTool()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	const isLargeScreen = width > 360

	useEffect(() => {
		if (!isExpanded) setColorPickerState({ isVisible: false, index: -1 })
	}, [isExpanded])

	return (
		<View style={styles.toolbarContainer}>
			{!isLargeScreen && (isDrawingTool(activeTool) || canDraw(activeTool)) && isExpanded && (
				<ToolbarExpanded
					colorPickerState={colorPickerState}
					setColorPickerState={setColorPickerState}
				/>
			)}
			<SafeAreaView edges={["bottom"]}>
				<ColorPickerComponent colorPickerState={colorPickerState} />
				{/* Fixed toolbar row at bottom */}
				<ScrollView
					contentContainerStyle={styles.toolbar}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<ToolOptions isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
					{isLargeScreen && (
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
