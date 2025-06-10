import {
	Button,
	SafeAreaView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native"
import { FlatList, Pressable } from "react-native-gesture-handler"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import Material from "react-native-vector-icons/MaterialIcons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useState } from "react"
import { AnimatePresence, MotiView } from "moti"
import { useCanvasActions } from "../../hooks/useCanvasActions"
import { useModal } from "../../contexts/ModalContext"
import { LinearGradient } from "expo-linear-gradient"
import { useNotebook } from "../../contexts/NotebookContext"
import { addChapter } from "../../utils/notebook"
import { getChapterTabStyles } from "../../styles/chapterTab"
import Pagination from "./Pagination"
import ChapterList from "./ChapterList"

export default function ChapterTab() {
	const [extended, setExtended] = useState(false)
	const { notebooks, notebook, chapter } = useNotebook()
	const chapters = notebooks.length > 0 ? notebooks[0].chapters : []

	const { setShowModal, setTitle, setDescription, setPlaceholder, setButtonText, setOnPress } =
		useModal() // Get modal context

	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	const addNewChapter = () => {
		// setTitle("Add a Chapter")
		// setDescription("Add a new chapter")
		// setPlaceholder("Insert chapter name...")
		// setButtonText("Add Chapter")
		// setOnPress(() => (inputValue: string) => {
		// 	setChapters((prev) => {
		// 		const newChapters = [
		// 			...prev,
		// 			{ id: prev.length + 1, name: inputValue.trim() || (prev.length + 1).toString() },
		// 		]
		// 		return newChapters
		// 	})
		// 	setShowModal(false)
		// })
		// setShowModal(true)
	}

	const togglePaginationOptions = () => {
		setExtended(!extended)
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
				<MaterialC name='dots-horizontal' size={24} color={theme.colors.onPrimary} />
			</TouchableOpacity>

			<ChapterList />

			<TouchableOpacity onPress={togglePaginationOptions} style={{ paddingLeft: 4 }}>
				<MotiView
					animate={{ rotateZ: extended ? "180deg" : "0deg" }}
					transition={{ type: "timing", duration: 100 }}
				>
					<MaterialC name='chevron-double-down' size={32} color={theme.colors.onPrimary} />
				</MotiView>
			</TouchableOpacity>

			<Pagination extended={extended} />
		</View>
	)
}
