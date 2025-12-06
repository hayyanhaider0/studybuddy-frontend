import { Flashcards } from "../../../types/llm"

export interface FlashcardState {
	flashcards: Flashcards[]
}

export type FlashcardAction =
	| { type: "SET"; flashcards: Flashcards[] }
	| { type: "ADD"; flashcard: Flashcards }
	| { type: "UPDATE"; id: string; flashcard: Partial<Flashcards> }
	| { type: "REMOVE"; id: string }

export const FLASHCARDS_INITIAL_STATE: FlashcardState = {
	flashcards: [],
}

export default function flashcardsReducer(
	state: FlashcardState,
	action: FlashcardAction
): FlashcardState {
	switch (action.type) {
		case "SET":
			return { ...state, flashcards: action.flashcards }
		case "ADD":
			return { ...state, flashcards: [...state.flashcards, action.flashcard] }
		case "UPDATE":
			return {
				...state,
				flashcards: state.flashcards.map((f) =>
					f.id === action.id ? { ...f, ...action.flashcard } : f
				),
			}
		case "REMOVE":
			return { ...state, flashcards: state.flashcards.filter((f) => f.id !== action.id) }
		default:
			return state
	}
}
