import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"
import { LinearGradient } from "expo-linear-gradient"
import { Pressable, View, Text, Image } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { getGlobalStyles } from "../styles/global"
import tinycolor from "tinycolor2"

export default function CustomDrawer({
	state,
	descriptors,
	navigation,
}: DrawerContentComponentProps) {
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	return (
		// Scrollable drawer container
		<DrawerContentScrollView
			contentContainerStyle={{
				backgroundColor: theme.colors.background,
				minHeight: "100%",
				padding: 8,
			}}
		>
			{/* Flex wrapper to allow spacing (for marginTop: "auto" to work) */}
			<View style={{ flex: 1 }}>
				<Image
					source={require("../assets/study-buddy-logo.png")}
					style={{ height: 96, width: 104 }}
					resizeMode='contain'
					tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
				/>
				{state.routes.map((r, i) => {
					const isFocused = state.index === i
					const { drawerIcon, title } = descriptors[r.key].options
					const label = title
					const isLastItem = r.name === "account" // Used to push "account" to bottom

					const onPress = () => {
						if (!isFocused) navigation.navigate(r.name)
					}

					// Single menu item (focused/unfocused styles)
					const item = (
						<Pressable key={r.key} onPress={onPress}>
							{({ pressed }) => (
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										padding: 4,
										opacity: pressed ? 0.7 : 1, // Feedback on press
										transform: [{ scale: pressed ? 0.98 : 1 }],
									}}
								>
									{/* Highlight selected item with gradient */}
									{isFocused ? (
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
											{/* Focused icon + label */}
											{drawerIcon?.({ color: theme.accent.onAccent, size: 28, focused: true })}
											<Text style={[GlobalStyles.paragraph, { paddingVertical: 20 }]}>{label}</Text>
										</LinearGradient>
									) : (
										// Default unfocused item
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
											{drawerIcon?.({ color: theme.colors.textPrimary, size: 28, focused: false })}
											<Text style={[GlobalStyles.paragraph, { paddingVertical: 20 }]}>{label}</Text>
										</View>
									)}
								</View>
							)}
						</Pressable>
					)

					// Push account tab to bottom using marginTop: "auto"
					return isLastItem ? (
						<View key={r.key} style={{ marginTop: "auto" }}>
							{item}
						</View>
					) : (
						item
					)
				})}
			</View>
		</DrawerContentScrollView>
	)
}
