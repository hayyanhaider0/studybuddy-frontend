import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity, View, Text } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"

export default function CustomDrawer({
	state,
	descriptors,
	navigation,
}: DrawerContentComponentProps) {
	const { theme } = useThemeContext()

	return (
		// Main drawer and its styling.
		<DrawerContentScrollView
			contentContainerStyle={{
				backgroundColor: theme.colors.background,
				minHeight: "100%",
				gap: 4,
			}}
		>
			{/* Map all of the drawer content. */}
			{state.routes.map((r, i) => {
				const isFocused = state.index === i // Find the current selected option.
				const { drawerIcon, title } = descriptors[r.key].options // Get descriptors of each menu option.
				const label = title // Set label to be the title.

				const separator = r.name === "account" // Used to separate menu options.

				// Navigate to the selected option.
				const onPress = () => {
					if (!isFocused) navigation.navigate(r.name)
				}

				return (
					// Menu option
					<TouchableOpacity
						key={r.key}
						onPress={onPress}
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 4,
							marginTop: separator ? "auto" : 0,
						}}
					>
						{/* Check whether the option is selected */}
						{isFocused ? (
							// If selected, render a gradient.
							<LinearGradient
								colors={theme.accent.gradient.colors}
								start={theme.accent.gradient.start}
								end={theme.accent.gradient.end}
								style={{
									flexDirection: "row",
									alignItems: "center",
									width: "100%",
									borderRadius: 999,
									paddingHorizontal: 16,
									gap: 8,
								}}
							>
								{/* Render drawer icon and title */}
								{drawerIcon?.({ color: theme.accent.onAccent, size: 24, focused: true })}
								<Text style={{ color: theme.accent.onAccent, paddingVertical: 20 }}>{label}</Text>
							</LinearGradient>
						) : (
							// No gradient if option is not selected.
							<View
								style={{
									backgroundColor: theme.colors.primary,
									borderRadius: 999,
									paddingHorizontal: 16,
									width: "100%",
									flexDirection: "row",
									alignItems: "center",
									gap: 8,
								}}
							>
								{/* Render drawer icon and title */}
								{drawerIcon?.({ color: theme.colors.textPrimary, size: 24, focused: true })}
								<Text style={{ color: theme.colors.textPrimary, paddingVertical: 20 }}>
									{label}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				)
			})}
		</DrawerContentScrollView>
	)
}
