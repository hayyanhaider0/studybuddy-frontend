/**
 * HorizontalRule Component
 * 
 * Simple horizontal rule
 */

import { View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function HorizontalRule({ children }: any) {
    // Theming
	const { theme } = useThemeContext()

	return (
		<View style={{ alignItems: "center", marginVertical: 16 }}>
			<View style={{ backgroundColor: theme.colors.placeholder, height: 1, width: "100%" }} />
			{children && (
				<View
					style={{
						position: "absolute",
						top: -10,
						backgroundColor: theme.colors.background,
						paddingHorizontal: 8,
					}}
				>
					<Text style={{ color: theme.colors.placeholder }}>{children}</Text>
				</View>
			)}
		</View>
	)
}
