import { Pressable, Text, View } from "react-native"
import { useNotebook } from "../contexts/NotebookContext"
import { getGlobalStyles } from "../styles/global"
import { useThemeContext } from "../contexts/ThemeContext"
import useNotebooks from "../hooks/useNotebooks"
import { useModal } from "../contexts/ModalContext"

export default function NotebooksScreen() {
	const { addNotebook } = useNotebooks()
	const { setShowModal, setTitle, setDescription, setPlaceholder, setButtonText, setOnPress } =
		useModal()
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)
	const { notebooks } = useNotebook()

	const handleCreateNotebook = () => {
		setTitle("Add a New Notebook")
		setDescription("Give your new notebook a name!")
		setPlaceholder("Type the name of your new notebook...")
		setButtonText("Add Notebook")
		setOnPress(() => (input: string) => addNotebook(input))
		setShowModal(true)
	}

	return (
		<View style={GlobalStyles.container}>
			{notebooks.map((n) => (
				<Text key={n.id} style={GlobalStyles.subheading}>
					{n.title}
				</Text>
			))}
			<Pressable onPress={handleCreateNotebook} style={GlobalStyles.button}>
				<Text style={GlobalStyles.buttonText}>HERE</Text>
			</Pressable>
		</View>
	)
}
