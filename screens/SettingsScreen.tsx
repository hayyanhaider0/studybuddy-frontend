import { Switch, Text, TouchableOpacity, View } from "react-native"
import { ThemeName, themeNames, useThemeContext } from "../contexts/ThemeContext"
import { getGlobalStyles } from "../styles/global"
import CustomTouchableOpacity from "../components/common/CustomTouchableOpacity"
import { Dropdown } from "react-native-element-dropdown"
import { SafeAreaView } from "react-native-safe-area-context"
import { MotiView } from "moti"

export default function SettingsScreen() {
	const { theme, setTheme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

	const themeOptions = themeNames.map((name: string) => ({ label: capitalize(name), value: name }))

	return (
		<SafeAreaView style={[GlobalStyles.container, { padding: 16 }]}>
			{/* <View style={{ alignItems: "flex-start", gap: 8 }}>
				<Text style={GlobalStyles.paragraph}>Select Theme</Text>
				<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>
					Toggles the theme. On = Light Mode Off = Dark Mode
				</Text>
				<Dropdown
					data={themeOptions}
					onChange={(item) => {
						setTheme(item.value as ThemeName)
					}}
					labelField='label'
					valueField='value'
					style={{
						width: "100%",
						borderWidth: 2,
						borderColor: theme.colors.placeholder,
						borderRadius: 999,
						paddingVertical: 8,
						paddingHorizontal: 16,
						alignSelf: "center",
					}}
					selectedTextStyle={{ color: theme.colors.placeholder }}
					activeColor='transparent'
					containerStyle={{
						backgroundColor: theme.colors.primary,
						borderRadius: 25,
						borderWidth: 0,
						overflow: "hidden",
					}}
					value={themeOptions.find((opt) => opt.value === theme.name)?.value}
					renderItem={(item, s) => (
						<View
							style={{
								paddingVertical: 16,
								paddingHorizontal: 16,
								backgroundColor: s ? theme.colors.secondary : theme.colors.surface,
							}}
						>
							<Text
								style={[
									GlobalStyles.paragraph,
									{
										textAlign: "left",
										color: s ? theme.colors.textPrimary : theme.colors.textSecondary,
									},
								]}
							>
								{capitalize(item.value)}
							</Text>
						</View>
					)}
				></Dropdown>
			</View> */}
			<CustomTouchableOpacity
				text='Display'
				onPress={() => setTheme(theme.name === "light" ? "dark" : "light")}
			/>
		</SafeAreaView>
	)
}
