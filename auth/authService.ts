import apiClient from "../api/apiClient"
import { ApiResponse, LoginRequest, SignUpRequest } from "../types/global"

export const authService = {
	async signup(data: SignUpRequest) {
		try {
			const res = await apiClient.post<ApiResponse<void>>("/auth/signup", data)
			console.log(res)
		} catch (e: any) {
			if (e.response) {
				const errData: ApiResponse<void> = e.response.data
				console.log(errData.message)
			}
		}
	},
	async login(data: LoginRequest) {
		try {
			const res = await apiClient.post<ApiResponse<void>>("/auth/login", data)
			console.log(res)
		} catch (e: any) {
			if (e.response) {
				const errData: ApiResponse<void> = e.response.data
				console.log(errData.message)
			}
		}
	},
}
