import { createContext, ReactNode, useContext, useReducer } from "react"
import quizReducer, { QUIZ_INITIAL_STATE, QuizAction, QuizState } from "../reducers/quizReducer"

interface LLMContextType {
	quizState: QuizState
	quizDispatch: React.ActionDispatch<[action: QuizAction]>
}

const LLMContext = createContext<LLMContextType | null>(null)

export const LLMProvider = ({ children }: { children: ReactNode }) => {
	const [quizState, quizDispatch] = useReducer(quizReducer, QUIZ_INITIAL_STATE)

	return <LLMContext.Provider value={{ quizState, quizDispatch }}>{children}</LLMContext.Provider>
}

export const useLLMContext = () => {
	const ctx = useContext(LLMContext)
	if (!ctx) throw new Error("useLLMContext must be used within an LLMProvider")
	return ctx
}
