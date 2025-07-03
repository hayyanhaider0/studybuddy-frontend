/**
 * ModalContext Component
 *
 * Provides shared values and functions for modal management.
 */

import { createContext, ReactNode, useContext, useState } from "react"

// Types
export enum ModalType {
	INPUT = "INPUT",
	CONFIRM = "CONFIRM",
	CHOICE = "CHOICE",
}

type Choice = {
	label: string
	onPress: () => void
	selected: boolean
}

type ModalData = {
	type: ModalType
	title: string
	description: string
	setInput?: string
	placeholder?: string
	choices?: Choice[]
	buttonText?: string
	onSubmit?: (input: string) => void
	onConfirm?: () => void
}

type ModalContextType = {
	// Boolean to show whether the modal is currently visible.
	showModal: boolean
	// Current input value for INPUT type modals.
	input: string
	// Setter for the input value.
	setInput: (input: string) => void
	// Current modal data containing all modal configuration.
	modalData: ModalData | null
	// Function to open a modal with the provided configuration.
	openModal: (props: ModalData) => void
	// Function to close the current modal.
	closeModal: () => void
	// Function to handle modal submission based on modal type.
	handleSubmit: (choiceIndex?: number) => void
}

// React context for Modal
const ModalContext = createContext<ModalContextType | null>(null)

/**
 * ModalProvider Component
 *
 * Wraps components that need to utilize modal functionality.
 *
 * @param children - React components that need to access modal functions.
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
	// Boolean to control modal visibility.
	const [showModal, setShowModal] = useState(false)
	// Current input value for INPUT type modals.
	const [input, setInput] = useState("")
	// Current modal configuration data.
	const [modalData, setModalData] = useState<ModalData | null>(null)

	// Function to open a modal with configuration
	const openModal = (props: ModalData) => {
		setModalData(props)
		if (props.setInput) {
			setInput(props.setInput)
		}
		setShowModal(true)
	}

	// Function to close the modal and reset state
	const closeModal = () => {
		setShowModal(false)
		setInput("")
		// Clear modal data after animation completes
		setTimeout(() => setModalData(null), 300)
	}

	// Function to handle modal submission based on type
	const handleSubmit = (choiceIndex?: number) => {
		if (!modalData) return

		// Handle choice selection
		if (modalData.type === ModalType.CHOICE && choiceIndex !== undefined) {
			modalData.choices?.[choiceIndex]?.onPress()
			closeModal()
			return
		}

		// Handle confirm modal
		if (modalData.onConfirm) {
			modalData.onConfirm()
			closeModal()
			return
		}

		// Handle input modal
		if (modalData.onSubmit) {
			modalData.onSubmit(input)
			closeModal()
			return
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

/**
 * useModal hook
 *
 * Custom hook to access modal values and functions.
 *
 * @throws Error if used outside of a ModalProvider.
 * @returns ModalContext containing modal state and functions.
 */
export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModal must be used within a ModalProvider")
	return ctx
}
