/**
 * App Component
 *
 * Entry point for the app, includes app navigation component.
 * Check out navigation/Navigation.tsx for more information.
 */

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ModalProvider } from "../features/common/contexts/ModalContext"
import Navigation from "../navigation/Navigation"
import { AppProvider } from "../providers/AppProvider"
import { ContextMenuProvider } from "../features/common/contexts/ContextMenuContext"
import { Keyboard, TouchableWithoutFeedback } from "react-native"
import { queryClient } from "../api/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<QueryClientProvider client={queryClient}>
					<AppProvider>
						<ModalProvider>
							<ContextMenuProvider>
								<Navigation />
							</ContextMenuProvider>
						</ModalProvider>
					</AppProvider>
				</QueryClientProvider>
			</TouchableWithoutFeedback>
		</GestureHandlerRootView>
	)
}
