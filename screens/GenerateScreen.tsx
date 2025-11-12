/**
 * GenerateScreen Component
 *
 * Generic screen used for LLM features (notes, flashcards, quizzes, exams).
 */

import { Text, View } from "react-native"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import ChapterSelector from "../features/llm/components/ChapterSelector"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { capitalize } from "../utils/formatters"
import CustomPressable from "../features/common/components/CustomPressable"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { llmSettingsGroup } from "../utils/llmOptions"
import LLMSetting from "../features/llm/components/LLMSetting"

export default function GenerateScreen() {
	// All available settings.
	const { settings } = useLLMContext()

	const route = useRoute<RouteProp<RootStackParamList, "generate">>()
	const taskType = route.params?.taskType || "Error in GenerateScreen"
	const notebookName = route.params?.notebookName || "Error in GenerateScreen"

	// Theming
	const { GlobalStyles } = useThemeContext()

	const handleGenerate = () => {
		console.log(JSON.stringify(getFlatJSON(), null, 2))
	}

	const getFlatJSON = () => {
		const group = settings.find((g) => g.type === taskType)
		if (!group) return {}

		const output: Record<string, string | boolean> = {}

		group.sections.forEach((section) => {
			section.options.forEach((opt) => {
				output[opt.label] = opt.selectedValue
			})
		})

		return output
	}

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ gap: 8 }}>
				<View style={{ gap: 16 }}>
					{/* Title for generating */}
					<Text style={GlobalStyles.subheading}>
						Generate {capitalize(taskType)} for '{notebookName}'
					</Text>

					{/* Button to generate */}
					<CustomPressable type='primary' title='Generate' onPress={() => handleGenerate()} />

					{/* Chapter Selection */}
					<Text style={GlobalStyles.paragraph}>Select chapters to generate {taskType} for.</Text>
					<ChapterSelector />
				</View>

				{/* LLM Settings */}
				{settings
					.filter((g: llmSettingsGroup) => g.type === taskType)
					.map((group: llmSettingsGroup, i) => (
						<LLMSetting key={i} type={group.type} sections={group.sections} />
					))}
			</CustomScrollView>
		</View>
	)
}
