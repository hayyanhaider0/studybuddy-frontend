import { createNativeStackNavigator } from "@react-navigation/native-stack"
import QuizzesScreen from "../screens/QuizzesScreen"
import QuizScreen from "../screens/QuizScreen"

export type QuizStackParamList = {
	quizzesList: undefined
	quiz: { id: string }
}

const QuizStack = createNativeStackNavigator<QuizStackParamList>()

export default function QuizStackNavigator() {
	return (
		<QuizStack.Navigator initialRouteName='quizzesList'>
			<QuizStack.Screen
				name='quizzesList'
				component={QuizzesScreen}
				options={{ headerShown: false }}
			/>
			<QuizStack.Screen name='quiz' component={QuizScreen} options={{ headerShown: false }} />
		</QuizStack.Navigator>
	)
}
