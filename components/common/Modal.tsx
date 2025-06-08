import { View, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { TextInput } from "react-native-gesture-handler"
import CustomTouchableOpacity from "./CustomTouchableOpacity"
import { useModalContext } from "../../contexts/ModalContext"
import { opacity } from "react-native-reanimated/lib/typescript/Colors"

type ModalProps = {
	title: string
	description: string
	placeholder: string
	onPress: () => void
}

export default function Modal({ title, description, placeholder, onPress }: ModalProps) {
	const { setShowModal } = useModalContext()
	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

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
					gap: 8,
				}}
			>
				<Text style={GlobalStyles.subheading}>{title}</Text>
				<Text style={GlobalStyles.paragraph}>{description}</Text>
				<TextInput placeholder={placeholder} style={{ backgroundColor: "red", width: "100%" }} />
				<View style={{ flexDirection: "row", gap: 8 }}>
					<CustomTouchableOpacity text='Cancel' onPress={() => setShowModal(false)} />
					<CustomTouchableOpacity text='Add Chapter' onPress={() => onPress()} />
				</View>
			</View>
		</View>
	)
}
