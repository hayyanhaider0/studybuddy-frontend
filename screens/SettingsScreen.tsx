import { Text, View } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { getGlobalStyles } from "../styles/global"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { ScrollView } from "react-native-gesture-handler"

export default function SettingsScreen() {
	const { theme, setTheme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const insets = useSafeAreaInsets()

	const settings = [
		{
			name: "General",
			icon: "tune",
			description: "Customize the app’s appearance, language, and basic behavior.",
		},
		{
			name: "Notifications",
			icon: "bell-ring-outline",
			description: "Manage reminder frequency, study alerts, and push notifications.",
		},
		{
			name: "Account",
			icon: "account-circle-outline",
			description: "Update your profile, email, password, and login methods.",
		},
		{
			name: "Study Preferences",
			icon: "book-outline",
			description: "Set your study goals, focus timer defaults, and session habits.",
		},
	]

	const aboutLinks = ["Feedback", "Report a Bug", "Terms & Privacy"]

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			style={[GlobalStyles.container, { padding: 8, paddingLeft: insets.left + 8 }]}
		>
			<View style={{ flex: 1, justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
				<View
					style={{
						backgroundColor: theme.colors.primary,
						borderRadius: 28,
					}}
				>
					{settings.map((s, i) => (
						<View
							key={i}
							style={[
								{
									borderColor: theme.colors.tertiary,
									paddingVertical: 24,
									paddingHorizontal: 16,
									gap: 16,
								},
								i !== settings.length - 1 && { borderBottomWidth: 1 },
							]}
						>
							<View
								style={[
									{
										flexDirection: "row",
										justifyContent: "space-between",
										paddingRight: 8,
									},
								]}
							>
								<View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
									<MaterialC name='menu-right' size={24} color={theme.colors.textPrimary} />
									<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{s.name}</Text>
								</View>
								<MaterialC name={s.icon} size={24} color={theme.colors.textPrimary} />
							</View>
							<Text style={[GlobalStyles.subtext, { textAlign: "left", paddingLeft: 8 }]}>
								{s.description}
							</Text>
						</View>
					))}
				</View>
				<View style={{ gap: 16 }}>
					<View
						style={{
							flexDirection: "row",
							backgroundColor: theme.colors.primary,
							borderRadius: 50,
							paddingVertical: 24,
							paddingHorizontal: 16,
							paddingRight: 24,
							justifyContent: "space-between",
						}}
					>
						<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
							<MaterialC name='menu-right' size={24} color={theme.colors.textPrimary} />
							<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>About</Text>
						</View>
						<MaterialC name='information-outline' size={24} color={theme.colors.textPrimary} />
					</View>
					<View
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 28,
							gap: 8,
							padding: 16,
						}}
					>
						{aboutLinks.map((l, i) => (
							<Text key={i} style={[GlobalStyles.link, { textAlign: "center" }]}>
								{l}
							</Text>
						))}
					</View>
				</View>
			</View>
		</ScrollView>
	)
}
