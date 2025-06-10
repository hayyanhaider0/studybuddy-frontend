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
import { TouchableOpacity, View, Text } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { CanvasProvider } from "../providers/CanvasProvider"
import CanvasScreen from "../screens/CanvasScreen"
import LoginScreen from "../screens/LoginScreen"
import SettingsScreen from "../screens/SettingsScreen"
import Ionicons from "react-native-vector-icons/Ionicons"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import NotebooksScreen from "../screens/NotebooksScreen"

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
	// All screens except Canvas and Settings.
	const screens = [
		{ name: "notebooks", title: "Notebooks", icon: "notebook", component: NotebooksScreen },
		{ name: "aiNotes", title: "AI Notes", icon: "robot", component: LoginScreen },
		{ name: "flashcards", title: "Flashcards", icon: "cards-outline", component: LoginScreen },
		{ name: "quizzes", title: "Quizzes", icon: "clipboard-list-outline", component: LoginScreen },
		{ name: "exams", title: "Exams", icon: "file-document-outline", component: LoginScreen },
		{ name: "account", title: "Account", icon: "account-circle-outline", component: LoginScreen },
	]

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
							const { drawerLabel, drawerIcon, title } = descriptors[r.key].options // Get descriptors of each menu option.
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
			screenOptions={{ headerShown: false, drawerStyle: { width: DRAWER_WIDTH } }} // No header and set drawer width.
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
					drawerIcon: ({ color, size }) => <Material name='draw' size={size} color={color} />,
				}}
			/>
			{/* Render all options except Canvas and Settings. */}
			{screens.map((s, i) => (
				<Drawer.Screen
					key={i}
					name={s.name as keyof DrawerParamList}
					component={s.component}
					options={{
						drawerIcon: ({ color, size }) => <Material name={s.icon} size={size} color={color} />,
						title: s.title,
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
