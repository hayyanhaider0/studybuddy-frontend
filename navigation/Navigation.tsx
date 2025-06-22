/**
 * Navigation component
 *
 * Handles all navigation related logic.
 */

import { StatusBar, StatusBarStyle } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DrawerNavigation from "./DrawerNavigation"
import Modal from "../components/common/Modal"
import ContextMenu from "../components/common/ContextMenu"

export type RootStackParamList = {
	// All available screens.
	login: undefined
	main: undefined
}

// Stack navigation.
const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
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
				<ContextMenu />
				<Modal />
			</NavigationContainer>
		</>
	)
}
