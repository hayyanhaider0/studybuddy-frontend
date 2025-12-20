import { View, Text, TextInput } from "react-native"
import CustomPressable from "../features/common/components/CustomPressable"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import LoginInput from "../features/auth/components/LoginInput"
import { useForm } from "react-hook-form"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { useEffect, useRef, useState } from "react"
import { getLoginStyles } from "../styles/login"
import CustomScrollView from "../features/common/components/CustomScrollView"
import useVerifyReset from "../features/auth/hooks/useVerifyReset"
import useForgotPassword from "../features/auth/hooks/useForgotPassword"
import { LoginRequest } from "../features/auth/api/api"
import { ApiResponse } from "../types/global"

export default function ForgotPasswordScreen() {
	const ENABLE_RESEND_TIMER = 60000 // 1m
	const CODE_LENGTH = 6

	const route = useRoute<RouteProp<RootStackParamList, "forgot">>()
	const prefillLogin = route.params?.login ?? ""
	const inputRefs = useRef<Array<TextInput | null>>([])
	const [code, setCode] = useState(Array(CODE_LENGTH).fill(""))
	const [email, setEmail] = useState<string | null>(null)
	const [disableSend, setDisableSend] = useState(false)

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	const {
		control,
		formState: { errors },
		getValues,
		setError,
		clearErrors,
	} = useForm<LoginRequest>({
		defaultValues: {
			login: prefillLogin || "", // prefill the login field.
			password: "",
		},
	}) // Form handling

	// Get reset password mutation.
	const resetPasswordMutation = useForgotPassword(setError)
	// Get verify reset mutation.
	const verifyResetMutation = useVerifyReset(setError)

	// Handle the user pressing the send button.
	const handleReset = async () => {
		const login = getValues("login")

		resetPasswordMutation.mutate(
			{ login },
			{
				onSuccess: (data: ApiResponse<{ email: string }>) => {
					clearErrors("login")
					setEmail(data.data!.email)
					setDisableSend(true)
					setTimeout(() => setDisableSend(false), ENABLE_RESEND_TIMER)
				},
			}
		)
	}

	// Verify the code entered by the user.
	const verifyCode = async (code: string) => {
		if (!email) {
			setError("root", { message: "An unexpected error occured." })
		} else {
			verifyResetMutation.mutate({ email, code })
		}
	}

	useEffect(() => {
		if (code.every((digit) => digit.length === 1)) {
			const resetCode = code.join("")
			// Call API for verification
			verifyCode(resetCode)
		}
	}, [code])

	return (
		<CustomScrollView contentStyle={{ padding: 32, paddingTop: 64, gap: 32 }}>
			<Text style={GlobalStyles.heading}>Forgot Password?</Text>
			{email ? (
				<View style={{ gap: 16 }}>
					<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
						{Array.from({ length: CODE_LENGTH }).map((_, i) => (
							<TextInput
								key={i}
								ref={(el) => {
									inputRefs.current[i] = el
								}}
								style={styles.verificationCodeContainer}
								maxLength={1}
								keyboardType='numeric'
								onChangeText={(text) => {
									const newCode = [...code]
									newCode[i] = text
									setCode(newCode)

									if (text && i < 5) {
										inputRefs.current[i + 1]?.focus()
									}
								}}
								onKeyPress={({ nativeEvent }) => {
									if (nativeEvent.key === "Backspace" && i > 0) {
										inputRefs.current[i - 1]?.focus()
									}
								}}
							/>
						))}
					</View>
					<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
						A reset code has been sent to {email}. The code will expire in 1 hour. You can resend
						the code after 1 minute.
					</Text>
					{/* Root error */}
					{errors.root && (
						<Text style={[GlobalStyles.error, { textAlign: "center" }]}>
							{errors.root.message?.toString()}
						</Text>
					)}
				</View>
			) : (
				<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
					Don't worry! Enter your email or username, and we will help you reset it! If you dont
					remember your email, you can enter your username too.
				</Text>
			)}

			{/* Email input */}
			<View style={{ gap: 4 }}>
				<LoginInput
					control={control}
					name='login'
					rules={{
						required: "Please enter your email/username.",
						minLength: { value: 4, message: "Email/Username must be at least 4 characters long." },
						maxLength: {
							value: 254,
							message: "Email/Username can not be longer than 254 characters.",
						},
					}}
					label='Email'
					placeholder='email@example.com'
					error={errors.login}
				/>

				{/* Email/Username error */}
				{errors.login && (
					<Text style={[GlobalStyles.error, { paddingLeft: 16 }]}>
						{errors.login.message?.toString()}
					</Text>
				)}
			</View>

			<CustomPressable
				type='primary'
				title={resetPasswordMutation.isPending ? "Sending reset code..." : "Send"}
				disabled={resetPasswordMutation.isPending || disableSend}
				onPress={handleReset}
			/>

			{verifyResetMutation.isPending && <Text style={GlobalStyles.paragraph}>Verifying...</Text>}
		</CustomScrollView>
	)
}
