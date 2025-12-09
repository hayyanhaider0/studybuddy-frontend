/**
 * flashcardsReducer
 *
 * Handles all flashcard-related state operations.
 * It tracks the list of flashcard decks.
 *
 * Includes settings, adding, updating, and removing flashcards.
 */
import { Flashcards } from "../../../types/llm"

export interface FlashcardState {
	// List of flashcards.
	flashcards: Flashcards[]
}

// Initial flashcards.
export const FLASHCARDS_INITIAL_STATE: FlashcardState = {
	flashcards: [],
}

// All possible actions for flashcards.
export type FlashcardAction =
	| { type: "SET"; flashcards: Flashcards[] }
	| { type: "ADD"; flashcard: Flashcards }
	| { type: "UPDATE"; id: string; flashcard: Partial<Flashcards> }
	| { type: "REMOVE"; id: string }

// Reducer function for managing flashcard state.
export default function flashcardsReducer(
	state: FlashcardState,
	action: FlashcardAction
): FlashcardState {
	switch (action.type) {
		// Set a new deck of flashcards.
		case "SET":
			return { ...state, flashcards: action.flashcards }
		// Add a new deck of flashcards.
		case "ADD":
			return { ...state, flashcards: [...state.flashcards, action.flashcard] }
		// Update flashcards.
		case "UPDATE":
			return {
				...state,
				flashcards: state.flashcards.map((f) =>
					f.id === action.id ? { ...f, ...action.flashcard } : f
				),
			}
		// Remove a deck of flashcards.
		case "REMOVE":
			return { ...state, flashcards: state.flashcards.filter((f) => f.id !== action.id) }
		default:
			return state
	}
}
