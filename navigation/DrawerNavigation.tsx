/**
 * DrawerNavigation Menu
 *
 * Contains all UI and logic for the sidebar drawer navigation menu.
 */

import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer"
import React from "react"
import { CanvasProvider } from "../providers/CanvasProvider"
import CanvasScreen from "../screens/CanvasScreen"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import Header from "./Header"
import { screens } from "../utils/drawer"
import CustomDrawer from "./CustomDrawer"
import SettingsNavigation from "./SettingsNavigation"

export type DrawerParamList = {
	// All available screens on the sidebar menu.
	notebooks: undefined
	canvas: undefined
	aiNotes: undefined
	flashcards: undefined
	quizzes: undefined
	exams: undefined
	settingsMain: undefined
	account: undefined
}

// Drawer navigation.
const Drawer = createDrawerNavigator<DrawerParamList>()

export default function DrawerNavigation() {
	const DRAWER_WIDTH = 252 // Set the drawer width

	return (
		<Drawer.Navigator
			// Render drawer content. This includes the designing of the drawer.
			drawerContent={(props: DrawerContentComponentProps) => {
				const { state, descriptors, navigation } = props // Get properties of drawer content.

				return <CustomDrawer state={state} descriptors={descriptors} navigation={navigation} />
			}}
			initialRouteName='canvas' // Go to canvas initially.
			screenOptions={{
				drawerStyle: { width: DRAWER_WIDTH },
				headerShown: true,
			}} // No header and set drawer width.
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
					drawerIcon: ({ color, size }) => <MaterialC name='draw' size={size} color={color} />,
					headerShown: false,
				}}
			/>
			{/* Render all options except Canvas and Settings. */}
			{screens.map((s, i) => (
				<Drawer.Screen
					key={i}
					name={s.name as keyof DrawerParamList}
					component={s.component}
					options={{
						drawerIcon: ({ color, size }) => <MaterialC name={s.icon} size={size} color={color} />,
						title: s.title,
						header: ({ route, options }) => (
							<Header title={options.title || route.name} sort={s.sort} />
						),
					}}
				/>
			))}
			{/* Settings option */}
			<Drawer.Screen
				name='settingsMain'
				component={SettingsNavigation}
				options={{
					drawerIcon: ({ color, size }) => (
						<Ionicons name='settings-outline' size={size} color={color} />
					),
					title: "Settings",
					headerShown: false,
				}}
			/>
		</Drawer.Navigator>
	)
}
