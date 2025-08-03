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
import { saveToken } from "../../utils/keychain"
import { useAuthContext } from "../../contexts/AuthContext"
import useAuthApi from "../../hooks/useAuthApi"
import { LoginRequest } from "../../types/auth"
import { EducationLevel, Occupation } from "../../enums/global"

/**
 * Sets the type for setForm to boolean in component props
 */
type LoginProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
	prefillEmail?: string
}

export default function Login({ setForm, prefillEmail }: LoginProps) {
	const nav = useNavigation<NavProp<"main">>() // Navigation controller

	// Context values
	const { login, loading } = useAuthApi()
	const { setAuthState } = useAuthContext()

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

	/**
	 * Handles login operation.
	 *
	 * Sends a backend request and authorizes user to enter their account.
	 *
	 * @param data - Data from the form
	 */
	const handleLogin = async (req: LoginRequest) => {
		const res = await login(req) // Call login from the useAuthApi hook.

		if (res.success) {
			if (res.data.accessToken) {
				// If successful and user is verified.
				saveToken(res.data.accessToken)
				setAuthState({
					isLoggedIn: true,
					email: res.data.email,
					username: res.data.username,
					displayName: res.data.displayName,
					occupation: Occupation.STUDENT,
					educationLevel: EducationLevel.UNDERGRAD_YEAR_THREE,
				})
			} else {
				// If successful but user is NOT verified.
				nav.navigate("verify", res.data)
			}
		} else if (res.error) {
			// If unsuccessful.
			setError("root", { type: "server", message: res.error })
		}
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
				title={loading.login ? "Logging in..." : "Login"}
				disabled={loading.login}
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
