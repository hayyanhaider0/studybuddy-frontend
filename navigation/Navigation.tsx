/**
 * Navigation component
 *
 * Handles all navigation related logic.
 */

import { Button, StatusBar, StatusBarStyle } from "react-native"
import { ThemeProvider, useThemeContext } from "../contexts/ThemeContext"
import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import { CanvasProvider } from "../providers/CanvasProvider"
import CanvasScreen from "../screens/CanvasScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import Ionicon from "react-native-vector-icons/Ionicons"
import Material from "react-native-vector-icons/MaterialCommunityIcons"
import SettingsScreen from "../screens/SettingsScreen"

export type RootStackParamList = {
	// All available screens.
	login: undefined
	main: undefined
}

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

// Stack navigation.
const Stack = createNativeStackNavigator<RootStackParamList>()
// Drawer navigation.
const Drawer = createDrawerNavigator<DrawerParamList>()

function DrawerNavigation() {
	const { theme } = useThemeContext()
	return (
		<Drawer.Navigator
			screenOptions={{
				drawerType: "front",
				drawerStyle: { width: 280 },
				headerShown: false,
				drawerContentContainerStyle: {
					backgroundColor: theme.colors.background,
					height: "100%",
					gap: 8,
				},
				drawerActiveBackgroundColor: theme.colors.secondary,
				drawerInactiveBackgroundColor: theme.colors.primary,
				drawerActiveTintColor: theme.colors.onSecondary,
				drawerInactiveTintColor: theme.colors.onPrimary,
			}}
			initialRouteName='canvas'
		>
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
			<Drawer.Screen
				name='notebooks'
				component={LoginScreen}
				options={{
					title: "Notebooks",
					drawerIcon: ({ color, size }) => <Material name='notebook' size={size} color={color} />,
				}}
			/>
			<Drawer.Screen
				name='aiNotes'
				component={LoginScreen}
				options={{
					title: "AI Notes",
					drawerIcon: ({ color, size }) => <Material name='robot' size={size} color={color} />,
				}}
			/>
			<Drawer.Screen
				name='flashcards'
				component={LoginScreen}
				options={{
					title: "Flashcards",
					drawerIcon: ({ color, size }) => (
						<Material name='cards-outline' size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name='quizzes'
				component={LoginScreen}
				options={{
					title: "Quizzes",
					drawerIcon: ({ color, size }) => (
						<Material name='clipboard-list-outline' size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name='exams'
				component={LoginScreen}
				options={{
					title: "Exams",
					drawerIcon: ({ color, size }) => (
						<Material name='file-document-outline' size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name='settings'
				component={SettingsScreen}
				options={{
					title: "Settings",
					drawerIcon: ({ color, size }) => (
						<Ionicon name='settings-outline' size={size} color={color} />
					),
					drawerItemStyle: { marginTop: "auto" },
				}}
			/>
			<Drawer.Screen
				name='account'
				component={LoginScreen}
				options={{
					title: "Account",
					drawerIcon: ({ color, size }) => (
						<Material name='account-circle-outline' size={size} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	)
}

export default function Navigation() {
	return (
		<ThemeProvider>
			<InnerNavigation />
		</ThemeProvider>
	)
}

function InnerNavigation() {
	// Theming
	const { theme } = useThemeContext()

	return (
		<>
			{/* Set the status bar according to the theme */}
			<StatusBar barStyle={theme.barStyle as StatusBarStyle} />

			{/* Actual navigation logic */}
			<NavigationContainer>
				{/* THIS NEEDS TO BE CHANGED WITH USER AUTHENTICATION */}
				<Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }}>
					<Stack.Screen name='login' component={LoginScreen} />
					<Stack.Screen name='main' component={DrawerNavigation} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	)
}
