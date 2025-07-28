/**
 * SettingsScreen Component
 *
 * Contains the UI for the Settings screen.
 */

import { Text, View } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { getSettingsStyles } from "../styles/settings"
import { useNavigation } from "@react-navigation/native"
import { SettingsParamList } from "../navigation/SettingsNavigation"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SettingsType } from "../types/global"
import Settings from "../components/settings/Settings"
import CustomScrollView from "../components/common/CustomScrollView"

export default function SettingsScreen() {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getSettingsStyles(theme.colors)
	const insets = useSafeAreaInsets() // Inset to get a safe area view.

	// Variable to allow navigation on the settings stack.
	const navigation = useNavigation<NativeStackNavigationProp<SettingsParamList>>()

	// List of categories and subcategories of Main Settings.
	const settings: SettingsType = [
		{
			name: "General Settings",
			options: [
				{
					name: "Display",
					description: "Edit your display settings, theme, canvas settings, etc.",
					onPress: () => navigation.navigate("display"),
				},
				{
					name: "Language",
					description: "Change the language of the app interface.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
				{
					name: "Notifications",
					description: "Manage push and in-app notifications.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
			],
		},
		{
			name: "Account",
			options: [
				{
					name: "Profile",
					description: "Edit your personal information and profile picture.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
				{
					name: "Security",
					description: "Update your password and enable 2FA.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
				{
					name: "Linked Accounts",
					description: "Manage connected services like Google or GitHub.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
			],
		},
		{
			name: "Support",
			options: [
				{
					name: "Help Center",
					description: "Browse FAQs and support articles.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
				{
					name: "Contact Us",
					description: "Reach out to our support team.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
				{
					name: "Feedback",
					description: "Send us your thoughts or report a bug.",
					onPress: () => console.log("NOT YET IMPLEMENTED"),
				},
			],
		},
	]

	const aboutLinks = ["Feedback", "Report a Bug", "Terms & Privacy"]

	return (
		<CustomScrollView contentStyle={{ paddingLeft: insets.left + 8 }}>
			<View style={{ flex: 1, justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
				<Settings settings={settings} />
				{/* About Section */}
				<View style={{ gap: 16 }}>
					<View style={styles.about}>
						<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
							<MaterialC name='menu-right' size={24} color={theme.colors.textPrimary} />
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold", textAlign: "left" }]}>
								About
							</Text>
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
		</CustomScrollView>
	)
}
