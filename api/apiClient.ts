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

export const getHello = async () => {
	console.log("API_BASE_URL:", API_BASE_URL)
	try {
		const response = await apiClient.get("/hello")
		console.log(response.data)
		return response.data
	} catch (e) {
		console.error("Error in getHello()", e)
		throw e
	}
}

export default apiClient
