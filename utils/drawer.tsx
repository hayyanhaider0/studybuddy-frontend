/**
 * drawer Util
 *
 * Contains screen config that goes in the DrawerNavigation component.
 */

import LoginScreen from "../screens/LoginScreen"
import NotebooksScreen from "../screens/NotebooksScreen"

// All screens except Canvas and Settings.
export const screens = [
	{ name: "notebooks", title: "Notebooks", icon: "notebook", component: NotebooksScreen },
	{ name: "aiNotes", title: "AI Notes", icon: "robot", component: LoginScreen },
	{ name: "flashcards", title: "Flashcards", icon: "cards-outline", component: LoginScreen },
	{ name: "quizzes", title: "Quizzes", icon: "clipboard-list-outline", component: LoginScreen },
	{ name: "exams", title: "Exams", icon: "file-document-outline", component: LoginScreen },
	{ name: "account", title: "Account", icon: "account-circle-outline", component: LoginScreen },
]
