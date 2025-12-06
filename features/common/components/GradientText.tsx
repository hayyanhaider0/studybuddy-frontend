import { StyleProp, Text, TextStyle } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"

type GradientTextProps = {
	text: string
	style?: StyleProp<TextStyle>
}

export default function GradientText({ text, style }: GradientTextProps) {
	const { theme } = useThemeContext()
	const gradient = theme.accent.gradient

	return (
		<MaskedView
			maskElement={<Text style={[style, { backgroundColor: "transparent" }]}>{text}</Text>}
		>
			<LinearGradient colors={gradient.colors} start={gradient.start} end={gradient.end}>
				<Text style={[style, { opacity: 0 }]}>{text}</Text>
			</LinearGradient>
		</MaskedView>
	)
}
