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

/**
 * Sets the type for setForm to boolean in component props
 */
type LoginProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Login({ setForm }: LoginProps) {
	const nav = useNavigation<NavProp<"main">>() // Navigation controller

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm() // Form handling

	/**
	 * Handles login operation.
	 *
	 * Sends a backend request and authorizes user to enter their account.
	 *
	 * @param data - Data from the form
	 */
	const handleLogin = (data: any) => {
		console.log(data)

		nav.navigate("main")
	}

	/**
	 * Handles forgot password click.
	 *
	 * Takes user to a forgot password screen to allow them to change their password.
	 */
	const handleForgotPassword = () => {
		console.log("forgot password")

		nav.navigate("main") // REMOVE THIS LINE
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
							required: "Please enter your email.",
							validate: {
								minLength: (v: string) => v.length >= 4 || "Please enter a valid email address.",
							},
						}}
						label='Email'
						placeholder='email@example.com'
						error={errors.email}
					/>

					{/* Email error */}
					{errors.email && (
						<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
							{errors.email.message?.toString()}
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
							validate: {
								minLength: (v: string) =>
									v.length >= 8 || "Password must be at least 8 characters long.",
							},
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
			<CustomPressable type='primary' title='Login' onPress={handleSubmit(handleLogin)} />

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
