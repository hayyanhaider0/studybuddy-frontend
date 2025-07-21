/**
 * Auth Context
 *
 * Holds information on whether the user is logged in to make API calls.
 */

import { createContext, ReactNode, useContext, useState } from "react"

type AuthContextType = {
	isLoggedIn: boolean
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

// React context for shared auth values.
export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Wraps the entire app to provide auth shared values.
 *
 * @param children - React components that can use auth shared values.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
	)
}

/**
 * Custom hook that allows components to use auth shared values.
 *
 * @throws Error if used outside of AuthProvider.
 * @returns AuthContext providing shared values.
 */
export const useAuthContext = () => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider")
	return ctx
}
