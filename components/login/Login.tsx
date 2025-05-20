/**
 * Login.tsx
 *
 * Contains the login logic and component
 * Allows the user to toggle to the Login component if needed
 */

import { View, Text, TouchableOpacity } from "react-native"
import LoginInput from "./LoginInput"
import { styles } from "../../styles/login"
import { GlobalStyles } from "../../styles/global"
import { useForm } from "react-hook-form"
import CustomTouchableOpacity from "../common/CustomTouchableOpacity"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../navigation/types"
import ThirdPartyLogin from "./ThirdPartyLogin"

/**
 * Sets the type for setForm to boolean in component props
 */
type LoginProps = {
	setForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Login({ setForm }: LoginProps) {
	const nav = useNavigation<NavProp<"canvas">>()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm()

	/**
	 * Handles login operation.
	 *
	 * Sends a backend request and authorizes user to enter their account.
	 *
	 * @param data - Data from the form
	 */
	const handleLogin = (data: any) => {
		console.log(data)

		nav.navigate("canvas")
	}

	/**
	 * Handles forgot password click.
	 *
	 * Takes user to a forgot password screen to allow them to change their password.
	 */
	const handleForgotPassword = () => {
		console.log("forgot password")

		nav.navigate("canvas") // REMOVE THIS LINE
	}

	return (
		<>
			{/* Input Container: Contains user input boxes */}
			<View style={styles.inputContainer}>
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
			</View>

			<TouchableOpacity style={{ alignItems: "center" }} onPress={handleForgotPassword}>
				<Text style={[GlobalStyles.link, { fontSize: 16 }]}>Forgot Password?</Text>
			</TouchableOpacity>

			{Object.values(errors).length > 0 && (
				<View style={styles.errors}>
					{errors.email && <Text style={styles.errorMsg}>{errors.email.message?.toString()}</Text>}
					{errors.password && (
						<Text style={styles.errorMsg}>{errors.password.message?.toString()}</Text>
					)}
				</View>
			)}

			{/* Login Button: Form submission button */}
			<CustomTouchableOpacity text='Login' onPress={handleSubmit(handleLogin)} />

			{/* Switch Form Button: Allows user to switch to the sign up component */}
			<View style={{ flexDirection: "row", justifyContent: "center" }}>
				<Text style={GlobalStyles.paragraph}>Don't have an account? </Text>
				<TouchableOpacity onPress={() => setForm((prev: boolean) => !prev)}>
					<Text style={GlobalStyles.link}>Register Now</Text>
				</TouchableOpacity>
			</View>

			{/* Login using third party -- Google, Facebook, Apple */}
			<ThirdPartyLogin />
		</>
	)
}
