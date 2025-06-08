import { View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { TextInput } from "react-native-gesture-handler"
import CustomTouchableOpacity from "./CustomTouchableOpacity"
import { useModalContext } from "../../contexts/ModalContext"

export default function Modal() {
	const { setShowModal, title, description, placeholder, input, setInput, buttonText, onPress } =
		useModalContext()
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
		<View
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
			<View
				style={{
					width: 292,
					backgroundColor: theme.colors.primary,
					alignItems: "center",
					justifyContent: "center",
					padding: 16,
					borderRadius: 24,
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
						borderWidth: 1,
						borderColor: theme.colors.placeholder,
						color: theme.colors.textPrimary,
					}}
				/>
				<View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
					<CustomTouchableOpacity text='Close' onPress={() => setShowModal(false)} />
					<CustomTouchableOpacity text={buttonText} onPress={handleConfirm} />
				</View>
			</View>
		</View>
	)
}
