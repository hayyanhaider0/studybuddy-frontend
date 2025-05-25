import { View } from "react-native"
import { Colors } from "../../styles/global"
import { useToolContext } from "../../contexts/ToolContext"
import ColorOptions from "./ColorOptions"
import StrokeOptions from "./StrokeOptions"
import { AnimatePresence, MotiView } from "moti"
import ToolOptions from "./ToolOptions"
import CanvasOptions from "./CanvasOptions"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ColorPicker } from "react-native-color-picker"
import Slider from "@react-native-community/slider"

export default function Toolbar() {
	const { setStroke, pickedColor, setPickedColor, activeMenu, colorPicker } = useToolContext()

	return (
		<View
			style={{ position: "absolute", bottom: 8, zIndex: 10, width: "100%", alignItems: "center" }}
		>
			{/* Expanding panel ABOVE the tool row */}
			<AnimatePresence>
				{activeMenu === "pen" && (
					<MotiView
						from={{ translateY: 80 }}
						animate={{ translateY: 0 }}
						exit={{ translateY: 80 }}
						transition={{ type: "timing", duration: 300 }}
						style={{
							padding: 16,
							margin: 8,
							borderRadius: 25,
							backgroundColor: Colors.primary,
						}}
					>
						<ColorOptions />
						<StrokeOptions />
					</MotiView>
				)}
			</AnimatePresence>

			{/* Fixed toolbar row at bottom */}
			<View
				style={{
					flexDirection: "row",
					backgroundColor: Colors.primary,
					padding: 16,
					gap: 16,
					borderRadius: 25,
					alignItems: "center",
				}}
			>
				<ToolOptions />
				<CanvasOptions />
			</View>
		</View>
	)
}
