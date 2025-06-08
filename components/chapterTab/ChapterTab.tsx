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
import { useModalContext } from "../../contexts/ModalContext"

export default function ChapterTab() {
	const [extended, setExtended] = useState(false)

	const {
		setShowModal,
		setTitle,
		setDescription,
		setPlaceholder,
		input,
		setInput,
		setButtonText,
		setOnPress,
	} = useModalContext()

	const { toggleMenu } = useCanvasActions()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const [chapters, setChapters] = useState([
		{ id: 1, name: "Chapter 1" },
		{ id: 2, name: "Chapter 2" },
		{ id: 3, name: "Chapter 3" },
		{ id: 4, name: "Chapter 4" },
		{ id: 5, name: "Chapter 5" },
	])

	const selectChapter = (i: number) => {
		console.log(`Selected Chapter: \n\tIndex: ${i}\n\tID: ${chapters[i].id}`)
	}

	const openChapterMenu = (i: number) => {
		console.log(`Open menu for chapter with ID: ${chapters[i].id}`)
	}

	const addNewChapter = () => {
		console.log("addNewChapter called")
		setTitle("Add a Chapter")
		setDescription("Add a new chapter")
		setPlaceholder("Insert chapter name...")
		setButtonText("Add Chapter")

		setOnPress(() => (inputValue: string) => {
			setChapters((prev) => {
				const newChapters = [
					...prev,
					{ id: prev.length + 1, name: inputValue.trim() || (prev.length + 1).toString() },
				]
				return newChapters
			})
			setShowModal(false)
		})
		setShowModal(true)
	}

	const deleteChapter = (id: number) => {
		setChapters((prev) => prev.filter((chap) => id !== chap.id))
	}

	const prevPage = () => {
		console.log("Previous page")
	}

	const newPage = () => {
		console.log("New page")
	}

	const nextPage = () => {
		console.log("Next page")
	}

	const togglePageOptions = () => {
		setExtended(!extended)
	}

	return (
		<View
			style={{
				position: "relative",
				width: "100%",
				backgroundColor: theme.colors.background,
				padding: 8,
				paddingTop: 48,
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 10,
			}}
		>
			<TouchableOpacity onPress={toggleMenu} style={{ padding: 8 }}>
				<MaterialC name='dots-horizontal' size={24} color={theme.colors.onPrimary} />
			</TouchableOpacity>

			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={chapters}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						onPress={() => selectChapter(index)}
						onLongPress={() => openChapterMenu(index)}
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 999,
							padding: 16,
							paddingVertical: 8,
						}}
					>
						<Text style={GlobalStyles.buttonText}>{item.name}</Text>
					</TouchableOpacity>
				)}
				ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
				ListFooterComponent={
					<TouchableOpacity
						onPress={addNewChapter}
						style={{
							backgroundColor: theme.colors.primary,
							borderRadius: 999,
							padding: 6,
							aspectRatio: 1 / 1,
							marginLeft: 4,
						}}
					>
						<MaterialC name='plus' size={24} color={theme.colors.onPrimary} />
					</TouchableOpacity>
				}
			/>

			<TouchableOpacity onPress={togglePageOptions} style={{ paddingLeft: 4 }}>
				<MotiView
					animate={{ rotateZ: extended ? "180deg" : "0deg" }}
					transition={{ type: "timing", duration: 100 }}
				>
					<MaterialC name='chevron-double-down' size={32} color={theme.colors.onPrimary} />
				</MotiView>
			</TouchableOpacity>
			<AnimatePresence>
				{extended && (
					<MotiView
						from={{ translateY: -36, opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						exit={{ translateY: -36, opacity: 0 }}
						transition={{ duration: 100, type: "timing" }}
						style={{
							position: "absolute",
							top: 88,
							right: 0,
							flexDirection: "row",
							backgroundColor: theme.colors.background,
							borderBottomStartRadius: 26,
							paddingVertical: 8,
							marginLeft: 8,
							zIndex: -10,
						}}
					>
						<TouchableOpacity
							onPress={prevPage}
							style={{
								justifyContent: "center",
								alignItems: "center",
								paddingHorizontal: 8,
							}}
						>
							<Material name='arrow-back-ios-new' size={24} color={theme.colors.textPrimary} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={newPage}
							style={{
								backgroundColor: theme.colors.secondary,
								borderRadius: 999,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<MaterialC name='plus' size={32} color={theme.colors.onSecondary} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={nextPage}
							style={{
								justifyContent: "center",
								alignItems: "center",
								paddingHorizontal: 8,
							}}
						>
							<Material name='arrow-forward-ios' size={24} color={theme.colors.textPrimary} />
						</TouchableOpacity>
					</MotiView>
				)}
			</AnimatePresence>
		</View>
	)
}
