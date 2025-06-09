/**
 * App Component
 *
 * Entry point for the app, includes app navigation component.
 * Check out navigation/Navigation.tsx for more information.
 */

import { GestureHandlerRootView } from "react-native-gesture-handler"
import Modal from "../components/common/Modal"
import { ModalProvider } from "../contexts/ModalContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import Navigation from "../navigation/Navigation"

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<ModalProvider>
					<Navigation />
					{/* Allows modal to always be on top */}
					<Modal />
				</ModalProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}
