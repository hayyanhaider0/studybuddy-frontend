/**
 * global Types
 *
 * Contains global types used for Study Buddy.
 */

import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/Navigation"
import { ImageSourcePropType } from "react-native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../navigation/DrawerNavigation"
import { BrushType } from "../features/drawing/types/DrawingTypes"

// Api
export interface ApiResponse<T> {
	success: boolean
	data: T | null
	error: string | null
	message: string
}

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
// Tool Types
export type ToolType = {
	name: string
	icon: string
	image: ImageSourcePropType
	action: () => void
}

export type ToolSwatches = {
	[toolName in BrushType]: string[]
}

// Options
export type OptionType = {
	name: string
	icon: string
	action: () => void
	disabled?: boolean
}

// Sorting

// All different sorting types.
export type SortType = "name" | "updated" | "created"
export type SortOrder = boolean // true = ascending, false = descending

export type SortState = {
	type: SortType
	ascending: SortOrder
}

export type SortMap = {
	notebooks: SortState
	aiNotes: SortState
	flashcards: SortState
	quizzes: SortState
	exams: SortState
}

// Context Menu options
export type ContextMenuOptionType = {
	label: string
	onPress: () => void
}

// Settings Types
export type SettingsOptionsType = {
	name: string
	description?: string
	onPress: () => void
	switch?: boolean
}

export type SettingsType = {
	name: string
	options: SettingsOptionsType[]
}[]
