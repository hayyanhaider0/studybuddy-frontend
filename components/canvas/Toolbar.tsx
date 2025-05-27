import { View } from "react-native"
import { useToolContext } from "../../contexts/ToolContext"
import ColorOptions from "./ColorOptions"
import StrokeOptions from "./StrokeOptions"
import { AnimatePresence, MotiView } from "moti"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import ColorPicker, {
	LuminanceSlider,
	OpacitySlider,
	Panel3,
	Preview,
} from "reanimated-color-picker"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getCanvasStyles } from "../../styles/canvas"

export default function Toolbar() {
	const { setStroke, pickedColor, setPickedColor, activeMenu, colorPicker } = useToolContext()
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View
			style={{
				position: "absolute",
				bottom: 8,
				zIndex: 10,
				width: "100%",
				alignItems: "center",
			}}
		>
			<AnimatePresence>
				{colorPicker && activeMenu === "pen" && (
					<GestureHandlerRootView>
						<MotiView
							from={{ opacity: 0, translateY: 120 }}
							animate={{ opacity: 1, translateY: 0 }}
							exit={{ opacity: 0, translateY: 120 }}
							transition={{ type: "timing", duration: 300 }}
							style={{
								backgroundColor: theme.colors.primary,
								padding: 32,
								borderRadius: 28,
							}}
						>
							<ColorPicker
								value={pickedColor}
								style={{
									gap: 16,
									width: 235,
								}}
								onCompleteJS={(e) => {
									setPickedColor(e.hex)
									setStroke(e.hex)
								}}
							>
								<Preview textStyle={{ textTransform: "uppercase" }} />
								<Panel3 />
								<LuminanceSlider />
								<OpacitySlider />
							</ColorPicker>
						</MotiView>
					</GestureHandlerRootView>
				)}
			</AnimatePresence>

			{/* Expanding panel ABOVE the tool row */}
			<AnimatePresence>
				{activeMenu === "pen" && (
					<MotiView
						from={{ opacity: 0, translateY: 120 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 120 }}
						transition={{ type: "timing", duration: 300 }}
						style={{
							padding: 16,
							margin: 8,
							borderRadius: 28,
							backgroundColor: theme.colors.primary,
						}}
					>
						<ColorOptions />
						<StrokeOptions />
					</MotiView>
				)}
			</AnimatePresence>

			{/* Fixed toolbar row at bottom */}
			<View style={styles.toolbar}>
				<ToolOptions />
				<CanvasOptions />
			</View>
		</View>
	)
}
