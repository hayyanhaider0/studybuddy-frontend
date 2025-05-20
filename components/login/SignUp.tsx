/**
 * SignUp.tsx
 *
 * Contains the sign up logic and component
 * Allows the user to toggle to the Login component if needed
 */

import { View, Text, TouchableOpacity } from "react-native"
import LoginInput from "./LoginInput"
import { GlobalStyles } from "../../styles/global"
import { styles } from "../../styles/login"
import { useForm } from "react-hook-form"
import CustomTouchableOpacity from "../common/CustomTouchableOpacity"
import ThirdPartyLogin from "./ThirdPartyLogin"

/**
 * Sets the type for setForm to boolean in component props
 */
type SignUpProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SignUp({ setForm }: SignUpProps) {
	/**
	 * Get form variables
	 */
	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({ criteriaMode: "all" })

	/**
	 * Handles sign up button press, sends form data to the backend.
	 *
	 * @param data - Data from the form
	 */
	const handleSignUp = (data: any) => {
		console.log(data)
	}

	return (
		<>
			{/* Input Container: Contains user input boxes */}
			<View style={styles.inputContainer}>
				{/* Email input */}
				<LoginInput
					control={control}
					name='email'
					rules={{
						required: "Email is required.",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Please enter a valid email address.",
						},
					}}
					label='Email'
					placeholder='email@example.com'
					error={errors.email}
				/>

				{/* Username input */}
				<LoginInput
					control={control}
					name='username'
					rules={{ required: "Username is required." }}
					label='Username'
					placeholder='Username'
					error={errors.username}
				/>

				{/* Password input */}
				<LoginInput
					control={control}
					name='password'
					rules={{
						required: "Password is required.",
						validate: {
							// Mininmum length validation
							minLength: (v: string) =>
								v?.length >= 8 || "Password must be at least 8 characters long.",
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
								/[!@#$%^&*()]/.test(v) || "Password must contain a special character (!@#$%^&*()).",
						},
					}}
					label='Password'
					placeholder='••••••••'
					secure={true}
					error={errors.password}
				/>

				{/* Confirm password input */}
				<LoginInput
					control={control}
					name='confirmPassword'
					rules={{
						required: "Please confirm your password.",
						// Passwords must match validation
						validate: (value: string) =>
							value === getValues("password") || "Passwords do not match.",
					}}
					label='Confirm Password'
					placeholder='••••••••'
					secure={true}
					error={errors.confirmPassword}
				/>
			</View>

			{/* Error box. Conditionally shows up when there are errors. */}
			{Object.values(errors).length > 0 && (
				<View style={styles.errors}>
					{/* Email errors */}
					{errors.email && <Text style={styles.errorMsg}>{errors.email.message?.toString()}</Text>}

					{/* Username errors */}
					{errors.username && (
						<Text style={styles.errorMsg}>{errors.username.message?.toString()}</Text>
					)}

					{/* Password errors */}
					{errors.password?.types &&
						Object.values(errors.password.types).map((msg, i) => (
							<Text key={i} style={styles.errorMsg}>
								{msg}
							</Text>
						))}

					{/* Confirm password errors */}
					{errors.confirmPassword && (
						<Text style={styles.errorMsg}>{errors.confirmPassword.message?.toString()}</Text>
					)}
				</View>
			)}

			{/* Sign Up Button: Form submission button */}
			<CustomTouchableOpacity text='Sign Up' onPress={handleSubmit(handleSignUp)} />

			{/* Switch Form Button: Allows user to switch to the login component */}
			<View style={{ flexDirection: "row", justifyContent: "center" }}>
				<Text style={GlobalStyles.paragraph}>Already Registered? </Text>
				<TouchableOpacity onPress={() => setForm((prev: boolean) => !prev)}>
					<Text style={GlobalStyles.link}>Login</Text>
				</TouchableOpacity>
			</View>

			{/* Sign Up using third party -- Google, Facebook, Apple */}
			<ThirdPartyLogin />
		</>
	)
}
