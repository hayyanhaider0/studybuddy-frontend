/**
 * Sets up an API client for efficient backend communication.
 */

import axios from "axios"
import Constants from "expo-constants"

// const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl
const API_BASE_URL = "http://10.0.0.223:8080/api"

const client = axios.create({
	baseURL: API_BASE_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
})

export default client
