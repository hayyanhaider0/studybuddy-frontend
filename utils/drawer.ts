/**
 * drawer Util
 *
 * Contains screen config that goes in the DrawerNavigation component.
 */

import AccountScreen from "../screens/AccountScreen"
import AINotesScreen from "../screens/AINotesScreen"
import ExamsScreen from "../screens/ExamsScreen"
import FlashcardsScreen from "../screens/FlashcardsScreen"
import NotebooksScreen from "../screens/NotebooksScreen"
import QuizzesScreen from "../screens/QuizzesScreen"

// All screens except Canvas and Settings.
export const SCREENS = [
	{
		name: "notebooks",
		title: "Notebooks",
		icon: "notebook",
		component: NotebooksScreen,
		sort: true,
	},
	{
		name: "aiNotes",
		title: "AI Notes",
		icon: "robot",
		component: AINotesScreen,
		sort: true,
	},
	{
		name: "flashcards",
		title: "Flashcards",
		icon: "cards-outline",
		component: FlashcardsScreen,
		sort: true,
	},
	{
		name: "quizzes",
		title: "Quizzes",
		icon: "clipboard-list-outline",
		component: QuizzesScreen,
		sort: true,
	},
	{
		name: "exams",
		title: "Exams",
		icon: "file-document-outline",
		component: ExamsScreen,
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
