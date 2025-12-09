/**
 * quizReducer
 *
 * Handles all quiz-related state operations.
 * It tracks the list of quizzes.
 *
 * Includes settings, adding, updating, and removing quizzes.
 */

import { Quiz } from "../../../types/llm"

export interface QuizState {
	// List of quizzes.
	quizzes: Quiz[]
}

// Initial quiz state.
export const QUIZ_INITIAL_STATE: QuizState = {
	quizzes: [],
}

// All quiz related actions.
export type QuizAction =
	| { type: "SET"; quizzes: Quiz[] }
	| { type: "ADD"; quiz: Quiz }
	| { type: "UPDATE"; id: string; quiz: Partial<Quiz> }
	| { type: "REMOVE"; id: string }

export default function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		// Set a new quiz list.
		case "SET":
			return { ...state, quizzes: action.quizzes }
		// Add a new quiz to the list.
		case "ADD":
			return { ...state, quizzes: [...state.quizzes, action.quiz] }
		// Update the a quiz in the list.
		case "UPDATE":
			return {
				...state,
				quizzes: state.quizzes.map((q) => (q.id === action.id ? { ...q, ...action.quiz } : q)),
			}
		// Remove a quiz.
		case "REMOVE":
			return { ...state, quizzes: state.quizzes.filter((q) => q.id !== action.id) }
		default:
			return state
	}
}
