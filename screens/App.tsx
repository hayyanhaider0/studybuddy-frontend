import { StatusBar } from "expo-status-bar"
import { Text, View } from "react-native"
import Navigation from "../navigation/Navigation"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Navigation />
		</GestureHandlerRootView>
	)
}
