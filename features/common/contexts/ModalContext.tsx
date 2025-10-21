/**
 * ModalContext Component
 *
 * Provides shared values and functions for modal management.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { Color } from "../../../types/global"

// Types
interface Choice {
	label: string
	selected?: boolean
}
interface BaseModalType {
	title: string
	description: string
}
export interface InputModalType extends BaseModalType {
	type: "input"
	placeholder: string
	buttonText: string
	defaultValue?: string
	defaultColor?: Color
	color?: boolean
	onSubmit: (input: string, color?: Color) => void
}

export interface ConfirmModalType extends BaseModalType {
	type: "confirm"
	buttonText: string
	onSubmit: () => void
}

export interface SingleChoiceModalType extends BaseModalType {
	type: "single_choice"
	choices: Choice[]
	selectedIndex?: number
	onSubmit: (selectedIndex: number) => void
}
export interface MultipleChoiceModalType extends BaseModalType {
	type: "multiple_choice"
	choices: Choice[]
	selectedIndices?: number[]
	onSubmit: (selectedIndices: number[]) => void
}

// Types
export type ModalType =
	| InputModalType
	| ConfirmModalType
	| SingleChoiceModalType
	| MultipleChoiceModalType

type ModalContextType = {
	// Boolean to show whether the modal is currently visible.
	isVisible: boolean
	// Current modal data containing all modal configuration.
	modalData: ModalType | null
	// Function to open a modal with the provided configuration.
	openModal: (props: ModalType) => void
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
	const [isVisible, setVisible] = useState(false)
	// Current modal configuration data.
	const [modalData, setModalData] = useState<ModalType | null>(null)

	// Function to open a modal with configuration
	const openModal = (props: ModalType) => {
		setModalData(props)
		setVisible(true)
	}

	// Function to close the modal and reset state
	const closeModal = () => {
		setVisible(false)
		// Clear modal data after animation completes
		setTimeout(() => setModalData(null), 300)
	}

	// Function to handle modal submission based on type
	const handleSubmit = (choiceIndex?: number) => {
		if (!modalData) return

		switch (modalData.type) {
			// Input modal case is managed within the modal component.
			// Confirm modal case, just submits.
			case "confirm":
				modalData.onSubmit()
				closeModal()
				break
			// Single choice modal case, submits with the selected choice.
			case "single_choice":
				if (choiceIndex === undefined) return
				modalData.onSubmit(choiceIndex)
				closeModal()
				break
			// Multiple choice modal case, allows user to selected/deselect,
			// then submits an array of indices that they selected.
			case "multiple_choice":
				if (choiceIndex !== undefined) {
					// Get the selected choices.
					const newSelected = modalData.selectedIndices?.includes(choiceIndex)
						? modalData.selectedIndices.filter((i) => i !== choiceIndex)
						: [...(modalData.selectedIndices || []), choiceIndex]
					setModalData(
						(prev) => prev && ({ ...prev, selectedIndices: newSelected } as MultipleChoiceModalType)
					)
				} else {
					// If nothing is selected, submit an empty array.
					modalData.onSubmit(modalData.selectedIndices || [])
					closeModal()
				}
				break
		}
	}

	return (
		<ModalContext.Provider
			value={{
				isVisible,
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
