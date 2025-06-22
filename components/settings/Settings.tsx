import React from "react"
import { View, Pressable, Switch, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { getSettingsStyles } from "../../styles/settings"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { SettingsType } from "../../types/global"

export default function Settings({ settings }: { settings: SettingsType }) {
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getSettingsStyles(theme.colors)

	return (
		<>
			{settings.map((s, i) => (
				<View key={i} style={{ gap: 8 }}>
					{/* Heading, shows the category of settings */}
					<View style={{ flexDirection: "row", gap: 8, padding: 8 }}>
						<Text
							style={[
								GlobalStyles.paragraph,
								{ color: theme.colors.textSecondary, textAlign: "left" },
							]}
						>
							{s.name}
						</Text>
					</View>
					<View style={styles.category}>
						{s.options.map((opt, i) => (
							// Pressable to allow navigation to the subcategory screen.
							<Pressable
								key={i}
								onPress={opt.onPress}
								style={[
									styles.subcategory,
									{ borderBottomWidth: i !== s.options.length - 1 ? 1 : 0 },
								]}
							>
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
										<Text
											style={[GlobalStyles.paragraph, { fontWeight: "bold", textAlign: "left" }]}
										>
											{opt.name}
										</Text>
									</View>
									{opt.switch !== undefined && (
										<Switch value={opt.switch} onValueChange={opt.onPress} style={{ height: 0 }} />
									)}
								</View>
								{opt.description && (
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
										{opt.description}
									</Text>
								)}
							</Pressable>
						))}
					</View>
				</View>
			))}
		</>
	)
}
