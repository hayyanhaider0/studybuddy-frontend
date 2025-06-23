/**
 * DisplayScreen Component
 *
 * Contains the UI for the Settings > Display screen.
 */

import { ScrollView } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Settings from "../../components/settings/Settings"
import { SettingsType } from "../../types/global"
import { ModalType, useModal } from "../../contexts/ModalContext"

export default function DisplayScreen() {
	const { openModal } = useModal() // Get the openModal function from context.

	// Theming, and values for changing display settings.
	const {
		theme,
		setTheme,
		useSystemTheme,
		toggleSystemTheme,
		fontScale,
		setFontScale,
		GlobalStyles,
	} = useThemeContext()
	const insets = useSafeAreaInsets()

	// Opens a multiple choice modal to allow the user to select a theme.
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

	// Open a multiple choice modal that allows the user to select a font size.
	const handleFontScale = () => {
		openModal({
			type: ModalType.CHOICE,
			title: "Font Size",
			description: "Change your font size.",
			choices: [
				{
					label: "Small",
					onPress: () => setFontScale(1),
					selected: fontScale === 1,
				},
				{
					label: "Medium",
					onPress: () => setFontScale(1.1),
					selected: fontScale === 1.1,
				},
				{
					label: "Large",
					onPress: () => setFontScale(1.2),
					selected: fontScale === 1.2,
				},
				{
					label: "X-Large",
					onPress: () => setFontScale(1.3),
					selected: fontScale === 1.3,
				},
			],
		})
	}

	// List of categories and subcategories of Display Settings.
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
					onPress: handleFontScale,
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
