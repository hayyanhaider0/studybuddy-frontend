/**
 * global Types
 *
 * Contains global types used for Study Buddy.
 */

import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/Navigation"
import { ImageSourcePropType } from "react-native"
import { SkPath } from "@shopify/react-native-skia"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../navigation/DrawerNavigation"

// Navigation
export type NavProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<
	RootStackParamList,
	Screen
>

export type SidebarNavProp<Screen extends keyof DrawerParamList> = DrawerNavigationProp<
	DrawerParamList,
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
	path: SkPath
	color: string
	size: number
	strokeLinecap: "butt" | "round"
}

// Tool Types
export type ToolName = "pen" | "eraser" | "pencil" | "highlighter" | "text"

export type ToolType = {
	name: string
	icon: string
	image: ImageSourcePropType
	action: () => void
}

export type ToolSwatches = {
	[toolName in ToolName]: string[]
}

// Options
export type OptionType = {
	name: string
	icon: string
	action: () => void
}
