/**
 * useLogin Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * login to their account.
 */

import { UseFormSetError } from "react-hook-form"
import { LoginRequest } from "../../types/auth"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../types/global"
import { useAuthContext } from "../../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { login } from "../../api/mutations/auth"
import { EducationLevel, Occupation } from "../../enums/global"
import { saveToken, saveRefreshToken } from "../../utils/keychain"
import { AxiosError } from "axios"

export default function useLogin(setError: UseFormSetError<LoginRequest>) {
	const nav = useNavigation<NavProp<"main">>()
	const { setAuthState } = useAuthContext()

	return useMutation({
		mutationFn: login,
		onSuccess: (data, variables) => {
			const response = data.data

			// If the response includes an access token -- successful login.
			if (response.accessToken) {
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
			} else {
				// If the user's account is not verified.
				nav.navigate("verify", { email: variables.login })
			}
		},
		onError: (e: AxiosError<{ message: string }>) => {
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
