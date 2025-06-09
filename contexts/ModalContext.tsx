import { createContext, ReactNode, useContext, useState } from "react"

type ModalContextType = {
	showModal: boolean
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>
	title: string
	setTitle: React.Dispatch<React.SetStateAction<string>>
	description: string
	setDescription: React.Dispatch<React.SetStateAction<string>>
	placeholder: string
	setPlaceholder: React.Dispatch<React.SetStateAction<string>>
	input: string
	setInput: React.Dispatch<React.SetStateAction<string>>
	buttonText: string
	setButtonText: React.Dispatch<React.SetStateAction<string>>
	onPress: (inputValue: string) => void
	setOnPress: React.Dispatch<React.SetStateAction<(inputValue: string) => void>>
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [showModal, setShowModal] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [placeholder, setPlaceholder] = useState("")
	const [input, setInput] = useState("")
	const [buttonText, setButtonText] = useState("")
	const [onPress, setOnPress] = useState<(inputValue: string) => void>(
		() => (inputValue: string) => console.log(inputValue)
	)

	return (
		<ModalContext.Provider
			value={{
				showModal,
				setShowModal,
				title,
				setTitle,
				description,
				setDescription,
				placeholder,
				setPlaceholder,
				input,
				setInput,
				buttonText,
				setButtonText,
				onPress,
				setOnPress,
			}}
		>
			{children}
		</ModalContext.Provider>
	)
}

export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModalContext must be used within a ModalProvider")
	return ctx
}
