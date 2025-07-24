/**
 * App Component
 *
 * Entry point for the app, includes app navigation component.
 * Check out navigation/Navigation.tsx for more information.
 */

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ModalProvider } from "../contexts/ModalContext"
import Navigation from "../navigation/Navigation"
import { AppProvider } from "../providers/AppProvider"
import { ContextMenuProvider } from "../contexts/ContextMenuContext"
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : undefined}
				>
					<AppProvider>
						<ModalProvider>
							<ContextMenuProvider>
								<Navigation />
							</ContextMenuProvider>
						</ModalProvider>
					</AppProvider>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</GestureHandlerRootView>
	)
}
