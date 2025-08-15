/**
 * useForgotPassword Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * verify their reset password OTP.
 */

import { useMutation } from "@tanstack/react-query"
import { verifyReset } from "../../api/mutations/auth"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../types/global"
import { AxiosError } from "axios"
import { UseFormSetError } from "react-hook-form"

export default function useVerifyReset(setError: UseFormSetError<{}>) {
	const nav = useNavigation<NavProp<"reset">>()
	return useMutation({
		mutationFn: ({ email, code }: { email: string; code: string }) => verifyReset(email, code),
		onSuccess: (_data, variables) => {
			// Navigate to the reset screen to set a new password.
			nav.navigate("reset", { email: variables.email })
		},
		onError: (e: AxiosError<{ message: string }>) => {
			setError("root", { type: "server", message: e.response?.data?.message })
		},
	})
}
