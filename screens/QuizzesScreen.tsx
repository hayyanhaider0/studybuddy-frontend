/**
 * QuizzesScreen Component
 *
 * Lists all the user's quizzes in a sortable grid.
 */

import { Pressable, Text } from "react-native"
import Grid from "../features/common/components/Grid"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { useNavigation } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { QuizStackParamList } from "../navigation/QuizStackNavigator"

export default function QuizzesScreen() {
	// Get context values.
	const { quizState } = useLLMContext()

	// Theming
	const { GlobalStyles } = useThemeContext()

	// Navigation
	const nav = useNavigation<DrawerNavigationProp<QuizStackParamList>>()

	return (
		<CustomScrollView>
			<Grid
				data={quizState.quizzes.map((q, i) => (
					<Pressable
						key={i}
						onPress={() => {
							nav.navigate("quiz", { id: q.id })
						}}
					>
						<Text style={GlobalStyles.paragraph}>{q.name}</Text>
					</Pressable>
				))}
				cols={3}
			/>
		</CustomScrollView>
	)
}
