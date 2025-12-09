/**
 * useForgotPassword Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * send an OTP to reset their password.
 */

import { useMutation } from "@tanstack/react-query"
import { UseFormSetError } from "react-hook-form"
import { AxiosError } from "axios"
import { reset } from "../api/api"

export default function useForgotPassword(setError: UseFormSetError<{ login: string }>) {
	return useMutation({
		mutationFn: ({ login }: { login: string }) => reset(login),
		onError: (e: AxiosError<{ message: string }>) => {
			const errorMessage = e.response?.data.message

			if (!errorMessage) {
				setError("root", { message: e.response?.data?.message || "A network error has occured." })
			} else if (errorMessage.toLowerCase().includes("user")) {
				setError("login", { type: "server", message: errorMessage })
			}
		},
	})
}
