/**
 * drawer Util
 *
 * Contains screen config that goes in the DrawerNavigation component.
 */

import FlashcardStackNavigator from "../navigation/FlashcardStackNavigator"
import QuizStackNavigator from "../navigation/QuizStackNavigator"
import AccountScreen from "../screens/AccountScreen"
import AINotesScreen from "../screens/AINotesScreen"
import ExamsScreen from "../screens/ExamsScreen"
import NotebooksScreen from "../screens/NotebooksScreen"

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
		component: FlashcardStackNavigator,
		sort: true,
	},
	{
		name: "quizzes",
		title: "Quizzes",
		icon: "clipboard-list-outline",
		component: QuizStackNavigator,
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
