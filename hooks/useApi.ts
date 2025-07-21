/**
 * useApi Hook
 *
 * A clean, intuitive hook for API calls that properly handles your backend's ApiResponse structure.
 * Only manages loading state - use returned result for success/error handling.
 */

import { AxiosRequestConfig } from "axios"
import { useState } from "react"
import apiClient from "../api/apiClient"
import { ApiResponse } from "../types/global"
import { getRefreshToken, getToken, saveRefreshToken, saveToken } from "../utils/keychain"

interface UseApiResponse<T> {
	success: boolean
	data: T | null
	error: string | null
}

export default function useApi<T = any>() {
	const [loading, setLoading] = useState(false) // Loading state

	/**
	 * Function that tries to refresh the user's access token using their refresh token.
	 *
	 * @returns True if refresh token is valid.
	 */
	async function tryRefreshToken() {
		try {
			const refreshToken = await getRefreshToken()

			if (!refreshToken) return false

			const res = await apiClient.post("/auth/refresh", { refreshToken })
			if (res.data.success) {
				await saveToken(res.data.data.accessToken)
				await saveRefreshToken(res.data.data.refreshToken)
				return true
			}
			return false
		} catch {
			return false
		}
	}

	/**
	 * Makes a request to the API and returns the result.
	 *
	 * @param config - Axios request configuration.
	 */
	const request = async (
		config: AxiosRequestConfig & { skipAuth?: boolean }
	): Promise<UseApiResponse<T>> => {
		setLoading(true)

		try {
			// Use the skipAuth configuration to see whether this call needs user to be authorized.
			if (!config.skipAuth) {
				const token = await getToken()
				if (token) {
					config.headers = {
						...config.headers,
						Authorization: `Bearer ${token}`,
					}
				}
			}

			const res = await apiClient.request<ApiResponse<T>>(config)
			console.log("API Response:", res.data)

			setLoading(false)

			if (res.data.success) {
				return {
					success: true,
					data: res.data.data,
					error: null,
				}
			} else {
				return {
					success: false,
					data: null,
					error: res.data.message,
				}
			}
		} catch (e: any) {
			setLoading(false)

			// Try refreshing the token if it is a 401 error.
			if (e.response?.status === 401) {
				const refreshSuccess = await tryRefreshToken()
				if (refreshSuccess) {
					return await request(config)
				}
			}

			const errorMessage = e.response?.data?.message || e.message || "An unexpected error occurred."

			return {
				success: false,
				data: null,
				error: errorMessage,
			}
		}
	}

	return {
		loading,
		request,
	}
}
