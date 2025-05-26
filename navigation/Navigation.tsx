import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import CanvasScreen from "../screens/CanvasScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { CanvasProvider } from "../providers/CanvasProvider"
import { ThemeProvider } from "../contexts/ThemeContext"

export type RootStackParamList = {
	login: undefined
	canvas: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
	return (
		<NavigationContainer>
			<ThemeProvider>
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
			</ThemeProvider>
		</NavigationContainer>
	)
}
