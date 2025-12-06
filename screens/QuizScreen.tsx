/**
 * Quiz Screen
 *
 * This screen renders each question from the selected quiz.
 */

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
import { useModal } from "../features/common/contexts/ModalContext"
import GradientText from "../features/common/components/GradientText"
import { MotiView } from "moti"

type QuizScreenRouteProp = RouteProp<QuizStackParamList, "quiz">

export default function QuizScreen({ route }: { route: QuizScreenRouteProp }) {
	// Get context values and extract the selected quiz.
	const { id } = route.params
	const { quizState } = useLLMContext()
	const { openModal } = useModal()
	const quiz = quizState.quizzes.find((q) => q.id === id)
	if (!quiz) return

	// Theming.
	const { theme, GlobalStyles } = useThemeContext()

	const [questionIndex, setQuestionIndex] = useState<number>(0) // Tracks the selected question.
	const [selectedIndeces, setSelectedIndeces] = useState<number[]>( // Tracks the user selected options.
		new Array(quiz.items.length).fill(-1)
	)
	const [showExplanation, setShowExplanation] = useState<boolean[]>( // Tracks which answers have been revealed.
		new Array(quiz.items.length).fill(false)
	)

	const currentQuestion = quiz.items[questionIndex] // Tracks the current question.

	// Increments the question.
	const incrementQuestion = () =>
		setQuestionIndex((prev) => (prev + 1 < quiz.items.length ? prev + 1 : prev))

	// Decrements the question.
	const decrementQuestion = () => setQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))

	// Selects some option in the question.
	const selectOption = (index: number) => {
		setSelectedIndeces((prev) => prev.map((v, i) => (i === questionIndex ? index : v)))
	}

	/**
	 * Opens a modal to submit the quiz.
	 *
	 * A confirmation modal is opened which tells the user if they missed answering
	 * any questions.
	 */
	const submit = () => {
		let missing = 0 // Initialize missing answers count.
		selectedIndeces.forEach((i) => (i === -1 ? missing++ : 0)) // Track how many answers are missing.

		// Open the modal.
		openModal({
			type: "confirm",
			title: "Submit Quiz",
			description: `Are you sure you want to submit your quiz?${
				missing > 0 ? ` You did not answer ${missing} questions.` : ""
			}`,
			buttonText: "Submit",
			onSubmit: () => {
				let correct = 0 // Initialize correct answers count.
				selectedIndeces.forEach((selected, i) => {
					// Track how many answers are correct.
					if (quiz.items[i].answer === quiz.items[i].options[selected]) correct++
				})
				// LOG THE SCORE TEMP
				console.log("Score:", correct, "/", quiz.items.length)
				// Reset
				setSelectedIndeces(new Array(quiz.items.length).fill(-1))
				setShowExplanation(new Array(quiz.items.length).fill(true))
			},
		})
	}

	// Toggle answer (Reveal/Hide answer).
	const toggleAnswer = () => {
		setShowExplanation((prev) => prev.map((val, i) => (i === questionIndex ? !val : val)))
	}

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ minHeight: "100%", gap: 16 }}>
				{/* Question */}
				<Text style={[GlobalStyles.subheading, { textAlign: "left" }]}>
					{questionIndex + 1}. {currentQuestion.question}
				</Text>
				<HorizontalRule />

				{/* Options */}
				<View style={{ gap: 8 }}>
					{currentQuestion.options.map((opt, i) => {
						return (
							<Pressable
								key={i}
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
								{/* Show the selected option */}
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

				{/* Bottom Bar */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					{/* Back Button */}
					<CustomPressable type='secondary' title='Back' onPress={decrementQuestion} />

					{/* Question Tracker: current / total */}
					<Text style={GlobalStyles.paragraph}>
						{questionIndex + 1} / {quiz.items.length}
					</Text>

					{/* Next/Submit button */}
					{/* Submit button shows on the last question */}
					{questionIndex === quiz.items.length - 1 ? (
						<CustomPressable type='primary' title='Submit' onPress={submit} />
					) : (
						<CustomPressable type='primary' title='Next' onPress={incrementQuestion} />
					)}
				</View>

				{/* Reveal/Hide Answer Button */}
				<CustomPressable
					type='secondary'
					title={showExplanation[questionIndex] ? "Hide Answer" : "Reveal Answer"}
					onPress={toggleAnswer}
					style={{
						marginTop: "auto",
						marginBottom: 8,
					}}
				/>

				{/* Answer and Explanation */}
				{/* Only appears when the user reveals an answer. */}
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: showExplanation[questionIndex] ? 1 : 0 }}
					exit={{ opacity: 0 }}
					style={{ gap: 16, marginBottom: 8 }}
				>
					<HorizontalRule />

					{/* Answer */}
					<GradientText text={currentQuestion.answer} style={GlobalStyles.subheading} />

					{/* Explanation */}
					<Text style={GlobalStyles.paragraph}>{currentQuestion.explanation}</Text>
					<HorizontalRule />
				</MotiView>
			</CustomScrollView>
		</View>
	)
}
