import { View, Text, Switch, Pressable, ScrollView } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { getSettingsStyles } from "../../styles/settings"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import Settings from "../../components/settings/Settings"
import { SettingsType } from "../../types/global"
import { ModalType, useModal } from "../../contexts/ModalContext"

export default function DisplayScreen() {
	const { theme, setTheme, useSystemTheme, toggleSystemTheme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const { openModal } = useModal()
	const handleSelectTheme = () => {
		openModal({
			type: ModalType.CHOICE,
			title: "Select Theme",
			description: "Choose a theme and personalize your Study Buddy experience.",
			choices: [
				{
					label: "System Default",
					onPress: () => {
						if (!useSystemTheme) toggleSystemTheme()
					},
					selected: useSystemTheme,
				},
				{
					label: "Light",
					onPress: () => setTheme("light"),
					selected: !useSystemTheme && theme.name === "light",
				},
				{
					label: "Dark",
					onPress: () => setTheme("dark"),
					selected: !useSystemTheme && theme.name === "dark",
				},
			],
		})
	}

	const insets = useSafeAreaInsets()

	const settings: SettingsType = [
		{
			name: "Theme & Appearance",
			options: [
				{
					name: "Select Theme",
					description: "Choose a theme and personalize your Study Buddy experience.",
					onPress: handleSelectTheme,
				},
				{
					name: "Font Size",
					description: "Change your font size.",
					// onPress: () => navigation.navigate("fontSize"),
					onPress: () => console.log("Navigate"),
				},
			],
		},
		{
			name: "Canvas Appearance",
			options: [
				{
					name: "Show Canvas Number",
					description: "Set whether you want the canvas to have a page number on it.",
					onPress: () => console.log("Include new property in canvas state context"),
					switch: true,
				},
				{
					name: "Show Canvas Date Template",
					description:
						"Set whether you want the canvas to have a specific area for writing a date on it.",
					onPress: () => console.log("Include new property in canvas state context"),
					switch: true,
				},
			],
		},
	]

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1, gap: 16 }}
			style={[GlobalStyles.container, { padding: 8, paddingLeft: insets.left + 8 }]}
		>
			<Settings settings={settings} />
		</ScrollView>
	)
}
