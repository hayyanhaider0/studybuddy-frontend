/**
 * useResetPassword Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * reset their password.
 */

import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "../../../api/mutations/auth"
import { UseFormSetError } from "react-hook-form"
import { AxiosError } from "axios"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../../types/global"

export default function useResetPassword(setError: UseFormSetError<{}>) {
	const nav = useNavigation<NavProp<"login">>()
	return useMutation({
		mutationFn: ({
			email,
			password,
			confirmPassword,
		}: {
			email: string
			password: string
			confirmPassword: string
		}) => resetPassword(email, password, confirmPassword),
		onSuccess: (_data, variables) => {
			nav.navigate("login", { email: variables.email })
		},
		onError: (e: AxiosError<{ message: string }>) => {
			setError("root", { type: "server", message: e.response?.data?.message })
		},
	})
}
