import { View, Text, TextInput } from "react-native"
import CustomPressable from "../components/common/CustomPressable"
import { useThemeContext } from "../contexts/ThemeContext"
import LoginInput from "../components/login/LoginInput"
import { useForm } from "react-hook-form"
import { NavProp } from "../types/global"
import useAuthApi from "../hooks/useAuthApi"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { useEffect, useRef, useState } from "react"
import { getLoginStyles } from "../styles/login"
import CustomScrollView from "../components/common/CustomScrollView"
import { LoginRequest } from "../types/auth"

export default function ForgotPasswordScreen() {
	const ENABLE_RESEND_TIMER = 60000 // 1m
	const CODE_LENGTH = 6

	const nav = useNavigation<NavProp<"reset">>()
	const route = useRoute<RouteProp<RootStackParamList, "forgot">>()
	const prefillLogin = route.params?.login ?? ""
	const inputRefs = useRef<Array<TextInput | null>>([])
	const [code, setCode] = useState(Array(CODE_LENGTH).fill(""))
	const [email, setEmail] = useState<string | null>(null)
	const [disableSend, setDisableSend] = useState(false)

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)
	const { reset, verifyReset, loading } = useAuthApi()

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

	const handleReset = async () => {
		const login = getValues("login")
		const res = await reset(login)

		setDisableSend(true)

		if (res.success) {
			clearErrors("login")
			setEmail(res.data.email)
		} else {
			setError("login", { message: res.error || "Reset failed. Try again." })
		}

		setTimeout(() => setDisableSend(true), ENABLE_RESEND_TIMER)
	}

	const verifyCode = async (resetCode: string) => {
		if (!email) {
			setError("root", { message: "Unexpected error occurred. Try again." })
			return
		}

		const res = await verifyReset(email, resetCode)

		if (res.success) {
			clearErrors("login")
			clearErrors("root")
			nav.navigate("reset", { email })
		} else {
			setError("root", { message: res.error || "Invalid or expired reset code." })
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
				title={loading.reset ? "Sending reset code..." : "Send"}
				disabled={loading.reset || disableSend}
				onPress={handleReset}
			/>

			{loading.verify && <Text style={GlobalStyles.paragraph}>Verifying...</Text>}
		</CustomScrollView>
	)
}
