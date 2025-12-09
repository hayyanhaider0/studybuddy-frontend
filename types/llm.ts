export interface FlashcardItem {
	id: string
	question: string
	answer: string
	explanation: string
}

export interface Flashcards {
	id: string
	name: string
	items: FlashcardItem[]
}

export interface Quiz {
	id: string
	name: string
	items: QuizItem[]
}

export interface QuizItem {
	id: string
	question: string
	options: string[]
	answer: string
	explanation: string
}
