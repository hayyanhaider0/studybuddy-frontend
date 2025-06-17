/**
 * CustomPressable Component
 *
 * This includes a custom pressable component with designing. It has options for
 * primary and secondary pressables -- primary being a gradient button and secondary
 * being a button with a line on the bottom.
 */

import { LinearGradient } from "expo-linear-gradient"
import { Text, Pressable, StyleProp, ViewStyle, ColorValue } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { MotiView } from "moti"
import { getGlobalStyles } from "../../styles/global"
import { ReactNode } from "react"

type BaseProps = {
	type?: "primary" | "secondary" | "delete"
	onPress: () => void
	onLongPress?: () => void
	style?: StyleProp<ViewStyle>
}

type WithTitle = BaseProps & {
	title: string
	children?: never
}

type WithChildren = BaseProps & {
	title?: never
	children: ReactNode
}

type CustomPressableProps = WithTitle | WithChildren

export default function CustomPressable({
	type = "secondary",
	title,
	onPress,
	onLongPress,
	style,
	children,
}: CustomPressableProps) {
	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const colors =
		type === "primary"
			? theme.accent.gradient.colors
			: (["#D31027", "#EA384D"] as [ColorValue, ColorValue, ...ColorValue[]])

	return (
		<Pressable onPress={onPress} onLongPress={onLongPress}>
			{({ pressed }) => (
				// Animated button that scales and bounces up on press.
				<MotiView
					from={{ scale: 1, opacity: 1, translateY: 0 }}
					animate={{
						scale: pressed ? 0.97 : 1,
						opacity: pressed ? 0.9 : 1,
					}}
					transition={{
						type: "timing",
						duration: 120,
					}}
					style={type === "secondary" && style}
				>
					{/* Primary Button -- with a gradient */}
					{type !== "secondary" ? (
						<LinearGradient
							colors={colors}
							start={theme.accent.gradient.start}
							end={theme.accent.gradient.end}
							style={style}
						>
							{children && children}
							{title && <Text style={GlobalStyles.buttonText}>{title}</Text>}
						</LinearGradient>
					) : (
						// Secondary Button -- with an underline.
						<>
							{children && children}
							{title && <Text style={GlobalStyles.buttonText}>{title}</Text>}
						</>
					)}
				</MotiView>
			)}
		</Pressable>
	)
}
