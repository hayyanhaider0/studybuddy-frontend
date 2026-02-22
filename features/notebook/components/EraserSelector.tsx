import { Spline, SplinePointer } from "lucide-react-native"
import { Pressable, View } from "react-native"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useDrawingSettings, useEraserSettings } from "../contexts/DrawingSettingsContext"

export default function EraserSelector() {
	const { updateEraserSetting } = useDrawingSettings()
	const { settings } = useEraserSettings()
	const { theme } = useThemeContext()

	return (
		<View style={{ flexDirection: "row", gap: 8 }}>
			<Pressable
				onPress={() => updateEraserSetting("type", "stroke")}
				style={{
					backgroundColor:
						settings.type === "stroke" ? theme.colors.secondary : theme.colors.primary,
					padding: 8,
					aspectRatio: 1,
					borderRadius: 50,
				}}
			>
				<SplinePointer size={20} color={theme.colors.onPrimary} />
			</Pressable>
			<Pressable
				onPress={() => updateEraserSetting("type", "path")}
				style={{
					backgroundColor: settings.type === "path" ? theme.colors.secondary : theme.colors.primary,
					padding: 8,
					aspectRatio: 1,
					borderRadius: 50,
				}}
			>
				<Spline size={20} color={theme.colors.onPrimary} />
			</Pressable>
		</View>
	)
}
