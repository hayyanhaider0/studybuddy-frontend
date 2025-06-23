import { createContext, ReactNode, useContext, useState } from "react"

type SettingsContextType = {
	showPageNumber: boolean
	setShowPageNumber: React.Dispatch<React.SetStateAction<boolean>>
}

// React context for settings shared values.
const SettingsContext = createContext<SettingsContextType | null>(null)

/**
 * SettingsProvider Component
 *
 * Wraps children components, providing Settings state values via context.
 *
 * @param children - JSX Components that require SettingsProvider shared values.
 */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [showPageNumber, setShowPageNumber] = useState(true)

	return (
		<SettingsContext.Provider value={{ showPageNumber, setShowPageNumber }}>
			{children}
		</SettingsContext.Provider>
	)
}

/**
 * useSettings Hook
 *
 * Custom hook to provide shared Settings context values.
 *
 * @throws Error if used outside SettingsProvider.
 * @returns SettingsContext shared values.
 */
export const useSettings = () => {
	const ctx = useContext(SettingsContext)
	if (!ctx) throw new Error("useSettings must be used within a SettingsProvider")
	return ctx
}
