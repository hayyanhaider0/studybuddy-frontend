/**
 * DisplayScreen Component
 *
 * Contains the UI for the Settings > Display screen.
 */

import { View } from "react-native"
import { useThemeContext } from "../../features/common/contexts/ThemeContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Settings from "../../features/settings/components/Settings"
import { SettingsType } from "../../types/global"
import { ModalType, useModal } from "../../features/common/contexts/ModalContext"
import { useSettings } from "../../features/common/contexts/SettingsContext"
import { FontScale, ThemeName } from "../../enums/global"
import CustomScrollView from "../../features/common/components/CustomScrollView"

export default function DisplayScreen() {
	const { openModal } = useModal() // Get the openModal function from context.

	// Theming, and values for changing display settings.
	const { theme, setTheme, useSystemTheme, toggleSystemTheme, fontScale, setFontScale } =
		useThemeContext()
	const insets = useSafeAreaInsets()

	// Settings context
	const { showPageNumber, setShowPageNumber } = useSettings()

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
					onPress: () => setTheme(ThemeName.LIGHT),
					selected: !useSystemTheme && theme.name === ThemeName.LIGHT,
				},
				{
					label: "Dark",
					onPress: () => setTheme(ThemeName.DARK),
					selected: !useSystemTheme && theme.name === ThemeName.DARK,
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
					onPress: () => setFontScale(FontScale.SMALL),
					selected: fontScale === FontScale.SMALL,
				},
				{
					label: "Medium",
					onPress: () => setFontScale(FontScale.MEDIUM),
					selected: fontScale === FontScale.MEDIUM,
				},
				{
					label: "Large",
					onPress: () => setFontScale(FontScale.LARGE),
					selected: fontScale === FontScale.LARGE,
				},
				{
					label: "X-Large",
					onPress: () => setFontScale(FontScale.XLARGE),
					selected: fontScale === FontScale.XLARGE,
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
					onPress: () => setShowPageNumber((prev) => !prev),
					switch: showPageNumber,
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
		<CustomScrollView contentStyle={{ paddingLeft: insets.left + 8 }}>
			<View style={{ flex: 1, justifyContent: "space-between", gap: 16 }}>
				<Settings settings={settings} />
			</View>
		</CustomScrollView>
	)
}
