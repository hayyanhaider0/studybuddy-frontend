import { ScrollView, View, Text, Image } from "react-native"
import tinycolor from "tinycolor2"
import CustomPressable from "../components/common/CustomPressable"
import { useThemeContext } from "../contexts/ThemeContext"
import LoginInput from "../components/login/LoginInput"
import { useForm } from "react-hook-form"
import { NavProp } from "../types/global"
import useAuthApi from "../hooks/useAuthApi"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"

export default function ResetPasswordScreen() {
	const route = useRoute<RouteProp<RootStackParamList, "reset">>()
	const email = route.params?.email ?? ""
	const nav = useNavigation<NavProp<"login">>()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const { resetPassword, loading } = useAuthApi()

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
		setError,
	} = useForm<{ password: string; confirmPassword: string }>({ criteriaMode: "all" })

	const handleResetPassword = async () => {
		const res = await resetPassword(email, getValues("password"), getValues("confirmPassword"))

		if (res.success) {
			nav.navigate("login", { email })
		} else {
			setError("root", { message: res.error || "An unknown error has occurred" })
		}
	}

	return (
		<ScrollView
			contentContainerStyle={[GlobalStyles.container, { padding: 32, gap: 32 }]}
			keyboardShouldPersistTaps='handled'
		>
			<Image
				source={require("../assets/study-buddy-logo.png")}
				style={{ width: 180, height: 180, alignSelf: "center" }}
				tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
			/>
			<Text style={GlobalStyles.subheading}>Enter Your Email Or Username</Text>

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
								/[!@#$%^&*()]/.test(v) || "Password must contain a special character (!@#$%^&*()).",
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

			{/* Root errors */}
			{errors.root && (
				<Text style={[GlobalStyles.error, { textAlign: "center" }]}>{errors.root.message}</Text>
			)}

			<CustomPressable
				type='primary'
				title={loading.resetPassword ? "Resetting Password..." : "Reset"}
				disabled={loading.resetPassword}
				onPress={handleSubmit(handleResetPassword)}
			/>
		</ScrollView>
	)
}
