import { View, Pressable, Text } from "react-native"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { getSettingsStyles } from "../../../styles/settings"
import { SettingsType } from "../../../types/global"
import SettingsOption from "./SettingsOption"

export default function Settings({ settings }: { settings: SettingsType }) {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()
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
								<SettingsOption option={opt} />
							</Pressable>
						))}
					</View>
				</View>
			))}
		</>
	)
}
