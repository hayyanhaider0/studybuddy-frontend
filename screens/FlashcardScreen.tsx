import { Pressable, Text, View } from "react-native"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { useState } from "react"
import { RouteProp } from "@react-navigation/native"
import CustomPressable from "../features/common/components/CustomPressable"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { FlashcardStackParamList } from "../navigation/FlashcardStackNavigator"
import HorizontalRule from "../features/common/components/HorizontalRule"
import GradientText from "../features/common/components/GradientText"
import { MotiView } from "moti"

type FlashcardScreenRouteProp = RouteProp<FlashcardStackParamList, "flashcard">

export default function FlashcardScreen({ route }: { route: FlashcardScreenRouteProp }) {
	const { id } = route.params
	const { flashcardState } = useLLMContext()
	const [questionIndex, setQuestionIndex] = useState<number>(0)

	const { theme, GlobalStyles } = useThemeContext()

	const flashcard = flashcardState.flashcards.find((f) => f.id === id)
	const [flipped, setFlipped] = useState<boolean[]>(
		flashcard ? new Array(flashcard.items.length).fill(false) : []
	)
	if (!flashcard) return

	const currentQuestion = flashcard.items[questionIndex]

	const incrementQuestion = () =>
		setQuestionIndex((prev) => (prev + 1 < flashcard.items.length ? prev + 1 : prev))

	const decrementQuestion = () => setQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))

	const flip = () => {
		setFlipped((prev) => prev.map((isFlipped, i) => (i === questionIndex ? !isFlipped : isFlipped)))
	}

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ minHeight: "100%", gap: 32, alignItems: "center" }}>
				<Pressable onPress={flip}>
					<MotiView
						animate={{
							rotateY: flipped[questionIndex] ? "180deg" : "0deg",
						}}
						transition={{
							type: "timing",
							duration: 600,
						}}
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 32,
							padding: 24,
							width: "90%",
							gap: 16,
						}}
					>
						<MotiView
							animate={{
								rotateY: flipped[questionIndex] ? "180deg" : "0deg",
							}}
							transition={{
								type: "timing",
								duration: 600,
							}}
							style={{ gap: 8 }}
						>
							<Text style={GlobalStyles.subheading}>{currentQuestion.question}</Text>
							<MotiView animate={{ opacity: flipped[questionIndex] ? 1 : 0 }} style={{ gap: 8 }}>
								<HorizontalRule />
								<GradientText
									text={currentQuestion.answer}
									style={[GlobalStyles.subheading, { fontWeight: 100 }]}
								/>
								<HorizontalRule />
								<Text style={GlobalStyles.paragraph}>{currentQuestion.explanation}</Text>
							</MotiView>
							<Text style={[GlobalStyles.subtext, { marginTop: "auto" }]}>Tap to flip.</Text>
						</MotiView>
					</MotiView>
				</Pressable>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						width: "90%",
						marginTop: "auto",
					}}
				>
					<CustomPressable type='secondary' title='Back' onPress={decrementQuestion} />
					<Text style={GlobalStyles.paragraph}>
						{questionIndex + 1} / {flashcard.items.length}
					</Text>
					<CustomPressable type='primary' title='Next' onPress={incrementQuestion} />
				</View>
			</CustomScrollView>
		</View>
	)
}
