/**
 * Login.tsx
 *
 * Contains the login logic and component
 * Allows the user to toggle to the Login component if needed
 */

import { View, Text } from "react-native"
import LoginInput from "./LoginInput"
import { useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../types/global"
import ThirdPartyLogin from "./ThirdPartyLogin"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getLoginStyles } from "../../styles/login"
import CustomPressable from "../common/CustomPressable"
import { useEffect } from "react"
import { LoginRequest } from "../../types/auth"
import useLogin from "../../hooks/auth/useLogin"

/**
 * Sets the type for setForm to boolean in component props
 */
type LoginProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
	prefillEmail?: string
}

export default function Login({ setForm, prefillEmail }: LoginProps) {
	const nav = useNavigation<NavProp<"main">>() // Navigation controller

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
		setError,
	} = useForm<LoginRequest>({
		defaultValues: {
			login: prefillEmail || "", // prefill the login field.
			password: "",
		},
	}) // Form handling

	// Get login mutation.
	const loginMutation = useLogin(setError)
	// Get loading state.
	const loading = loginMutation.isPending

	/**
	 * Calls the login endpoint and processes user entry.
	 *
	 * @param loginData - Data entered by the user to login.
	 */
	const handleLogin = (loginData: LoginRequest) => {
		setError("root", { type: "manual", message: "" })
		loginMutation.mutate(loginData)
	}

	/**
	 * Handles forgot password click.
	 *
	 * Takes user to a forgot password screen to allow them to change their password.
	 */
	const handleForgotPassword = () => {
		const login = getValues("login")
		nav.navigate("forgot", { login })
	}

	useEffect(() => {
		if (prefillEmail) {
			setValue("login", prefillEmail)
		}
	}, [prefillEmail])

	return (
		<>
			{/* Input Container: Contains user input boxes */}
			<View style={styles.inputContainer}>
				{/* Email input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='login'
						rules={{
							required: "Please enter your username.",
							minLength: { value: 4, message: "Username must be at least 4 characters long." },
							maxLength: {
								value: 254,
								message: "Email/Username can not be longer than 254 characters.",
							},
						}}
						label='Username'
						placeholder='Username'
						error={errors.login}
					/>

					{/* Email/Username error */}
					{errors.login && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.login.message?.toString()}
						</Text>
					)}
				</View>

				{/* Password input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='password'
						rules={{
							required: "Please enter your password.",
							minLength: { value: 8, message: "Password must be at least 8 characters long." },
							maxLength: { value: 64, message: "Password can not be longer than 64 characters." },
						}}
						label='Password'
						placeholder='••••••••'
						secure={true}
						error={errors.password}
					/>

					{/* Password Error */}
					{errors.password && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.password.message?.toString()}
						</Text>
					)}
				</View>
			</View>

			{/* Forgot Password link */}
			<CustomPressable type='link' title='Forgot Password?' onPress={handleForgotPassword} />

			{/* Login Button: Form submission button */}
			<CustomPressable
				type='primary'
				title={loading ? "Logging in..." : "Login"}
				disabled={loading}
				onPress={handleSubmit(handleLogin)}
			/>

			{/* Other backend errors */}
			{errors.root && (
				<Text style={[GlobalStyles.error, { textAlign: "center" }]}>{errors.root.message}</Text>
			)}

			{/* Switch Form Button: Allows user to switch to the sign up component */}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				<Text style={GlobalStyles.paragraph}>Don't have an account? </Text>
				<CustomPressable
					type='link'
					title='Register Now'
					onPress={() => setForm((prev) => !prev)}
				/>
			</View>

			{/* Login using third party -- Google, Facebook, Apple */}
			<ThirdPartyLogin />
		</>
	)
}
