/**
 * VerificationScreen Component
 *
 * Includes the logic and UI for user verification including sending a verification code
 * to the user's email, and resending it.
 */

import { Text, View, TextInput, Image } from "react-native"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import { useEffect, useRef, useState } from "react"
import CustomPressable from "../features/common/components/CustomPressable"
import { msToMinutesSeconds } from "../utils/date"
import { RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { getLoginStyles } from "../styles/login"
import tinycolor from "tinycolor2"
import CustomScrollView from "../features/common/components/CustomScrollView"
import useResend from "../features/auth/hooks/useResend"
import useVerifyEmail from "../features/auth/hooks/useVerifyEmail"
import { ApiResponse } from "../types/global"

type VerificationScreenProps = {
	route: RouteProp<RootStackParamList, "verify">
}

export default function VerificationScreen({ route }: VerificationScreenProps) {
	// DEFAULTS
	const VERIFICATION_CODE_LENGTH = 6
	const COUNTDOWN_TIMER = 300000 // 5m
	const ENABLE_RESEND_TIMER = 60000 // 1m

	const { email } = route.params

	// Verification code variables
	const inputRefs = useRef<Array<TextInput | null>>([])
	const [code, setCode] = useState(Array(VERIFICATION_CODE_LENGTH).fill(""))
	const [countdown, setCountdown] = useState(COUNTDOWN_TIMER)
	const [disableResend, setDisableResend] = useState(false)
	const [error, setError] = useState<string | null>("")

	// Get verification mutation.
	const verifyMutation = useVerifyEmail(setError)
	// Get resend mutation.
	const resendMutation = useResend(setError)

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	/**
	 * Verifies the code entered by the user with the database.
	 *
	 * @param code - Code entered by the user.
	 */
	const verifyCode = async (code: string) => {
		verifyMutation.mutate({ email, code })
	}

	// Sends a new verification code to the user's email.
	const resendVerification = async () => {
		resendMutation.mutate(
			{ email },
			{
				onSuccess: (data: ApiResponse<void>) => {
					if (data.success) {
						setError(null)
						setCountdown(COUNTDOWN_TIMER)
						setCode(Array(VERIFICATION_CODE_LENGTH).fill(""))
						setDisableResend(true)

						// Clear all inputs and focus on the first one.
						inputRefs.current.forEach((ref) => ref?.clear())
						inputRefs.current[0]?.focus()

						// Enable resend button after 1 minute.
						setTimeout(() => setDisableResend(false), ENABLE_RESEND_TIMER)
					} else {
						setError(data.error || "Failed to resend verification code.")
					}
				},
			}
		)
	}

	// Controls the countdown timer.
	useEffect(() => {
		if (countdown <= 0) return // Stop countdown

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1000)
		}, 1000)

		return () => clearInterval(timer)
	}, [countdown])

	// Verify the code when the user has entered it.
	useEffect(() => {
		if (code.every((digit) => digit.length === 1)) {
			const verificationCode = code.join("")
			// Call API for verification
			verifyCode(verificationCode)
		}
	}, [code])

	return (
		<CustomScrollView contentStyle={{ paddingTop: 64, padding: 32, gap: 16 }}>
			{/* Study Buddy Logo. */}
			<Image
				source={require("../assets/study-buddy-logo.png")}
				style={{ width: 180, height: 180, alignSelf: "center" }}
				tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
			/>
			<Text style={GlobalStyles.heading}>Enter Your Verification Code</Text>
			{/* Verification code component. */}
			<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
				{Array.from({ length: VERIFICATION_CODE_LENGTH }).map((_, i) => (
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
			{/* Loading message for verification. */}
			{verifyMutation.isPending && <Text style={GlobalStyles.paragraph}>Verifying...</Text>}
			{/* Error message for verification. */}
			{error && <Text style={[GlobalStyles.error, { textAlign: "center" }]}>{error}</Text>}
			{/* Show user email and instructions. */}
			<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
				A verification code has been sent to {email}. Please verify your email to proceed to Study
				Buddy. The code will expire in 5 minutes. You can resend the verification code if you have
				not verified your email.
			</Text>
			{/* Resend Button */}
			<CustomPressable
				type='link'
				title={resendMutation.isPending ? "Resending verifcation code..." : "Resend"}
				disabled={resendMutation.isPending || disableResend}
				onPress={resendVerification}
			/>
			{/* Show resend timer. */}
			<Text style={GlobalStyles.paragraph}>Time Remaining: {msToMinutesSeconds(countdown)}</Text>
		</CustomScrollView>
	)
}
