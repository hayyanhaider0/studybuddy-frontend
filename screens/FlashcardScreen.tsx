/**
 * FlashcardScreen Component
 *
 * This screen renders each flashcard from the selected deck.
 */

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
	// Get context values and extract the current flashcard deck.
	const { id } = route.params
	const { flashcardState } = useLLMContext()
	const flashcard = flashcardState.flashcards.find((f) => f.id === id)

	const [questionIndex, setQuestionIndex] = useState<number>(0) // Tracks the question index.
	const [flipped, setFlipped] = useState<boolean[]>( // Tracks which of the cards are flipped.
		flashcard ? new Array(flashcard.items.length).fill(false) : []
	)
	if (!flashcard) return

	// Theming.
	const { theme, GlobalStyles } = useThemeContext()

	const currentQuestion = flashcard.items[questionIndex] // Tracks the current question.

	// Increments the question.
	const incrementQuestion = () =>
		setQuestionIndex((prev) => (prev + 1 < flashcard.items.length ? prev + 1 : prev))

	// Decrements the question.
	const decrementQuestion = () => setQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev))

	// Flips the flashcard.
	const flip = () => {
		setFlipped((prev) => prev.map((isFlipped, i) => (i === questionIndex ? !isFlipped : isFlipped)))
	}

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ minHeight: "100%", gap: 32, alignItems: "center" }}>
				<Pressable onPress={flip}>
					{/* Flashcard Background */}
					<MotiView
						animate={{ rotateY: flipped[questionIndex] ? "180deg" : "0deg" }}
						transition={{ type: "timing", duration: 600 }}
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 32,
							padding: 24,
							width: "90%",
							gap: 16,
						}}
					>
						{/* Card Inner Details */}
						<MotiView
							animate={{ rotateY: flipped[questionIndex] ? "180deg" : "0deg" }}
							transition={{ type: "timing", duration: 600 }}
							style={{ gap: 8 }}
						>
							{/* Current Question */}
							<Text style={GlobalStyles.subheading}>{currentQuestion.question}</Text>

							{/* Flipped Details */}
							<MotiView animate={{ opacity: flipped[questionIndex] ? 1 : 0 }} style={{ gap: 8 }}>
								<HorizontalRule />
								{/* Answer */}
								<GradientText
									text={currentQuestion.answer}
									style={[GlobalStyles.subheading, { fontWeight: 100 }]}
								/>
								<HorizontalRule />
								{/* Explanation */}
								<Text style={GlobalStyles.paragraph}>{currentQuestion.explanation}</Text>
							</MotiView>

							{/* Hint telling the user to tap the card to flip. */}
							<Text style={[GlobalStyles.subtext, { marginTop: "auto" }]}>Tap to flip.</Text>
						</MotiView>
					</MotiView>
				</Pressable>

				{/* Bottom Bar */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						width: "90%",
						marginTop: "auto",
					}}
				>
					{/* Back Button */}
					<CustomPressable type='secondary' title='Back' onPress={decrementQuestion} />

					{/* Question Tracker: current / total */}
					<Text style={GlobalStyles.paragraph}>
						{questionIndex + 1} / {flashcard.items.length}
					</Text>

					{/* Next Button */}
					<CustomPressable type='primary' title='Next' onPress={incrementQuestion} />
				</View>
			</CustomScrollView>
		</View>
	)
}
