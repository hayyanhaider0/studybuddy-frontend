/**
 * Auth Context
 *
 * Holds information on whether the user is logged in to make API calls.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { EducationLevelType, OccupationType } from "../types/auth"

type AuthStateType = {
	isLoggedIn: boolean
	email: string | null
	username: string | null
	displayName: string | null
	occupation: OccupationType | null
	educationLevel: EducationLevelType | null
}

type AuthContextType = {
	authState: AuthStateType
	setAuthState: React.Dispatch<React.SetStateAction<AuthStateType>>
}

// React context for shared auth values.
export const AuthContext = createContext<AuthContextType | null>(null)

// DEFAULTS
const DEFAULT_AUTH_STATE: AuthStateType = {
	isLoggedIn: false,
	email: null,
	username: null,
	displayName: null,
	occupation: null,
	educationLevel: null,
}

/**
 * Wraps the entire app to provide auth shared values.
 *
 * @param children - React components that can use auth shared values.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE)

	return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
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
