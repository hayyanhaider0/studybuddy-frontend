/**
 * useResend Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * resend an OTP.
 */

import { useMutation } from "@tanstack/react-query"
import { resend } from "../../api/mutations/auth"
import { AxiosError } from "axios"

export default function useResend(setError: React.Dispatch<React.SetStateAction<string | null>>) {
	return useMutation({
		mutationFn: ({ email }: { email: string }) => resend(email),
		onSuccess: () => {
			setError(null)
		},
		onError: (e: AxiosError<{ message: string }>) => {
			setError(e.response?.data?.message || "A network error has occured.")
		},
	})
}
