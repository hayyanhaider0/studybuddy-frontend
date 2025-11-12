export interface llmOption {
	label: string
	selectedValue: string | boolean
	values?: string[]
}

export interface llmSection {
	title: string
	expanded: boolean
	options: llmOption[]
}

export interface llmSettingsGroup {
	type: "notes" | "flashcards" | "quizzes" | "exams"
	sections: llmSection[]
}

export const NOTES_SETTINGS: llmSection[] = [
	{
		title: "Basic",
		expanded: true,
		options: [
			{ label: "Detail Level", selectedValue: "Normal", values: ["Minimal", "Normal", "Detailed"] },
			{ label: "Tone", selectedValue: "Academic", values: ["Academic", "Casual"] },
		],
	},
	{
		title: "Personalization",
		expanded: false,
		options: [
			{ label: "Learning Goal", selectedValue: "Understanding", values: ["Revision", "Exam Prep"] },
			{ label: "Add Visuals", selectedValue: true },
		],
	},
	{
		title: "Advanced",
		expanded: false,
		options: [
			{ label: "Include References", selectedValue: true },
			{ label: "Note Style", selectedValue: "Cornell Notes", values: ["Cornell Notes", "Outline"] },
		],
	},
]

export const FLASHCARDS_SETTINGS: llmSection[] = [
	{
		title: "Basic",
		expanded: true,
		options: [
			{ label: "Card Type", selectedValue: "Q&A", values: ["Q&A", "Fill-in", "Multiple Choice"] },
			{ label: "Number of Cards", selectedValue: "20", values: ["10", "20", "50"] },
		],
	},
	{
		title: "Personalization",
		expanded: false,
		options: [
			{
				label: "Focus Area",
				selectedValue: "Mixed",
				values: ["Theoretical", "Practical", "Mixed"],
			},
		],
	},
	{
		title: "Advanced",
		expanded: false,
		options: [
			{ label: "Include Examples", selectedValue: true },
			{ label: "Shuffle Cards", selectedValue: true },
		],
	},
]

export const QUIZZES_SETTINGS: llmSection[] = [
	{
		title: "Basic",
		expanded: true,
		options: [
			{ label: "Number of Questions", selectedValue: "10", values: ["5", "10", "20"] },
			{ label: "Difficulty", selectedValue: "Medium", values: ["Easy", "Medium", "Hard"] },
		],
	},
	{
		title: "Personalization",
		expanded: false,
		options: [
			{
				label: "Focus Area",
				selectedValue: "Mixed",
				values: ["Theoretical", "Practical", "Mixed"],
			},
		],
	},
	{
		title: "Advanced",
		expanded: false,
		options: [
			{ label: "Include Answers", selectedValue: true },
			{ label: "Time Limit", selectedValue: "None", values: ["None", "5min", "10min"] },
		],
	},
]

export const EXAMS_SETTINGS: llmSection[] = [
	{
		title: "Basic",
		expanded: true,
		options: [
			{ label: "Number of Questions", selectedValue: "50", values: ["20", "50", "100"] },
			{ label: "Difficulty", selectedValue: "Hard", values: ["Medium", "Hard", "Very Hard"] },
		],
	},
	{
		title: "Personalization",
		expanded: false,
		options: [
			{
				label: "Focus Area",
				selectedValue: "Mixed",
				values: ["Theoretical", "Practical", "Mixed"],
			},
		],
	},
	{
		title: "Advanced",
		expanded: false,
		options: [
			{ label: "Include Answers", selectedValue: false },
			{ label: "Include Explanations", selectedValue: true },
		],
	},
]

// Combine all LLM types
export const DEFAULT_LLM_SETTINGS: llmSettingsGroup[] = [
	{ type: "notes", sections: NOTES_SETTINGS },
	{ type: "flashcards", sections: FLASHCARDS_SETTINGS },
	{ type: "quizzes", sections: QUIZZES_SETTINGS },
	{ type: "exams", sections: EXAMS_SETTINGS },
]
