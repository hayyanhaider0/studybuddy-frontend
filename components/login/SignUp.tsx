/**
 * SignUp.tsx
 *
 * Contains the sign up logic and component
 * Allows the user to toggle to the Login component if needed
 */

import { View, Text, TouchableOpacity } from "react-native"
import LoginInput from "./LoginInput"
import { useForm } from "react-hook-form"
import ThirdPartyLogin from "./ThirdPartyLogin"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getLoginStyles } from "../../styles/login"
import CustomPressable from "../common/CustomPressable"
import { NavProp } from "../../types/global"
import { useNavigation } from "@react-navigation/native"
import useAuthApi from "../../hooks/useAuthApi"
import { SignUpRequest } from "../../types/auth"

/**
 * Sets the type for setForm to boolean in component props
 */
type SignUpProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SignUp({ setForm }: SignUpProps) {
	const nav = useNavigation<NavProp<"verify">>() // Navigation
	const { signUp, loading } = useAuthApi()

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	/**
	 * Get form variables
	 */
	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
		setError,
	} = useForm<SignUpRequest>({ criteriaMode: "all" })

	/**
	 * Handles sign up button press, sends form data to the backend.
	 *
	 * @param data - Data from the form
	 */
	const handleSignUp = async (signupData: SignUpRequest) => {
		const res = await signUp(signupData)

		if (res.success) {
			// If successful, go to the verification screen.
			nav.navigate("verify", { email: res.data.email })
		} else {
			if (res.error) {
				// If unsuccessful, show errors accordingly.
				if (res.error.toLowerCase().includes("email")) {
					setError("email", { type: "server", message: res.error })
				} else if (res.error.toLowerCase().includes("username")) {
					setError("username", { type: "server", message: res.error })
				} else {
					setError("root", { type: "server", message: res.error })
				}
			}
		}
	}

	return (
		<>
			{/* Input Container: Contains user input boxes */}
			<View style={styles.inputContainer}>
				{/* Email input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='email'
						rules={{
							required: "Email is required.",
							maxLength: { value: 254, message: "Email can not be longer than 254 characters." },
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Please enter a valid email address.",
							},
						}}
						label='Email'
						placeholder='email@example.com'
						error={errors.email}
					/>
					{/* Email errors */}
					{errors.email && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.email.message?.toString()}
						</Text>
					)}
				</View>

				{/* Username input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='username'
						rules={{
							required: "Username is required.",
							maxLength: { value: 30, message: "Username can not be longer than 30 characters." },
						}}
						label='Username'
						placeholder='Username'
						error={errors.username}
					/>
					{/* Username errors */}
					{errors.username && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.username.message?.toString()}
						</Text>
					)}
				</View>

				{/* Password input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='password'
						rules={{
							required: "Password is required.",
							minLength: { value: 8, message: "Password must be at least 8 characters long." },
							maxLength: { value: 64, message: "Password can not be longer than 64 characters." },
							validate: {
								// Uppercase letter validation
								hasUppercase: (v: string) =>
									/[A-Z]/.test(v) || "Password must contain at least one uppercase letter.",
								// Lowercase letter validation
								hasLowercase: (v: string) =>
									/[a-z]/.test(v) || "Password must contain at least one lowercase letter.",
								// Number validation
								hasNumber: (v: string) =>
									/\d/.test(v) || "Password must contain at least one number.",
								// Special character validation
								hasSpecial: (v: string) =>
									/[!@#$%^&*()]/.test(v) ||
									"Password must contain a special character (!@#$%^&*()).",
							},
						}}
						label='Password'
						placeholder='••••••••'
						secure={true}
						error={errors.password}
					/>
					{/* Password errors */}
					{errors.password?.types &&
						Object.values(errors.password.types).map((msg, i) => (
							<Text key={i} style={[GlobalStyles.error, { paddingLeft: 16 }]}>
								{msg}
							</Text>
						))}
				</View>

				{/* Confirm password input */}
				<View style={{ gap: 4 }}>
					<LoginInput
						control={control}
						name='confirmPassword'
						rules={{
							required: "Please confirm your password.",
							maxLength: { value: 64, message: "Password can not be longer than 64 characters." },
							validate: (v: string) => v === getValues("password") || "Passwords do not match",
						}}
						label='Confirm Password'
						placeholder='••••••••'
						secure={true}
						error={errors.confirmPassword}
					/>
					{/* Confirm password errors */}
					{errors.confirmPassword && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.confirmPassword.message?.toString()}
						</Text>
					)}
				</View>
			</View>

			{/* Sign Up Button: Form submission button */}
			<CustomPressable
				type='primary'
				title={loading.signUp ? "Signing Up..." : "Sign Up"}
				disabled={loading.signUp}
				onPress={handleSubmit(handleSignUp)}
			/>

			{/* Other backend errors */}
			{errors.root && (
				<Text style={[GlobalStyles.error, { textAlign: "center" }]}>{errors.root.message}</Text>
			)}

			{/* Switch Form Button: Allows user to switch to the login component */}
			<View style={{ flexDirection: "row", justifyContent: "center" }}>
				<Text style={GlobalStyles.paragraph}>Already Registered? </Text>
				<TouchableOpacity onPress={() => setForm((prev) => !prev)}>
					<Text style={GlobalStyles.link}>Login</Text>
				</TouchableOpacity>
			</View>

			{/* Sign Up using third party -- Google, Facebook, Apple */}
			<ThirdPartyLogin />
		</>
	)
}
