/**
 * Navigation component
 *
 * Handles all navigation related logic.
 */

import { StatusBar, StatusBarStyle } from "react-native"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DrawerNavigation from "./DrawerNavigation"
import Modal from "../features/common/components/Modal"
import ContextMenu from "../features/common/components/ContextMenu"
import VerificationScreen from "../screens/VerificationScreen"
import { getToken } from "../utils/secureStore"
import { useEffect } from "react"
import { useAuthContext } from "../features/auth/contexts/AuthContext"
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import ResetPasswordScreen from "../screens/ResetPasswordScreen"
import GenerateScreen from "../screens/GenerateScreen"
import Header from "./Header"
import { capitalize } from "../utils/formatters"
import AccountPreferencesScreen from "../screens/AccountPreferencesScreen"

export type RootStackParamList = {
	// All available screens.
	login: { email?: string | undefined }
	accountPreferences: undefined
	verify: { email: string }
	forgot: { login?: string | undefined }
	reset: { email?: string }
	main: undefined
	generate: { taskType: "notes" | "flashcards" | "quiz" | "exam"; notebookId: string }
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
					{authState.isLoggedIn ? (
						<>
							<Stack.Screen name='main' component={DrawerNavigation} />
							<Stack.Screen name='accountPreferences' component={AccountPreferencesScreen} />
							<Stack.Screen
								name='generate'
								component={GenerateScreen}
								options={({ route }) => ({
									headerShown: true,
									header: () => (
										<Header title={`Generate ${capitalize(route.params?.taskType)}`} menu={false} />
									),
								})}
							/>
						</>
					) : (
						<>
							<Stack.Screen name='login' component={LoginScreen} />
							<Stack.Screen name='verify' component={VerificationScreen} />
							<Stack.Screen name='forgot' component={ForgotPasswordScreen} />
							<Stack.Screen name='reset' component={ResetPasswordScreen} />
						</>
					)}
				</Stack.Navigator>
				<ContextMenu />
				<Modal />
			</NavigationContainer>
		</>
	)
}
