type Notes = {}

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
