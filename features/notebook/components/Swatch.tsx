import { TouchableOpacity, View } from "react-native"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { Color } from "../../../types/global"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import tinycolor, { ColorInput } from "tinycolor2"

interface SwatchProps {
	color: Color
	selected?: boolean
	onPress: () => void
	width?: number
	isDefault?: boolean
}

export default function Swatch({
	color,
	selected = false,
	onPress,
	width = 24,
	isDefault = false,
}: SwatchProps) {
	const { theme } = useThemeContext()

	// Sets the color for the check mark on top of the swatch depending on the color.
	const checkMarkColor = tinycolor(color as ColorInput).isDark() ? "#FFFFFF" : "#000000"

	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.2}>
			<View
				style={{
					backgroundColor: color as string,
					borderWidth: 1,
					borderColor: theme.colors.secondary,
					width,
					borderRadius: 50,
					aspectRatio: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{isDefault && (
					<MaterialC
						name='null'
						size={width / 2}
						color={checkMarkColor + "20"}
						style={{ position: "absolute" }}
					/>
				)}
				{selected && <MaterialC name='check-bold' size={width / 2} color={checkMarkColor} />}
			</View>
		</TouchableOpacity>
	)
}
