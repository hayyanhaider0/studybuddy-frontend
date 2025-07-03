import { ScrollView, Text, View } from "react-native"
import Grid from "../components/common/Grid"
import { useThemeContext } from "../contexts/ThemeContext"

export default function ExamsScreen() {
	const { GlobalStyles } = useThemeContext()

	const notes = [{ text: "Exam 1" }, { text: "Exam 2" }]

	return (
		<ScrollView style={GlobalStyles.container}>
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
