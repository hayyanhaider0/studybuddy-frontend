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
import { useModal } from "../../features/common/contexts/ModalContext"
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
			type: "single_choice",
			title: "Select Theme",
			description: "Choose a theme and personalize your Study Buddy experience.",
			choices: [
				{ label: "System Default", selected: useSystemTheme },
				{ label: "Light", selected: !useSystemTheme && theme.name === ThemeName.LIGHT },
				{ label: "Dark", selected: !useSystemTheme && theme.name === ThemeName.DARK },
			],
			onSubmit: (selectedIndex: number) => {
				switch (selectedIndex) {
					case 0:
						if (!useSystemTheme) toggleSystemTheme()
						break
					case 1:
						setTheme(ThemeName.LIGHT)
						break
					case 2:
						setTheme(ThemeName.DARK)
						break
				}
			},
		})
	}

	// Open a multiple choice modal that allows the user to select a font size.
	const handleFontScale = () => {
		openModal({
			type: "single_choice",
			title: "Font Size",
			description: "Change your font size.",
			choices: [
				{ label: "Small", selected: fontScale === FontScale.SMALL },
				{ label: "Medium", selected: fontScale === FontScale.MEDIUM },
				{ label: "Large", selected: fontScale === FontScale.LARGE },
				{ label: "X-Large", selected: fontScale === FontScale.XLARGE },
			],
			onSubmit: (selectedIndex: number) => {
				switch (selectedIndex) {
					case 0:
						setFontScale(FontScale.SMALL)
						break
					case 1:
						setFontScale(FontScale.MEDIUM)
						break
					case 2:
						setFontScale(FontScale.LARGE)
						break
					case 3:
						setFontScale(FontScale.XLARGE)
						break
				}
			},
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
