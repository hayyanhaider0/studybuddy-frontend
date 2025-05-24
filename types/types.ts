import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/Navigation"

// Navigation
export type NavProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<
	RootStackParamList,
	Screen
>

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
