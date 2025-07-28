import { Text, View } from "react-native"
import Grid from "../components/common/Grid"
import { useThemeContext } from "../contexts/ThemeContext"
import CustomScrollView from "../components/common/CustomScrollView"

export default function AINotesScreen() {
	const { GlobalStyles } = useThemeContext()

	const notes = [{ text: "Notes 1" }, { text: "Notes 2" }]

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
