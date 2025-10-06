/**
 * useVerifyEmail Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * verify their email.
 */

import { useMutation } from "@tanstack/react-query"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../../types/global"
import { AxiosError } from "axios"
import { verifyEmail } from "../api"

export default function useVerifyEmail(
	setError: React.Dispatch<React.SetStateAction<string | null>>
) {
	const nav = useNavigation<NavProp<"main">>()

	return useMutation({
		mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmail(email, code),
		// Navigate to the login screen after verification.
		onSuccess: (_data, variables) => {
			nav.navigate("login", { email: variables.email })
		},
		onError: (e: AxiosError<{ message: string }>) => {
			setError(e.response?.data?.message || "A network error has occured.")
		},
	})
}
