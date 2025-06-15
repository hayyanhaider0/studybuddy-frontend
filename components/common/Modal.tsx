/**
 * Modal Component
 *
 * Uses the useModal() hook to generate a generic modal.
 */

import { View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { TextInput } from "react-native-gesture-handler"
import { useModal } from "../../contexts/ModalContext"
import CustomPressable from "./CustomPressable"
import { AnimatePresence, MotiView } from "moti"
import { useNavigationState } from "@react-navigation/native"
import { useEffect, useRef } from "react"

export default function Modal() {
	const { showModal, input, setInput, modalData, closeModal, handleSubmit } = useModal()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const routeCount = useNavigationState((state) => state?.routes?.length ?? 0)
	const prevRouteCount = useRef<number>(routeCount)

	// Closes the modal if the user navigates to another screen while it is open.
	useEffect(() => {
		if (!showModal) {
			// Reset the ref when modal closes
			prevRouteCount.current = routeCount
			return
		}

		// Only start checking for navigation changes after modal has been open briefly
		const timer = setTimeout(() => {
			if (routeCount !== prevRouteCount.current) {
				closeModal()
			}
		}, 200) // Small delay to avoid closing on initial open

		return () => clearTimeout(timer)
	}, [showModal, routeCount, closeModal])

	// Update the ref whenever route count changes (but don't close modal immediately)
	useEffect(() => {
		if (!showModal) {
			prevRouteCount.current = routeCount
		}
	}, [routeCount, showModal])

	// Don't render if no modal data
	if (!modalData) return null

	return (
		<AnimatePresence>
			{showModal && (
				// Dim background behind the modal
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: "spring", damping: 18 }}
					style={GlobalStyles.dimBackground}
				>
					{/* Modal Container */}
					<MotiView
						from={{ translateY: 256, opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						exit={{ translateY: 128, opacity: 0 }}
						transition={{ type: "spring", damping: 18 }}
						style={GlobalStyles.modalContainer}
					>
						{/* Modal components */}
						<Text style={GlobalStyles.subheading}>{modalData.title}</Text>
						<Text style={GlobalStyles.paragraph}>{modalData.description}</Text>
						<TextInput
							value={input}
							onChangeText={setInput}
							placeholder={modalData.placeholder}
							placeholderTextColor={theme.colors.placeholder}
							style={GlobalStyles.input}
						/>
						<View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
							{/* Close modal button */}
							<CustomPressable
								title='Close'
								onPress={closeModal}
								style={GlobalStyles.secondaryButton}
							/>
							{/* Confirm button */}
							<CustomPressable
								type='primary'
								title={modalData.buttonText}
								onPress={handleSubmit}
								style={GlobalStyles.button}
							/>
						</View>
					</MotiView>
				</MotiView>
			)}
		</AnimatePresence>
	)
}
