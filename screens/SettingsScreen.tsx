import { Pressable, Text, View } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { getGlobalStyles } from "../styles/global"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { ScrollView } from "react-native-gesture-handler"
import { getSettingsStyles } from "../styles/settings"

export default function SettingsScreen() {
	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const styles = getSettingsStyles(theme.colors)

	const insets = useSafeAreaInsets() // Inset to get a safe area view.

	// All the settings options.
	const settings = [
		{
			name: "General Settings",
			options: [
				{
					name: "Display",
					description: "Edit your display settings, theme, canvas settings, etc.",
				},
				{
					name: "Language",
					description: "Change the language of the app interface.",
				},
				{
					name: "Notifications",
					description: "Manage push and in-app notifications.",
				},
			],
		},
		{
			name: "Account",
			options: [
				{
					name: "Profile",
					description: "Edit your personal information and profile picture.",
				},
				{
					name: "Security",
					description: "Update your password and enable 2FA.",
				},
				{
					name: "Linked Accounts",
					description: "Manage connected services like Google or GitHub.",
				},
			],
		},
		{
			name: "Support",
			options: [
				{
					name: "Help Center",
					description: "Browse FAQs and support articles.",
				},
				{
					name: "Contact Us",
					description: "Reach out to our support team.",
				},
				{
					name: "Feedback",
					description: "Send us your thoughts or report a bug.",
				},
			],
		},
	]

	const aboutLinks = ["Feedback", "Report a Bug", "Terms & Privacy"]

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			style={[GlobalStyles.container, { padding: 8, paddingLeft: insets.left + 8 }]}
		>
			<View style={{ flex: 1, justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
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
									style={[
										styles.subcategory,
										{ borderBottomWidth: i !== s.options.length - 1 ? 1 : 0 },
									]}
								>
									{/* Subcategory name and description */}
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<MaterialC name='menu-right' size={20} color={theme.colors.textPrimary} />
										<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{opt.name}</Text>
									</View>
									<Text
										style={[GlobalStyles.subtext, { textAlign: "left", paddingHorizontal: 20 }]}
									>
										{opt.description}
									</Text>
								</Pressable>
							))}
						</View>
					</View>
				))}
				{/* About Section */}
				<View style={{ gap: 16 }}>
					<View style={styles.about}>
						<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
							<MaterialC name='menu-right' size={24} color={theme.colors.textPrimary} />
							<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>About</Text>
						</View>
						<MaterialC name='information-outline' size={24} color={theme.colors.textPrimary} />
					</View>
					{/* Helpful links for the user -- feedback, bug reporting, terms & privacy. */}
					<View style={styles.aboutLinks}>
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
