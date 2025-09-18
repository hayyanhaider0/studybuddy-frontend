/**
 * useSignup Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * sign up.
 */

import { UseFormSetError } from "react-hook-form"
import { SignupRequest } from "../../../types/auth"
import { useMutation } from "@tanstack/react-query"
import { signup } from "../../../api/mutations/auth"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../../types/global"
import { AxiosError } from "axios"

export default function useSignup(setError: UseFormSetError<SignupRequest>) {
	const nav = useNavigation<NavProp<"verify">>()

	return useMutation({
		mutationFn: signup,
		onSuccess: (_data, variables) => {
			// Handle success - navigate to verify.
			nav.navigate("verify", { email: variables.email })
		},
		onError: (e: AxiosError<{ message: string }>) => {
			const errorMessage = e.response?.data?.message

			if (!errorMessage) {
				setError("root", { message: e.response?.data?.message || "A network error has occured." })
			} else if (errorMessage.toLowerCase().includes("email")) {
				setError("email", { type: "server", message: errorMessage })
			} else if (errorMessage.toLowerCase().includes("user")) {
				setError("username", { type: "server", message: errorMessage })
			} else {
				setError("root", { type: "server", message: errorMessage })
			}
		},
	})
}
