/**
 * LLMSetting Component
 *
 * Renders a single LLM settings group (Notes, Flashcards, Quizzes, Exams)
 * with expandable sections and options.
 */

import { View, Text, Pressable } from "react-native"
import { useState } from "react"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import HorizontalRule from "../../common/components/HorizontalRule"
import { llmSection } from "../../../utils/llmOptions"
import { useLLMContext } from "../contexts/LLMContext"
import LLMSettingOption from "./LLMSettingOption"

interface LLMSettingProps {
	type: "notes" | "flashcards" | "quiz" | "exam"
	sections: llmSection[]
}

export default function LLMSetting({ type, sections }: LLMSettingProps) {
	const { theme, GlobalStyles } = useThemeContext()
	const { updateOption } = useLLMContext()

	// Local state to track expanded sections
	const [expandedSections, setExpandedSections] = useState<boolean[]>(
		sections.map((s) => s.expanded)
	)

	const toggleSection = (index: number) => {
		setExpandedSections((prev) => prev.map((val, i) => (i === index ? !val : val)))
	}

	return (
		<View style={{ gap: 8 }}>
			{sections.map((section, sectionIndex) => (
				<View key={section.title} style={{ gap: 8 }}>
					<HorizontalRule />
					{/* Section Header */}
					<Pressable
						onPress={() => toggleSection(sectionIndex)}
						style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
					>
						<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>{section.title}</Text>
						<MaterialC
							name={expandedSections[sectionIndex] ? "chevron-up" : "chevron-down"}
							size={24}
							color={theme.colors.textPrimary}
						/>
					</Pressable>

					{/* Section Options */}
					{expandedSections[sectionIndex] &&
						section.options.map((option, optionIndex) => (
							<LLMSettingOption
								key={option.label}
								settingTitle={section.title}
								option={option}
								onChange={(value: string | boolean) =>
									updateOption(type, sectionIndex, optionIndex, value)
								}
							/>
						))}
				</View>
			))}
		</View>
	)
}
