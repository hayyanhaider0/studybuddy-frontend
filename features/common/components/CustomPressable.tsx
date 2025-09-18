/**
 * CustomPressable Component
 *
 * This includes a custom pressable component with designing. It has options for
 * primary and secondary pressables -- primary being a gradient button and secondary
 * being a button with a line on the bottom.
 */

import { ReactNode } from "react"
import {
	ColorValue,
	Pressable,
	PressableProps,
	StyleProp,
	Text,
	View,
	ViewStyle,
} from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"

type BaseProps = {
	type: "primary" | "secondary" | "link" | "delete"
	circle?: boolean
	style?: StyleProp<ViewStyle>
	floatPos?: { top?: number; bottom?: number; left?: number; right?: number }
	disabled?: boolean
} & PressableProps

type WithTitle = {
	title: string
	children?: never
}

type WithChildren = {
	title?: never
	children: ReactNode
}

type CustomPressableProps = BaseProps & (WithTitle | WithChildren)

export default function CustomPressable({
	type,
	title,
	children,
	style,
	circle,
	floatPos,
	disabled,
	...props
}: CustomPressableProps) {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const gradientColors = {
		primary: theme.accent.gradient.colors,
		delete: ["#D31027", "#EA384D"] as [ColorValue, ColorValue, ...ColorValue[]],
		disabled: ["#A9A9A9", "#A9A9A9"] as [ColorValue, ColorValue, ...ColorValue[]],
	}

	const isGradient = type === "primary" || type === "delete"
	const isLink = type === "link"

	// Styling
	const floatStyle: ViewStyle = floatPos
		? {
				position: "absolute",
				opacity: 0.8,
				...(floatPos.top !== undefined && { top: floatPos.top }),
				...(floatPos.bottom !== undefined && { bottom: floatPos.bottom }),
				...(floatPos.left !== undefined && { left: floatPos.left }),
				...(floatPos.right !== undefined && { right: floatPos.right }),
		  }
		: {}

	const textStyle = isLink && !disabled ? GlobalStyles.link : GlobalStyles.buttonText

	const baseButtonStyle: StyleProp<ViewStyle> = [
		GlobalStyles.button,
		circle && { paddingHorizontal: 0, aspectRatio: 1 },
		style,
	]

	const secondaryStyle: StyleProp<ViewStyle> = [
		...baseButtonStyle,
		isLink ? { paddingHorizontal: 0 } : GlobalStyles.secondaryButton,
		circle && { paddingVertical: 3, paddingHorizontal: 3 },
	]

	const content = (
		<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
			{children}
			{title && <Text style={textStyle}>{title}</Text>}
		</View>
	)

	return (
		<Pressable disabled={disabled} style={[floatStyle, style]} {...props}>
			{isGradient ? (
				<LinearGradient
					colors={disabled ? gradientColors.disabled : gradientColors[type]}
					start={theme.accent.gradient.start}
					end={theme.accent.gradient.end}
					style={baseButtonStyle}
				>
					{content}
				</LinearGradient>
			) : (
				<View style={secondaryStyle}>{content}</View>
			)}
		</Pressable>
	)
}
