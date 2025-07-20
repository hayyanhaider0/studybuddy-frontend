/**
 * useApi Hook
 *
 * Helps with UI handling with API calls -- sets data, loading, and error values.
 */

import { AxiosRequestConfig } from "axios"
import { useState } from "react"
import apiClient from "../api/apiClient"

export default function useApi<T = any>() {
	// Loading state.
	const [loading, setLoading] = useState(false)

	/**
	 * Makes a request to the API and sets loading state accordingly.
	 *
	 * @param config - Axios request configuration.
	 */
	async function request(
		config: AxiosRequestConfig
	): Promise<{ data: T | null; error: string | null }> {
		// Reset state.
		setLoading(true)
		try {
			// If successful, set the data from the response.
			const res = await apiClient.request<T>(config)
			setLoading(false)
			return { data: res.data, error: null }
		} catch (e: any) {
			// If unsuccessful, set the error from the response.
			const errMsg = e.response?.data?.message || e.message || "Unknown error occured."
			setLoading(false)
			return { data: null, error: errMsg }
		}
	}

	return {
		loading,
		request,
	}
}
