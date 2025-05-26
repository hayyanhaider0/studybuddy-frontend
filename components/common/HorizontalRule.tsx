import { View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function HorizontalRule({ children }: any) {
	const { theme } = useThemeContext()

	return (
		<View style={{ alignItems: "center", marginVertical: 16 }}>
			<View style={{ backgroundColor: "#ccc", height: 1, width: "100%" }} />
			{children && (
				<View
					style={{
						position: "absolute",
						top: -10,
						backgroundColor: theme.colors.background,
						paddingHorizontal: 8,
					}}
				>
					<Text style={{ color: "#666" }}>{children}</Text>
				</View>
			)}
		</View>
	)
}
