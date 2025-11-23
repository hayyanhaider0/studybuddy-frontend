/**
 * Auth Context
 *
 * Holds information on whether the user is logged in to make API calls.
 */

import { createContext, ReactNode, useContext, useState } from "react"

export type Occupation =
	| "STUDENT"
	| "TEACHER"
	| "INSTRUCTOR"
	| "RESEARCHER"
	| "PARENT_CAREGIVER"
	| "PROFESSIONAL"
	| "UNEMPLOYED"
	| "RETIRED"
	| "OTHER"
	| "NA"

export type EducationLevel =
	| "NONE"
	| "PRIMARY"
	| "MIDDLE"
	| "HIGH_SCHOOL"
	| "VOCATIONAL"
	| "UNDERGRAD"
	| "GRADUATE"
	| "POSTGRAD"
	| "OTHER"
	| "NA"

type AuthStateType = {
	// Checks access token to figure out whether user is authenticated.
	isLoggedIn: boolean
	// Email of the currently logged in user.
	email: string | null
	// Username of the currently logged in user.
	username: string | null
	// Display name of the currently logged in user.
	displayName: string | null
	// Occupation of the currently logged in user.
	occupation: Occupation | null
	// Education level of the currently logged in user.
	educationLevel: EducationLevel | null
}

type AuthContextType = {
	// Auth state -- holds user info if logged in.
	authState: AuthStateType
	// Setter for the auth state.
	setAuthState: React.Dispatch<React.SetStateAction<AuthStateType>>
	// Reset auth state -- log out.
	resetAuthState: () => void
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

	const resetAuthState = () => {
		setAuthState(() => DEFAULT_AUTH_STATE)
	}

	return (
		<AuthContext.Provider value={{ authState, setAuthState, resetAuthState }}>
			{children}
		</AuthContext.Provider>
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
