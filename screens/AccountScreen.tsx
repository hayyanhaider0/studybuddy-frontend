/**
 * AccountScreen Component
 *
 * Contains all the information and components related to the user's account, including
 * user details, study streak, etc.
 */

import { ScrollView, View, Text } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import DetailView from "../components/account/DetailView"

export default function AccountScreen() {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	// FAKE DATA
	const predictedGrades = [
		{ course: "COMP 2080 - Analysis of Algorithms", grade: "A+" },
		{ course: "COMP 2150 - Object Orientation", grade: "A" },
		{ course: "MATH 1240 - Elementary Discrete Mathematics", grade: "A-" },
		{ course: "STAT 1000 - Basic Statistical Analysis", grade: "B+" },
		{ course: "COMP 2140 - Data Structures and Algorithms", grade: "A" },
	]

	return (
		<ScrollView style={[GlobalStyles.container, { padding: 8 }]}>
			<View style={{ flex: 1, marginBottom: 8 }}>
				{/* Account details box */}
				<DetailView
					variant='hinted'
					header='Account Details'
					onPress={() => console.log("edit account")}
					hintText='Edit Account Details'
					hintIcon='account-edit'
				>
					{/* Icon -- to be changed to user profile picture */}
					<MaterialC name='account-circle-outline' size={64} color={theme.colors.textPrimary} />
					{/* Account details */}
					<View style={{ gap: 4 }}>
						<Text style={[GlobalStyles.subheading, { textAlign: "left" }]}>Hayyan Haider</Text>
						<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>Student</Text>
					</View>
				</DetailView>
				{/* Study Streak box */}
				<DetailView
					variant='plain'
					header='Study Streak'
					onPress={() => console.log("Tooltip")}
					style={{ justifyContent: "space-between" }}
				>
					<View style={{ gap: 4 }}>
						<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>
							Current Study Streak
						</Text>
						{/* Current streak */}
						<Text style={[GlobalStyles.subheading, { textAlign: "left" }]}>6 Days</Text>
					</View>
					<MaterialC name='fire' size={64} color={theme.colors.textPrimary} />
				</DetailView>
				{/* Grade Predictions box */}
				<DetailView
					variant='hinted'
					header='Predictions'
					onPress={() => console.log("manage predictions")}
					hintText='Manage Notebooks'
					hintIcon='square-edit-outline'
					style={{ justifyContent: "space-between" }}
				>
					<View style={{ gap: 4, width: "60%" }}>
						<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>Predicted Grades</Text>
						{/* Conditional: Show predicted grades if notebooks are added to predictions */}
						{predictedGrades.length > 0 ? (
							predictedGrades.map((pg, i) => (
								<View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
									<Text
										style={[GlobalStyles.paragraph, { textAlign: "left" }]}
										numberOfLines={1}
										ellipsizeMode='middle'
									>
										{pg.course}:
									</Text>
									<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{pg.grade}</Text>
								</View>
							))
						) : (
							<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>
								Add Notebooks by tapping on the edit icon on the top right of this box to get
								predictions.
							</Text>
						)}
					</View>
					<MaterialC name='chart-line' size={64} color={theme.colors.textPrimary} />
				</DetailView>
				{/* Subscription box */}
				<DetailView
					variant='hinted'
					header='Subscription'
					onPress={() => console.log("Manage subscription")}
					hintText='Manage Subscription'
					hintIcon='credit-card-edit'
					style={{ justifyContent: "space-between", alignItems: "center" }}
				>
					<View style={{ width: "30%", alignItems: "center" }}>
						{/* Current plan */}
						<MaterialC name='crown' size={64} color={theme.colors.textPrimary} />
						<Text style={GlobalStyles.paragraph}>Pro Plan</Text>
						<Text style={GlobalStyles.subtext}>Renews Jul 22, 2025</Text>
					</View>
					<View style={{ width: "70%", gap: 4 }}>
						{/* Recommended plan */}
						<Text style={GlobalStyles.paragraph}>Recommended Plan</Text>
						<Text style={[GlobalStyles.paragraph, { fontWeight: "light" }]}>
							You are already on our recommended plan!
						</Text>
						{/* Feedback */}
						<Text style={[GlobalStyles.link, { textAlign: "center" }]}>Send Us Feedback!</Text>
					</View>
				</DetailView>
				{/* Footer box */}
				<DetailView variant='plain' header='Study Buddy' onPress={() => console.log("info")}>
					<View>
						<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>
							Made by students, for students, with ❤️.
						</Text>
						{/* Copyright */}
						<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>
							© {new Date().getFullYear()} Study Buddy
						</Text>
					</View>
				</DetailView>
			</View>
		</ScrollView>
	)
}
