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
import VerificationScreen from "../screens/VerificationScreen"
import { getToken } from "../utils/keychain"
import { useEffect } from "react"
import { useAuthContext } from "../contexts/AuthContext"

export type RootStackParamList = {
	// All available screens.
	login: { email?: string | undefined }
	verify: { email: string }
	main: undefined
}

// Stack navigation.
const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
	const { isLoggedIn, setIsLoggedIn } = useAuthContext()

	// Theming
	const { theme } = useThemeContext()

	useEffect(() => {
		const checkToken = async () => {
			console.log("checking")
			const token = await getToken()
			console.log("Token:", token)
			setIsLoggedIn(!!token)
		}
		checkToken()
	}, [])

	return (
		<>
			{/* Set the status bar according to the theme */}
			<StatusBar barStyle={theme.barStyle as StatusBarStyle} />

			{/* Actual navigation logic */}
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{isLoggedIn ? (
						<Stack.Screen name='main' component={DrawerNavigation} />
					) : (
						<>
							<Stack.Screen name='login' component={LoginScreen} />
							<Stack.Screen name='verify' component={VerificationScreen} />
						</>
					)}
				</Stack.Navigator>
				<ContextMenu />
				<Modal />
			</NavigationContainer>
		</>
	)
}
