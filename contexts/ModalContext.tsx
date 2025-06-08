import { createContext, ReactNode, useContext, useState } from "react"

type ModalContextType = {
	showModal: boolean
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<ModalContext.Provider value={{ showModal, setShowModal }}>{children}</ModalContext.Provider>
	)
}

export const useModalContext = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModalContext must be used within a ModalProvider")
	return ctx
}
