import client from "../../../api/client"
import { ApiResponse } from "../../../types/global"
import { EducationLevel, Occupation } from "../contexts/AuthContext"

interface AuthResponse {
	accessToken: string
	refreshToken: string
	email: string
	username: string
	displayName: string
	occupation: string
	educationLevel: string
}

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

export type User = {
	username: string
	displayName: string
	occupation: Occupation
	educationLevel: EducationLevel
	preferences?: {
		notificationsEnabled?: boolean
		timeZone?: string
		theme?: string
		lastCanvasId?: string
	}
}

export async function signup(data: SignupRequest) {
	const res = await client.post<ApiResponse<{ email: string }>>("/auth/signup", data)
	return res.data.data!
}

export async function login(data: LoginRequest) {
	const res = await client.post<ApiResponse<AuthResponse>>("/auth/login", data)
	return res.data.data!
}

export async function verifyEmail(email: string, code: string) {
	const res = await client.post<ApiResponse<void>>("/auth/verify-email", { email, code })
	return res.data.data!
}

export async function resend(email: string) {
	const res = await client.post<ApiResponse<void>>("/auth/resend-verification", { email })
	return res.data.data!
}

export async function reset(login: string) {
	const res = await client.post<ApiResponse<void>>("/auth/reset", { login })
	return res.data.data!
}

export async function resetPassword(email: string, password: string, confirmPassword: string) {
	const res = await client.post<ApiResponse<void>>("/auth/reset-password", {
		email,
		password,
		confirmPassword,
	})
	return res.data.data!
}

export async function verifyReset(email: string, code: string) {
	const res = await client.post<ApiResponse<void>>("/auth/verify-reset", { email, code })
	return res.data.data!
}

export async function updateUser(req: Partial<User>) {
	const res = await client.patch<ApiResponse<void>>("/auth/", req)
	return res.data.data!
}
