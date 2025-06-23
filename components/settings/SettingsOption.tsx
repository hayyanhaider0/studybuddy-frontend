import { Switch, View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { SettingsOptionsType } from "../../types/global"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function SettingsOption({ option }: { option: SettingsOptionsType }) {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	return (
		<>
			{/* Subcategory name and description */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<MaterialC name='menu-right' size={20} color={theme.colors.textPrimary} />
					<Text style={[GlobalStyles.paragraph, { fontWeight: "bold", textAlign: "left" }]}>
						{option.name}
					</Text>
				</View>
				{option.switch !== undefined && (
					<Switch value={option.switch} onValueChange={option.onPress} style={{ height: 0 }} />
				)}
			</View>
			{option.description && (
				<Text
					style={[
						GlobalStyles.paragraph,
						{
							color: theme.colors.textSecondary,
							textAlign: "left",
							paddingLeft: 20,
							paddingRight: 48,
						},
					]}
				>
					{option.description}
				</Text>
			)}
		</>
	)
}
