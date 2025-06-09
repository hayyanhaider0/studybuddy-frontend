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
		}
	}

	return (
		<AnimatePresence>
			{showModal && (
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: "spring", damping: 18 }}
					style={{
						position: "absolute",
						zIndex: 100,
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#000000" + "90",
					}}
				>
					<MotiView
						from={{ translateY: 256, opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						exit={{ translateY: 128, opacity: 0 }}
						transition={{ type: "spring", damping: 18 }}
						style={{
							width: 292,
							backgroundColor: theme.colors.primary,
							alignItems: "center",
							justifyContent: "center",
							padding: 16,
							borderRadius: 28,
							gap: 16,
						}}
					>
						<Text style={GlobalStyles.subheading}>{title}</Text>
						<Text style={GlobalStyles.paragraph}>{description}</Text>
						<TextInput
							value={input}
							onChangeText={setInput}
							placeholder={placeholder}
							placeholderTextColor={theme.colors.placeholder}
							style={{
								width: "100%",
								borderRadius: 999,
								paddingHorizontal: 16,
								backgroundColor: theme.colors.secondary,
								color: theme.colors.textPrimary,
							}}
						/>
						<View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
							<CustomPressable title='Close' onPress={() => setShowModal(false)} />
							<CustomPressable type='primary' title={buttonText} onPress={handleConfirm} />
						</View>
					</MotiView>
				</MotiView>
			)}
		</AnimatePresence>
	)
}
