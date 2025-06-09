import { LinearGradient } from "expo-linear-gradient"
import { Text, Pressable } from "react-native"
import { Shadow } from "react-native-shadow-2"
import { useThemeContext } from "../../contexts/ThemeContext"

type NeomorphicButtonProps = {
	title: string
	onPress: () => void
}

export default function NeuomorphicPressable({ title, onPress }: NeomorphicButtonProps) {
	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<Shadow distance={6} startColor='#373737' offset={[-3, -3]} style={{ borderRadius: 999 }}>
					<Shadow distance={6} startColor='#252525' offset={[3, 3]} style={{ borderRadius: 999 }}>
						<LinearGradient
							colors={pressed ? ["#292929", "#313131"] : ["#313131", "#292929"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 999,
							}}
						>
							<Text style={{ color: "white", paddingVertical: 12, paddingHorizontal: 24 }}>
								{title}
							</Text>
						</LinearGradient>
					</Shadow>
				</Shadow>
			)}
		</Pressable>
	)
}
