/**
 * Sets up an API client for efficient backend communication.
 */

import axios from "axios"
import Constants from "expo-constants"
import { getToken } from "../utils/secureStore"

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl
console.log("API Base URL:", API_BASE_URL)

const client = axios.create({
	baseURL: API_BASE_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
})

// Attach tokens
client.interceptors.request.use(async (config) => {
	if (!config.url?.includes("/auth")) {
		const token = await getToken()
		if (token) config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export default client
