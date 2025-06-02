import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function Handle({ close }: { close: () => void }) {
	const { theme } = useThemeContext()

	const closeGesture = Gesture.Pan()
		.onUpdate((e) => {
			e.translationY > 0 && close()
		})
		.runOnJS(true)

	return (
		<GestureDetector gesture={closeGesture}>
			<View
				style={{
					position: "absolute",
					top: -22,
					width: 200,
					height: 20,
					alignSelf: "center",
					justifyContent: "center",
				}}
			>
				<View
					style={{
						width: "100%",
						height: 8,
						backgroundColor: theme.colors.primary,
						opacity: 0.5,
						borderRadius: 999,
					}}
				/>
			</View>
		</GestureDetector>
	)
}
