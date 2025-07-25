import axios from "axios"
import Constants from "expo-constants"

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
})

export default apiClient
