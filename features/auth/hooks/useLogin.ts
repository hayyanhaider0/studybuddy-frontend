/**
 * useLogin Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * login to their account.
 */

import { UseFormSetError } from "react-hook-form"
import { LoginRequest } from "../../../types/auth"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../../types/global"
import { useAuthContext } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { EducationLevel, Occupation } from "../../../enums/global"
import { saveToken, saveRefreshToken } from "../../../utils/secureStore"
import { AxiosError } from "axios"
import { login } from "../api"

export default function useLogin(setError: UseFormSetError<LoginRequest>) {
	const nav = useNavigation<NavProp<"main">>()
	const { setAuthState } = useAuthContext()

	return useMutation({
		mutationFn: login,
		onSuccess: async (data) => {
			const response = data.data

			// Save the access token.
			saveToken(response.accessToken)
			// Save the refresh token.
			saveRefreshToken(response.refreshToken)

			// Set the user auth state.
			setAuthState({
				isLoggedIn: true,
				email: response.email,
				username: response.username,
				displayName: response.displayName,
				occupation: response.occupation || Occupation.STUDENT,
				educationLevel: response.educationLevel || EducationLevel.UNDERGRAD_YEAR_THREE,
			})
		},
		onError: (e: AxiosError<{ data: any; error: string; message: string }>) => {
			const errorData = e.response?.data

			if (errorData?.error === "EMAIL_NOT_VERIFIED") {
				nav.navigate("verify", { email: errorData.data.email })
				return
			}

			const errorMessage = e.response?.data?.message
			if (!errorMessage) {
				setError("root", { message: e.response?.data?.message || "A network error has occured." })
			} else if (errorMessage.toLowerCase().includes("user")) {
				setError("login", { type: "server", message: errorMessage })
			} else {
				setError("root", { type: "server", message: errorMessage })
			}
		},
	})
}
