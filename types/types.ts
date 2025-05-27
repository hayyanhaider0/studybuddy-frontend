import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/Navigation"
import { ImageSourcePropType } from "react-native"

// Navigation
export type NavProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<
	RootStackParamList,
	Screen
>

// Theming
export type ThemeColors = {
	primary: string
	secondary: string
	tertiary: string
	surface: string
	background: string
	textPrimary: string
	textSecondary: string
	error: string
	placeholder: string
	link: string
	onPrimary: string
	onSecondary: string
}

/**
 * Canvas Types
 */

// Path
export type PathType = {
	d: string
	color: string
	sw: number
}

// Tool Types
export type ToolName = "pen" | "eraser" | "pencil" | "highlighter" | "text"

export type ToolType = {
	name: string
	icon: string
	image: ImageSourcePropType
	action: () => void
}

// Options
export type OptionType = {
	name: string
	icon: string
	action: () => void
}
