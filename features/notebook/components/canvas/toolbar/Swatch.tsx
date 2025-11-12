import { TouchableOpacity, View } from "react-native"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { Color } from "../../../../../types/global"
import { useThemeContext } from "../../../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../../../styles/canvas"
import tinycolor, { ColorInput } from "tinycolor2"

interface SwatchProps {
	color: Color
	selected?: boolean
	onPress: () => void
}

export default function Swatch({ color, selected = false, onPress }: SwatchProps) {
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	// Sets the color for the check mark on top of the swatch depending on the color.
	const checkMarkColor = tinycolor(color as ColorInput).isDark() ? "#fff" : "#000"

	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.2}>
			<View style={[styles.options, { backgroundColor: color as string }]}>
				{selected && <MaterialC name='check-bold' size={16} color={checkMarkColor} />}
			</View>
		</TouchableOpacity>
	)
}
