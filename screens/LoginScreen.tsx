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
import tinycolor from "tinycolor2"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"

export default function LoginScreen() {
	const route = useRoute<RouteProp<RootStackParamList, "login">>()
	const prefillEmail = route.params?.email ?? ""

	const [form, setForm] = useState(false) // Toggle between Login and SignUp components

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	return (
		<View style={[GlobalStyles.container, { paddingHorizontal: 32 }]}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 32, paddingVertical: 32 }}
			>
				{/* Introduction to Study Buddy: Contains the logo and small description */}
				<View>
					<Image
						source={require("../assets/study-buddy-logo.png")}
						style={{ width: 180, height: 180, alignSelf: "center" }}
						tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
					/>
					<Text style={GlobalStyles.paragraph}>
						Your personal AI-powered study assistant. Organize notes, stay focused, and study
						smarter — all in one place.
					</Text>
				</View>

				{/* Login and SignUp forms depending on state */}
				<View style={{ gap: 32 }}>
					{form ? (
						<SignUp setForm={setForm} />
					) : (
						<Login setForm={setForm} prefillEmail={prefillEmail} />
					)}
				</View>
			</ScrollView>
		</View>
	)
}
