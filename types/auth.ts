/**
 * auth Types
 *
 * Holds user authentication types for Study Buddy.
 */

// Auth
export type LoginRequest = {
	login: string
	password: string
}

export type SignupRequest = {
	email: string
	username: string
	password: string
	confirmPassword: string
}
