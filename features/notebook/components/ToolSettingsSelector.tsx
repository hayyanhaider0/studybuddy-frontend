import { TouchableOpacity, View } from "react-native"
import { useDrawingSettings } from "../contexts/DrawingSettingsContext"
import { useTool } from "../contexts/ToolContext"
import {
	canDraw,
	DrawingTool,
	isDrawingTool,
	isEraserTool,
	SizePresetIndex,
} from "../../../types/tools"
import Swatch from "./Swatch"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import EraserSelector from "./EraserSelector"

export default function ToolSettingsSelector({
	colorPickerState,
	setColorPickerState,
}: {
	colorPickerState: { isVisible: boolean; index: number }
	setColorPickerState: (state: { isVisible: boolean; index: number }) => void
}) {
	const { activeTool } = useTool()
	const { settings, swatches, updateDrawingToolSetting } = useDrawingSettings()
	const { theme } = useThemeContext()

	return (
		<View
			style={{
				flexGrow: 1,
				flexDirection: "row",
				gap: 16,
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			{isEraserTool(activeTool) && <EraserSelector />}
			{isDrawingTool(activeTool) && (
				<View style={{ flexDirection: "row", gap: 8 }}>
					{swatches[activeTool as DrawingTool].map((c, i) => (
						<Swatch
							key={i}
							color={c}
							onPress={() => {
								if (colorPickerState.isVisible) setColorPickerState({ isVisible: false, index: -1 })
								updateDrawingToolSetting(activeTool as DrawingTool, "color", c)
							}}
							onLongPress={() => setColorPickerState({ isVisible: true, index: i })}
							selected={settings[activeTool as DrawingTool].color === c}
							width={24}
						/>
					))}
				</View>
			)}
			{canDraw(activeTool) && (
				<View style={{ flexDirection: "row", gap: 8 }}>
					{Array.from({ length: 6 }).map((_, i) => (
						<TouchableOpacity
							key={i}
							onPress={() =>
								updateDrawingToolSetting(
									activeTool as DrawingTool,
									"activeSizePreset",
									i as SizePresetIndex
								)
							}
							style={{
								width: 24,
								borderWidth: 1,
								borderRadius: 50,
								borderColor:
									settings[activeTool as DrawingTool].activeSizePreset === i
										? "#FFF"
										: theme.colors.secondary,
								aspectRatio: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<View
								style={{
									padding: i + 4,
									borderRadius: 50,
									backgroundColor:
										settings[activeTool as DrawingTool].activeSizePreset === i
											? "#FFF"
											: theme.colors.secondary,
								}}
							/>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	)
}
