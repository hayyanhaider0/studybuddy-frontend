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

export default function App() {
	return (
		<AppProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ModalProvider>
					<ContextMenuProvider>
						<Navigation />
					</ContextMenuProvider>
				</ModalProvider>
			</GestureHandlerRootView>
		</AppProvider>
	)
}
