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
	quizzes: [
		{
			id: "1",
			name: "Quiz",
			items: [
				{
					id: "q1",
					question: "Which of the following is a JavaScript framework?",
					options: ["Laravel", "Django", "React", "Spring Boot"],
					answer: "React",
					explanation:
						"React is a popular front-end JavaScript library for building user interfaces.",
				},
				{
					id: "q2",
					question: "What does CSS stand for?",
					options: [
						"Cascading Style Sheets",
						"Creative Style System",
						"Computer Style Syntax",
						"Colorful Style Sheets",
					],
					answer: "Cascading Style Sheets",
					explanation: "CSS is used to style HTML elements on a webpage.",
				},
				{
					id: "q3",
					question: "Which HTML tag is used for inserting an image?",
					options: ["<img>", "<image>", "<picture>", "<src>"],
					answer: "<img>",
					explanation: "The <img> tag is used to embed images in HTML.",
				},
				{
					id: "q4",
					question: "Which of these is a back-end framework?",
					options: ["React", "Vue", "Django", "Angular"],
					answer: "Django",
					explanation: "Django is a Python-based back-end web framework.",
				},
			],
		},
	],
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
