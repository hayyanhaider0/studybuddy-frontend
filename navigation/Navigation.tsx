/**
 * Navigation component
 *
 * Handles all navigation related logic.
 */

import { StatusBar, StatusBarStyle } from "react-native"
import { ThemeProvider, useThemeContext } from "../contexts/ThemeContext"
import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import { CanvasProvider } from "../providers/CanvasProvider"
import CanvasScreen from "../screens/CanvasScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

export type RootStackParamList = {
	// All available screens.
	login: undefined
	canvas: undefined
}
// Stack navigation variable.
const Stack = createNativeStackNavigator<RootStackParamList>()

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
					<Stack.Screen
						name='canvas'
						children={() => (
							<CanvasProvider>
								<CanvasScreen />
							</CanvasProvider>
						)}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	)
}
