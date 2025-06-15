import { createContext, ReactNode, useContext, useState } from "react"

type OpenModalProps = {
	title: string
	description: string
	placeholder: string
	buttonText: string
	onSubmit: (input: string) => void
}

type ModalData = {
	title: string
	description: string
	placeholder: string
	buttonText: string
	onSubmit: (input: string) => void
}

type ModalContextType = {
	showModal: boolean
	input: string
	setInput: (input: string) => void
	modalData: ModalData | null
	openModal: (props: OpenModalProps) => void
	closeModal: () => void
	handleSubmit: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [showModal, setShowModal] = useState(false)
	const [input, setInput] = useState("")
	const [modalData, setModalData] = useState<ModalData | null>(null)

	const openModal = (props: OpenModalProps) => {
		setModalData(props)
		setInput("") // Clear previous input
		setShowModal(true)
	}

	const closeModal = () => {
		setShowModal(false)
		setInput("")
		// Clear modal data after animation completes
		setTimeout(() => setModalData(null), 300)
	}

	const handleSubmit = () => {
		if (modalData?.onSubmit) {
			modalData.onSubmit(input)
			closeModal()
		}
	}

	return (
		<ModalContext.Provider
			value={{
				showModal,
				input,
				setInput,
				modalData,
				openModal,
				closeModal,
				handleSubmit,
			}}
		>
			{children}
		</ModalContext.Provider>
	)
}

export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModal must be used within a ModalProvider")
	return ctx
}
