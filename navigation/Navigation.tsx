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
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import ResetPasswordScreen from "../screens/ResetPasswordScreen"

export type RootStackParamList = {
	// All available screens.
	login: { email?: string | undefined }
	verify: { email: string }
	forgot: { login?: string | undefined }
	reset: { email?: string }
	main: undefined
}

// Stack navigation.
const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
	const { authState, setAuthState } = useAuthContext()

	// Theming
	const { theme } = useThemeContext()

	useEffect(() => {
		const checkToken = async () => {
			const token = await getToken()
			if (!token) {
				setAuthState({
					isLoggedIn: false,
					email: null,
					username: null,
					displayName: null,
					occupation: null,
					educationLevel: null,
				})
			}
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
					{/* {authState.isLoggedIn ? ( */}
					<Stack.Screen name='main' component={DrawerNavigation} />
					{/* ) : ( */}
					<>
						<Stack.Screen name='login' component={LoginScreen} />
						<Stack.Screen name='verify' component={VerificationScreen} />
						<Stack.Screen name='forgot' component={ForgotPasswordScreen} />
						<Stack.Screen name='reset' component={ResetPasswordScreen} />
					</>
					{/* )} */}
				</Stack.Navigator>
				<ContextMenu />
				<Modal />
			</NavigationContainer>
		</>
	)
}
