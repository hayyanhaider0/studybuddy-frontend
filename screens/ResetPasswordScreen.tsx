import { View, Text } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import LoginInput from "../components/login/LoginInput"
import { useForm } from "react-hook-form"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import CustomScrollView from "../components/common/CustomScrollView"
import CustomPressable from "../components/common/CustomPressable"
import useResetPassword from "../hooks/auth/useResetPassword"

export default function ResetPasswordScreen() {
	const route = useRoute<RouteProp<RootStackParamList, "reset">>()
	const email = route.params?.email ?? ""

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
		setError,
	} = useForm<{ password: string; confirmPassword: string }>({ criteriaMode: "all" })

	// Get reset password mutation.
	const resetPasswordMutation = useResetPassword(setError)

	// Handle the user pressing the reset button.
	const handleResetPassword = async () => {
		resetPasswordMutation.mutate({
			email,
			password: getValues("password"),
			confirmPassword: getValues("confirmPassword"),
		})
	}

	return (
		<CustomScrollView contentStyle={{ paddingTop: 64, padding: 32, gap: 32 }}>
			<Text style={GlobalStyles.heading}>Enter Your New Password</Text>
			<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
				Enter a new password for the account associated with the email: {email}
			</Text>

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
					label='New Password'
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
					label='Confirm New Password'
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
				title={resetPasswordMutation.isPending ? "Resetting Password..." : "Reset"}
				disabled={resetPasswordMutation.isPending}
				onPress={handleSubmit(handleResetPassword)}
			/>
		</CustomScrollView>
	)
}
