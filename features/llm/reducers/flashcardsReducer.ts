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
	flashcards: [
		{
			id: "deck-1",
			name: "Sample Flashcard Deck",
			items: [
				{
					id: "card-1",
					question: "What is the time complexity of binary search?",
					answer: "O(log n)",
					explanation:
						"Binary search halves the search space each step, leading to logarithmic growth in comparisons as input size increases.",
				},
				{
					id: "card-2",
					question: "What is React and why is it popular for UI development?",
					answer: "A JavaScript library for building component-based user interfaces.",
					explanation:
						"React promotes declarative UI creation using reusable components and a virtual DOM, improving performance and developer productivity.",
				},
				{
					id: "card-3",
					question: "What is the capital of France, and what river runs through it?",
					answer: "Paris, through which the Seine River flows.",
					explanation:
						"Paris is France’s capital and cultural hub. The Seine River divides the city into the Left and Right Banks, influencing its architecture and development.",
				},
				{
					id: "card-4",
					question: "What is the difference between HTTP and HTTPS?",
					answer: "HTTPS encrypts data using SSL/TLS, while HTTP does not.",
					explanation:
						"HTTPS ensures secure communication between client and server by encrypting transmitted data, preventing eavesdropping and tampering.",
				},
				{
					id: "card-5",
					question: "Explain the difference between stack and heap memory.",
					answer: "Stack stores static, short-lived data; heap stores dynamic, long-lived data.",
					explanation:
						"The stack handles function calls and local variables with automatic cleanup, while the heap is for objects allocated at runtime and manually freed.",
				},
			],
		},
	],
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
