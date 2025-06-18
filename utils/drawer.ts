/**
 * drawer Util
 *
 * Contains screen config that goes in the DrawerNavigation component.
 */

import AccountScreen from "../screens/AccountScreen"
import LoginScreen from "../screens/LoginScreen"
import NotebooksScreen from "../screens/NotebooksScreen"

// All screens except Canvas and Settings.
export const screens = [
	{
		name: "notebooks",
		title: "Notebooks",
		icon: "notebook",
		component: NotebooksScreen,
		sort: true,
	},
	{ name: "aiNotes", title: "AI Notes", icon: "robot", component: LoginScreen, sort: true },
	{
		name: "flashcards",
		title: "Flashcards",
		icon: "cards-outline",
		component: LoginScreen,
		sort: true,
	},
	{
		name: "quizzes",
		title: "Quizzes",
		icon: "clipboard-list-outline",
		component: LoginScreen,
		sort: true,
	},
	{
		name: "exams",
		title: "Exams",
		icon: "file-document-outline",
		component: LoginScreen,
		sort: true,
	},
	{
		name: "account",
		title: "Account",
		icon: "account-circle-outline",
		component: AccountScreen,
		sort: false,
	},
]
