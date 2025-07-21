/**
 * useAuthApi Hook
 *
 * Custom hook that calls the backend -- for authorization related api calls.
 */

import { LoginRequest, SignUpRequest } from "../types/global"
import useApi from "./useApi"

export default function useAuthApi() {
	const loginApi = useApi()
	const signUpApi = useApi()
	const verifyApi = useApi()
	const resendApi = useApi()

	async function login(req: LoginRequest) {
		const res = await loginApi.request({
			method: "POST",
			url: "/auth/login",
			data: req,
			skipAuth: true,
		})

		return res
	}

	async function signUp(req: SignUpRequest) {
		const res = await signUpApi.request({
			method: "POST",
			url: "/auth/signup",
			data: req,
			skipAuth: true,
		})

		return res
	}

	async function verify(email: string, code: string) {
		const res = await verifyApi.request({
			method: "POST",
			url: "/auth/verify-email",
			data: { email, code },
			skipAuth: true,
		})

		return res
	}

	async function resend(email: string) {
		const res = await resendApi.request({
			method: "POST",
			url: "/auth/resend-verification",
			data: { email },
			skipAuth: true,
		})

		return res
	}

	return {
		login,
		signUp,
		verify,
		resend,

		// Loading states
		loading: {
			login: loginApi.loading,
			signUp: signUpApi.loading,
			verify: verifyApi.loading,
			resend: resendApi.loading,
		},
	}
}
