/**
 * LoginScreen Component
 *
 * Includes toggleable login and signup components.
 * For more information check out Login.tsx and SignUp.tsx
 */

import { Text, View, Image, ScrollView } from "react-native"
import { useState } from "react"
import Login from "../components/login/Login"
import SignUp from "../components/login/SignUp"
import { useThemeContext } from "../contexts/ThemeContext"
import { getLoginStyles } from "../styles/login"

export default function LoginScreen() {
	const [form, setForm] = useState(false) // Toggle between Login and SignUp components
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors)

	return (
		<View style={GlobalStyles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={[styles.screen, { maxWidth: 1024, alignSelf: "center" }]}
			>
				{/* Introduction to Study Buddy: Contains the logo and small description */}
				<View style={{ paddingBottom: 32 }}>
					<Image
						source={require("../assets/study-buddy-logo.png")}
						style={{ width: 180, height: 180, alignSelf: "center" }}
					/>
					<Text style={GlobalStyles.paragraph}>
						Your personal AI-powered study assistant. Organize notes, stay focused, and study
						smarter — all in one place.
					</Text>
				</View>

				{/* Login and SignUp forms depending on state */}
				<View style={{ gap: 32, marginBottom: 96 }}>
					{form ? <SignUp setForm={setForm} /> : <Login setForm={setForm} />}
				</View>
			</ScrollView>
		</View>
	)
}
