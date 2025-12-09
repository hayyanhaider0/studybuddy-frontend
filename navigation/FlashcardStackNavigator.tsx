import { createNativeStackNavigator } from "@react-navigation/native-stack"
import FlashcardScreen from "../screens/FlashcardScreen"
import FlashcardsScreen from "../screens/FlashcardsScreen"

export type FlashcardStackParamList = {
	flashcardsList: undefined
	flashcard: { id: string }
}

const FlashcardsStack = createNativeStackNavigator<FlashcardStackParamList>()

export default function FlashcardStackNavigator() {
	return (
		<FlashcardsStack.Navigator initialRouteName='flashcardsList'>
			<FlashcardsStack.Screen
				name='flashcardsList'
				component={FlashcardsScreen}
				options={{ headerShown: false }}
			/>
			<FlashcardsStack.Screen
				name='flashcard'
				component={FlashcardScreen}
				options={{ headerShown: false }}
			/>
		</FlashcardsStack.Navigator>
	)
}
