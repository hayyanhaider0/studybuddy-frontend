// Auth
export type LoginRequest = {
	login: string
	password: string
}

export type SignUpRequest = {
	email: string
	username: string
	password: string
	confirmPassword: string
}
