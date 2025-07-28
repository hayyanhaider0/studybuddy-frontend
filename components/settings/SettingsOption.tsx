import { Switch, View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { SettingsOptionsType } from "../../types/global"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function SettingsOption({ option }: { option: SettingsOptionsType }) {
	const { theme, GlobalStyles } = useThemeContext()

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					minHeight: 48,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						flex: 1,
						paddingRight: 8,
					}}
				>
					<MaterialC name='menu-right' size={20} color={theme.colors.textPrimary} />
					<Text
						style={[
							GlobalStyles.paragraph,
							{
								fontWeight: "bold",
								textAlign: "left",
								flexShrink: 1,
								flexWrap: "wrap",
								marginLeft: 4,
							},
						]}
						numberOfLines={2}
						ellipsizeMode='tail'
					>
						{option.name}
					</Text>
				</View>

				{option.switch !== undefined && (
					<View
						style={{
							height: 48,
							justifyContent: "center",
						}}
					>
						<Switch value={option.switch} onValueChange={option.onPress} />
					</View>
				)}
			</View>

			{option.description && (
				<Text
					style={[
						GlobalStyles.paragraph,
						{
							color: theme.colors.textSecondary,
							textAlign: "left",
							paddingLeft: 24,
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
