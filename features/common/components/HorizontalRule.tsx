/**
 * HorizontalRule Component
 *
 * Simple horizontal rule
 */

import { View, Text, DimensionValue } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"

interface HorizontalRuleProps {
	text?: string
	width: DimensionValue
}

export default function HorizontalRule({ text, width }: HorizontalRuleProps) {
	// Theming
	const { theme } = useThemeContext()

	return (
		<View style={{ flexDirection: "row", alignItems: "center", width }}>
			<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.textSecondary }} />
			{text && <Text style={{ color: theme.colors.textSecondary }}>{text}</Text>}
			<View style={{ flex: 1, height: 1, backgroundColor: theme.colors.textSecondary }} />
		</View>
	)
}
