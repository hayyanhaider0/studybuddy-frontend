/**
 * DrawerNavigation Menu
 *
 * Contains all UI and logic for the sidebar drawer navigation menu.
 */

import {
	createDrawerNavigator,
	DrawerContentComponentProps,
	DrawerContentScrollView,
} from "@react-navigation/drawer"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { TouchableOpacity, View, Text, Pressable } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { CanvasProvider } from "../providers/CanvasProvider"
import CanvasScreen from "../screens/CanvasScreen"
import LoginScreen from "../screens/LoginScreen"
import SettingsScreen from "../screens/SettingsScreen"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import NotebooksScreen from "../screens/NotebooksScreen"
import Header from "../components/common/Header"
import { screens } from "../utils/drawer"

export type DrawerParamList = {
	// All available screens on the sidebar menu.
	notebooks: undefined
	canvas: undefined
	aiNotes: undefined
	flashcards: undefined
	quizzes: undefined
	exams: undefined
	settings: undefined
	account: undefined
}

// Drawer navigation.
const Drawer = createDrawerNavigator<DrawerParamList>()

export default function DrawerNavigation() {
	const DRAWER_WIDTH = 252 // Set the drawer width

	// Theming
	const { theme } = useThemeContext()

	return (
		<Drawer.Navigator
			// Render drawer content. This includes the designing of the drawer.
			drawerContent={(props: DrawerContentComponentProps) => {
				const { state, descriptors, navigation } = props // Get properties of drawer content.

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
											<Text style={{ color: theme.accent.onAccent, paddingVertical: 20 }}>
												{label}
											</Text>
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
			}}
			initialRouteName='canvas' // Go to canvas initially.
			screenOptions={{
				drawerStyle: { width: DRAWER_WIDTH },
				headerShown: true,
			}} // No header and set drawer width.
		>
			{/* Canvas option */}
			<Drawer.Screen
				name='canvas'
				children={() => (
					<CanvasProvider>
						<CanvasScreen />
					</CanvasProvider>
				)}
				options={{
					title: "Canvas",
					drawerIcon: ({ color, size }) => <MaterialC name='draw' size={size} color={color} />,
					headerShown: false,
				}}
			/>
			{/* Render all options except Canvas and Settings. */}
			{screens.map((s, i) => (
				<Drawer.Screen
					key={i}
					name={s.name as keyof DrawerParamList}
					component={s.component}
					options={{
						drawerIcon: ({ color, size }) => <MaterialC name={s.icon} size={size} color={color} />,
						title: s.title,
						header: ({ route, options }) => <Header title={options.title || route.name} />,
					}}
				/>
			))}
			{/* Settings option */}
			<Drawer.Screen
				name='settings'
				component={SettingsScreen}
				options={{
					drawerIcon: ({ color, size }) => (
						<Ionicons name='settings-outline' size={size} color={color} />
					),
					title: "Settings",
				}}
			/>
		</Drawer.Navigator>
	)
}
