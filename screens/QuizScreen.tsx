import { Pressable, Text, View } from "react-native"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { useState } from "react"
import { RouteProp } from "@react-navigation/native"
import { QuizStackParamList } from "../navigation/QuizStackNavigator"
import CustomPressable from "../features/common/components/CustomPressable"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import CustomScrollView from "../features/common/components/CustomScrollView"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import HorizontalRule from "../features/common/components/HorizontalRule"

type QuizScreenRouteProp = RouteProp<QuizStackParamList, "quiz">

export default function QuizScreen({ route }: { route: QuizScreenRouteProp }) {
	const { id } = route.params
	const { quizState } = useLLMContext()
	const [questionIndex, setQuestionIndex] = useState<number>(0)

	const { theme, GlobalStyles } = useThemeContext()

	const quiz = quizState.quizzes.find((q) => q.id === id)
	if (!quiz) return

	const [selectedIndeces, setSelectedIndeces] = useState<number[]>(
		new Array(quiz.items.length).fill(-1)
	)

	const currentQuestion = quiz.items[questionIndex]

	const incrementQuestion = () =>
		setQuestionIndex((prev) => (prev + 1 < quiz.items.length ? prev + 1 : prev))

	const decrementQuestion = () => setQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))

	const selectOption = (index: number) => {
		setSelectedIndeces((prev) => prev.map((v, i) => (i === questionIndex ? index : v)))
	}

	const submit = () => {
		console.log("Answers:", selectedIndeces)
		let correct = 0
		selectedIndeces.forEach((selected, i) => {
			if (quiz.items[i].answer === quiz.items[i].options[selected]) correct++
		})
		console.log(correct + "/" + quiz.items.length)
		setSelectedIndeces(new Array(quiz.items.length).fill(-1))
	}

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ minHeight: "100%", gap: 8 }}>
				<Text style={[GlobalStyles.subheading, { textAlign: "left" }]}>
					Q{questionIndex + 1}) {currentQuestion.question}
				</Text>
				<HorizontalRule />
				<View style={{ gap: 8 }}>
					{currentQuestion.options.map((opt, i) => {
						return (
							<Pressable
								onPress={() => selectOption(i)}
								style={{
									flexDirection: "row",
									gap: 8,
									alignItems: "center",
									backgroundColor: i % 2 !== 0 ? theme.colors.background : theme.colors.primary,
									paddingVertical: 16,
									paddingHorizontal: 24,
									borderRadius: 999,
								}}
							>
								<MaterialC
									name={selectedIndeces[questionIndex] === i ? "radiobox-marked" : "radiobox-blank"}
									size={12}
									color={theme.colors.textPrimary}
								/>
								<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{opt}</Text>
							</Pressable>
						)
					})}
				</View>
				<View style={{ marginTop: "auto", flexDirection: "row", justifyContent: "space-between" }}>
					<CustomPressable type='secondary' title='Back' onPress={decrementQuestion} />
					{questionIndex === quiz.items.length - 1 ? (
						<CustomPressable type='primary' title='Submit' onPress={submit} />
					) : (
						<CustomPressable type='primary' title='Next' onPress={incrementQuestion} />
					)}
				</View>
			</CustomScrollView>
		</View>
	)
}
