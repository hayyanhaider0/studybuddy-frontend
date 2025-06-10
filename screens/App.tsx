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
import { NotebookProvider } from "../contexts/NotebookContext"

export default function App() {
	return (
		<ThemeProvider>
			<NotebookProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<ModalProvider>
						<Navigation />
					</ModalProvider>
				</GestureHandlerRootView>
			</NotebookProvider>
		</ThemeProvider>
	)
}
