import { NavigationContainer } from "@react-navigation/native"
import LoginScreen from "../screens/LoginScreen"
import CanvasScreen from "../screens/CanvasScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "./types"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigation() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='login' screenOptions={{ headerShown: false }}>
				<Stack.Screen name='login' component={LoginScreen} />
				<Stack.Screen name='canvas' component={CanvasScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
