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
import { useFocusEffect, useNavigationState } from "@react-navigation/native"
import { useEffect, useRef } from "react"

export default function Modal() {
	const {
		showModal,
		setShowModal,
		title,
		description,
		placeholder,
		input,
		setInput,
		buttonText,
		onPress,
	} = useModal() // Get modal context
	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const handleConfirm = () => {
		if (onPress) {
			onPress(input)
			setInput("")
			setShowModal(false)
		}
	}

	const routeCount = useNavigationState((state) => state?.routes?.length ?? 0)
	const prevRouteCount = useRef<number>(routeCount)

	useEffect(() => {
		if (!showModal) return

		if (routeCount !== prevRouteCount.current) {
			setShowModal(false)
			prevRouteCount.current = routeCount
		}
	}, [showModal, routeCount])

	return (
		<AnimatePresence>
			{showModal && (
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: "spring", damping: 18 }}
					style={GlobalStyles.dimBackground}
				>
					<MotiView
						from={{ translateY: 256, opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						exit={{ translateY: 128, opacity: 0 }}
						transition={{ type: "spring", damping: 18 }}
						style={GlobalStyles.modalContainer}
					>
						<Text style={GlobalStyles.subheading}>{title}</Text>
						<Text style={GlobalStyles.paragraph}>{description}</Text>
						<TextInput
							value={input}
							onChangeText={setInput}
							placeholder={placeholder}
							placeholderTextColor={theme.colors.placeholder}
							style={GlobalStyles.input}
						/>
						<View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
							<CustomPressable
								title='Close'
								onPress={() => setShowModal(false)}
								style={GlobalStyles.secondaryButton}
							/>
							<CustomPressable
								type='primary'
								title={buttonText}
								onPress={handleConfirm}
								style={GlobalStyles.button}
							/>
						</View>
					</MotiView>
				</MotiView>
			)}
		</AnimatePresence>
	)
}
