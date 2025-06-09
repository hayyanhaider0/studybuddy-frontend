/**
 * CustomPressable Component
 *
 * This includes a custom pressable component with designing. It has options for
 * primary and secondary pressables -- primary being a gradient button and secondary
 * being a button with a line on the bottom.
 */

import { LinearGradient } from "expo-linear-gradient"
import { Text, Pressable } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { MotiView } from "moti"

type CustomPressableProps = {
	type?: "primary" | "secondary" // Defaults to secondary if type is not provided.
	title: string
	onPress: () => void
}

export default function CustomPressable({
	type = "secondary",
	title,
	onPress,
}: CustomPressableProps) {
	// Theming
	const { theme } = useThemeContext()

	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				// Animated button that scales and bounces up on press.
				<MotiView
					from={{ scale: 1, opacity: 1, translateY: 0 }}
					animate={{
						scale: pressed ? 0.97 : 1,
						opacity: pressed ? 0.9 : 1,
						translateY: pressed ? 2 : 0,
					}}
					transition={{
						type: "timing",
						duration: 120,
					}}
				>
					{/* Primary Button -- with a gradient */}
					{type === "primary" ? (
						<LinearGradient
							colors={theme.accent.gradient.colors}
							start={theme.accent.gradient.start}
							end={theme.accent.gradient.end}
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 999,
							}}
						>
							<Text
								style={{
									color: theme.colors.textPrimary,
									paddingVertical: 12,
									paddingHorizontal: 24,
								}}
							>
								{title}
							</Text>
						</LinearGradient>
					) : (
						// Secondary Button -- with an underline.
						<Text
							style={{
								color: theme.colors.onPrimary,
								borderBottomWidth: 1,
								paddingVertical: 12,
								paddingHorizontal: 24,
								marginHorizontal: 12,
								borderColor: theme.colors.onPrimary,
							}}
						>
							{title}
						</Text>
					)}
				</MotiView>
			)}
		</Pressable>
	)
}
