import { createContext, ReactNode, useContext, useState } from "react"
import { DEFAULT_LLM_SETTINGS, llmSettingsGroup } from "../../../utils/llmOptions"

interface LLMContextType {
	settings: llmSettingsGroup[]
	updateOption: (
		groupType: "notes" | "flashcards" | "quiz" | "exam",
		sectionIndex: number,
		optionIndex: number,
		value: string | boolean
	) => void
}

export const LLMContext = createContext<LLMContextType | null>(null)

export const LLMProvider = ({ children }: { children: ReactNode }) => {
	const [settings, setSettings] = useState<llmSettingsGroup[]>(DEFAULT_LLM_SETTINGS)

	const updateOption: LLMContextType["updateOption"] = (
		groupType,
		sectionIndex,
		optionIndex,
		value
	) => {
		setSettings((prev) =>
			prev.map((g) =>
				g.type === groupType
					? {
							...g,
							sections: g.sections.map((sec, si) =>
								si === sectionIndex
									? {
											...sec,
											options: sec.options.map((opt, oi) =>
												oi === optionIndex ? { ...opt, selectedValue: value } : opt
											),
									  }
									: sec
							),
					  }
					: g
			)
		)
	}

	return <LLMContext.Provider value={{ settings, updateOption }}>{children}</LLMContext.Provider>
}

export const useLLMContext = () => {
	const ctx = useContext(LLMContext)
	if (!ctx) throw new Error("useLLMContext must be used within an LLMProvider")
	return ctx
}
