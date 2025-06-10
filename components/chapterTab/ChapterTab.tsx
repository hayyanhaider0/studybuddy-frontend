import { TouchableOpacity, View } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useCanvasActions } from "../../hooks/useCanvasActions"
import { getChapterTabStyles } from "../../styles/chapterTab"
import ChapterList from "./ChapterList"
import AddPageButton from "./AddPageButton"

export default function ChapterTab() {
	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
				<MaterialC name='dots-horizontal' size={24} color={theme.colors.onPrimary} />
			</TouchableOpacity>
			<ChapterList />
			<AddPageButton />
		</View>
	)
}
