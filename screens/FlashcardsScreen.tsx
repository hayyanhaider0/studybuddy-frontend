/**
 * FlashcardsScreen Component
 *
 * Lists all the user's flashcard decks in a sortable grid.
 */

import { Pressable, Text } from "react-native"
import Grid from "../features/common/components/Grid"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { FlashcardStackParamList } from "../navigation/FlashcardStackNavigator"

export default function FlashcardsScreen() {
	// Get context values.
	const { flashcardState } = useLLMContext()

	// Theming
	const { GlobalStyles } = useThemeContext()

	// Navigation
	const nav = useNavigation<DrawerNavigationProp<FlashcardStackParamList>>()

	return (
		<CustomScrollView>
			<Grid
				data={flashcardState.flashcards.map((f, i) => (
					<Pressable
						key={i}
						onPress={() => {
							nav.navigate("flashcard", { id: f.id })
						}}
					>
						<Text style={GlobalStyles.paragraph}>{f.name}</Text>
					</Pressable>
				))}
				cols={3}
			/>
		</CustomScrollView>
	)
}
