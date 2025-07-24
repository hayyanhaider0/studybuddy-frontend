/**
 * VerificationScreen Component
 *
 * Includes the logic and UI for user verification including sending a verification code
 * to the user's email, and resending it.
 */

import { Text, View, TextInput, Image } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import { useEffect, useRef, useState } from "react"
import CustomPressable from "../components/common/CustomPressable"
import { msToMinutesSeconds } from "../utils/date"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { NavProp } from "../types/global"
import { RootStackParamList } from "../navigation/Navigation"
import { getLoginStyles } from "../styles/login"
import useAuthApi from "../hooks/useAuthApi"
import tinycolor from "tinycolor2"
import { ScrollView } from "react-native-gesture-handler"

type VerificationScreenProps = {
	route: RouteProp<RootStackParamList, "verify">
}

export default function VerificationScreen({ route }: VerificationScreenProps) {
	// DEFAULTS
	const VERIFICATION_CODE_LENGTH = 6
	const COUNTDOWN_TIMER = 300000 // 5m
	const ENABLE_RESEND_TIMER = 60000 // 1m

	const nav = useNavigation<NavProp<"main">>() // Navigation
	const { email } = route.params

	// Context values
	const { verify, resend, loading } = useAuthApi()

	// Verification code variables
	const inputRefs = useRef<Array<TextInput | null>>([])
	const [code, setCode] = useState(Array(VERIFICATION_CODE_LENGTH).fill(""))
	const [countdown, setCountdown] = useState(COUNTDOWN_TIMER)
	const [disableResend, setDisableResend] = useState(false)
	const [error, setError] = useState<string | null>("")

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

	/**
	 * Verifies the code entered by the user with the database.
	 *
	 * @param code - Code entered by the user.
	 */
	const verifyCode = async (code: string) => {
		const res = await verify(email, code)

		if (res.success) {
			// If successful, go to the login screen.
			setError(null)
			nav.navigate("login", { email })
		} else {
			// If unsuccessful, show the error.
			setError(res.error)
		}
	}

	// Sends a new verification code to the user's email.
	const resendVerification = async () => {
		const res = await resend(email)

		if (res.success) {
			setError(null)
			setCountdown(COUNTDOWN_TIMER)
			setCode(Array(VERIFICATION_CODE_LENGTH).fill(""))
			setDisableResend(true)

			// Clear all input fields and focus on the first one.
			inputRefs.current.forEach((ref) => ref?.clear())
			inputRefs.current[0]?.focus()

			// Enable resend button after 10 seconds.
			setTimeout(() => setDisableResend(false), ENABLE_RESEND_TIMER)
		} else {
			setError(res.error)
		}
	}

	useEffect(() => {
		if (countdown <= 0) return // Stop countdown

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1000)
		}, 1000)

		return () => clearInterval(timer)
	}, [countdown])

	useEffect(() => {
		if (code.every((digit) => digit.length === 1)) {
			const verificationCode = code.join("")
			// Call API for verification
			verifyCode(verificationCode)
		}
	}, [code])

	return (
		<ScrollView
			contentContainerStyle={[GlobalStyles.container, { padding: 32, gap: 16 }]}
			keyboardShouldPersistTaps='handled'
		>
			<Image
				source={require("../assets/study-buddy-logo.png")}
				style={{ width: 180, height: 180, alignSelf: "center" }}
				tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
			/>
			<Text style={GlobalStyles.heading}>Enter Your Verification Code</Text>
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
			{loading.verify && <Text style={GlobalStyles.paragraph}>Verifying...</Text>}
			{error && <Text style={[GlobalStyles.error, { textAlign: "center" }]}>{error}</Text>}
			<Text style={[GlobalStyles.paragraph, { color: theme.colors.textSecondary }]}>
				A verification code has been sent to {email}. Please verify your email to proceed to Study
				Buddy. The code will expire in 5 minutes. You can resend the verification code if you have
				not verified your email.
			</Text>
			<CustomPressable
				type='link'
				title={loading.resend ? "Resending verifcation code..." : "Resend"}
				disabled={loading.resend || disableResend}
				onPress={resendVerification}
			/>
			<Text style={GlobalStyles.paragraph}>Time Remaining: {msToMinutesSeconds(countdown)}</Text>
		</ScrollView>
	)
}
