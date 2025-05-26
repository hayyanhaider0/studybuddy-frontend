import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/Navigation"

// Navigation
export type NavProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<
	RootStackParamList,
	Screen
>

// Theming
export type ThemeColors = {
	underlay: string
	primary: string
	secondary: string
	tertiary: string
	background: string
	accent: string
	text: string
	buttonText: string
	link: string
	highlight: string
	error: string
	success: string
	warning: string
	muted: string
	divider: string
	shadow: string
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
	action: () => void
}

// Options
export type OptionType = {
	name: string
	icon: string
	action: () => void
}
