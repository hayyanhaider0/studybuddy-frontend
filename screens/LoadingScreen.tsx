import { View } from "react-native"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import LoadingSpinner from "../features/common/components/LoadingSpinner"

export default function LoadingScreen() {
	const { GlobalStyles } = useThemeContext()

	return (
		<View style={GlobalStyles.container}>
			<LoadingSpinner />
		</View>
	)
}
