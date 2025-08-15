import { LoginRequest, SignupRequest } from "../../types/auth"
import client from "../client"

export async function signup(data: SignupRequest) {
	const res = await client.post("/auth/signup", data)
	return res.data
}

export async function login(data: LoginRequest) {
	const res = await client.post("/auth/login", data)
	return res.data
}

export async function verifyEmail(email: string, code: string) {
	const res = await client.post("/auth/verify-email", { email, code })
	return res.data
}

export async function resend(email: string) {
	const res = await client.post("/auth/resend-verification", { email })
	return res.data
}

export async function reset(login: string) {
	const res = await client.post("/auth/reset", { login })
	return res.data
}

export async function resetPassword(email: string, password: string, confirmPassword: string) {
	const res = await client.post("/auth/reset-password", { email, password, confirmPassword })
	return res.data
}

export async function verifyReset(email: string, code: string) {
	const res = await client.post("/auth/verify-reset", { email, code })
	return res.data
}
