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
import { Keyboard, TouchableWithoutFeedback } from "react-native"
import { queryClient } from "../api/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<AppProvider>
					<ModalProvider>
						<ContextMenuProvider>
							<QueryClientProvider client={queryClient}>
								<Navigation />
							</QueryClientProvider>
						</ContextMenuProvider>
					</ModalProvider>
				</AppProvider>
			</TouchableWithoutFeedback>
		</GestureHandlerRootView>
	)
}
