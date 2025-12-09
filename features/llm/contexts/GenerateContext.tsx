/**
 * LLMContext Component
 *
 * Provides shared state for LLM options.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { DEFAULT_LLM_SETTINGS, llmSettingsGroup } from "../../../utils/llmOptions"

interface GenerateContextType {
	// User selected settings.
	settings: llmSettingsGroup[]
	// Update an option within a settings group.
	updateOption: (
		groupType: "notes" | "flashcards" | "quiz" | "exam",
		sectionIndex: number,
		optionIndex: number,
		value: string | boolean
	) => void
	// Selected chapters from the ChapterSelector component.
	// Holds chapter IDs.
	selectedChapters: string[]
	// Setter for the selected chapters.
	setSelectedChapters: React.Dispatch<React.SetStateAction<string[]>>
}

// React context for LLM options.
export const GenerateContext = createContext<GenerateContextType | null>(null)

/**
 * Wraps children components, providing LLM option values via context.
 *
 * @param children - Components that require access to canvas state values.
 */
export const GenerateProvider = ({ children }: { children: ReactNode }) => {
	// Settings for the selected task type.
	const [settings, setSettings] = useState<llmSettingsGroup[]>(DEFAULT_LLM_SETTINGS)
	// Chapters selected through the ChapterSelector component.
	const [selectedChapters, setSelectedChapters] = useState<string[]>([])

	/**
	 * Updates an option within an LLM settings group.
	 * e.g. updating "Detail Level" while generating Notes.
	 *
	 * @param groupType - Settings group (one of notes, flashcards, quiz, exam)/
	 * @param sectionIndex - Index of one of the three sections in each settings group i.e. Basic, Personalize, Advanced.
	 * @param optionIndex - Index of the option to update.
	 * @param value - Value to set for the option.
	 */
	const updateOption: GenerateContextType["updateOption"] = (
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

	return (
		<GenerateContext.Provider
			value={{ settings, updateOption, selectedChapters, setSelectedChapters }}
		>
			{children}
		</GenerateContext.Provider>
	)
}

/**
 * Custom hook for accessing LLM option shared values.
 *
 * @throws Error if used outside of LLMProvider.
 * @returns LLMContext providing shared values.
 */
export const useGenerate = () => {
	const ctx = useContext(GenerateContext)
	if (!ctx) throw new Error("useLLMContext must be used within an LLMProvider")
	return ctx
}
