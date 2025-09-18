import { Text, View } from "react-native"
import Grid from "../features/common/components/Grid"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import CustomScrollView from "../features/common/components/CustomScrollView"

export default function ExamsScreen() {
	const { GlobalStyles } = useThemeContext()

	const notes = [{ text: "Exam 1" }, { text: "Exam 2" }]

	return (
		<CustomScrollView>
			<Grid
				data={notes.map((n, i) => (
					<View key={i}>
						<Text style={GlobalStyles.paragraph}>{n.text}</Text>
					</View>
				))}
				cols={3}
			/>
		</CustomScrollView>
	)
}
