/**
 * Settings Navigation
 *
 * Sets up stack navigation for all settings categories.
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import DisplayScreen from "../screens/settings/DisplayScreen"
import SettingsScreen from "../screens/SettingsScreen"
import Header from "./Header"

export type SettingsParamList = {
	settings: undefined
	display: undefined
}

const Stack = createNativeStackNavigator<SettingsParamList>() // Create the navigation stack.

export default function SettingsNavigation() {
	return (
		// Starts off with the main Settings screen.
		<Stack.Navigator
			initialRouteName='settings'
			screenOptions={{
				header: ({ options, route }) => (
					<Header
						title={options.title ?? route.name}
						menu={route.name !== "settings" ? false : true}
					/>
				),
			}}
		>
			<Stack.Screen name='settings' component={SettingsScreen} options={{ title: "Settings" }} />
			<Stack.Screen name='display' component={DisplayScreen} options={{ title: "Display" }} />
		</Stack.Navigator>
	)
}
