import { Quiz } from "../../../types/llm"

// reducers/quizReducer.ts
export interface QuizState {
	quizzes: Quiz[]
}

export type QuizAction =
	| { type: "SET"; quizzes: Quiz[] }
	| { type: "ADD"; quiz: Quiz }
	| { type: "UPDATE"; id: string; quiz: Partial<Quiz> }
	| { type: "REMOVE"; id: string }

export const QUIZ_INITIAL_STATE: QuizState = {
	quizzes: [],
}

export default function quizReducer(state: QuizState, action: QuizAction): QuizState {
	switch (action.type) {
		case "SET":
			return { ...state, quizzes: action.quizzes }
		case "ADD":
			return { ...state, quizzes: [...state.quizzes, action.quiz] }
		case "UPDATE":
			return {
				...state,
				quizzes: state.quizzes.map((q) => (q.id === action.id ? { ...q, ...action.quiz } : q)),
			}
		case "REMOVE":
			return { ...state, quizzes: state.quizzes.filter((q) => q.id !== action.id) }
		default:
			return state
	}
}
