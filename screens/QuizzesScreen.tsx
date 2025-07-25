import { ScrollView, Text, View } from "react-native"
import Grid from "../components/common/Grid"
import { useThemeContext } from "../contexts/ThemeContext"

export default function QuizzesScreen() {
	const { GlobalStyles } = useThemeContext()

	const notes = [{ text: "Quiz 1" }, { text: "Quiz 2" }]

	return (
		<ScrollView style={GlobalStyles.container} keyboardShouldPersistTaps='handled'>
			<Grid
				data={notes.map((n, i) => (
					<View key={i}>
						<Text style={GlobalStyles.paragraph}>{n.text}</Text>
					</View>
				))}
				cols={3}
			/>
		</ScrollView>
	)
}
