import { Text, View, Image } from "react-native"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import tinycolor from "tinycolor2"
import CustomPressable from "../features/common/components/CustomPressable"
import { EducationLevel, Occupation, useAuthContext } from "../features/auth/contexts/AuthContext"
import { Choice } from "../features/common/contexts/ModalContext"
import { educationLevelLabels, occupationLabels } from "../utils/formatters"
import Select from "../features/common/components/Select"
import HorizontalRule from "../features/common/components/HorizontalRule"
import { updateUser } from "../features/auth/api/api"
import { useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useState } from "react"
import { AxiosError } from "axios"

export default function AccountPreferences() {
	const [error, setError] = useState<string | null>(null)

	// Get values from context.
	const { authState, setAuthState } = useAuthContext()
	const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const [occupationChoicesState, setOccupationChoicesState] = useState(
		Object.entries(occupationLabels).map(([k, v]) => ({
			label: v,
			selected: authState.occupation === k,
		}))
	)

	const [educationChoicesState, setEducationChoicesState] = useState(
		Object.entries(educationLevelLabels).map(
			([k, v]) => ({ label: v, selected: authState.educationLevel === k } as Choice)
		)
	)

	const handleUpdateUser = (occ: Occupation, edu: EducationLevel) => {
		if (!authState.username) {
			console.error(
				"Error [ACCOUNT_PREFERENCES_SCREEN/handleUpdateUser]: Username not found in authState."
			)
			return
		}

		updateUser({ username: authState.username, occupation: occ, educationLevel: edu }).catch(
			(e: AxiosError) => console.warn("Non-critical update failed:", e.message)
		)

		nav.navigate("main")
	}

	const skip = () => {
		if (!authState.occupation) setAuthState({ ...authState, occupation: "NA" })
		if (!authState.educationLevel) setAuthState({ ...authState, educationLevel: "NA" })
		handleUpdateUser("NA", "NA")
	}

	const confirm = async () => {
		const updates: Partial<{ occupation: Occupation; educationLevel: EducationLevel }> = {}

		if (!authState.occupation || !authState.educationLevel) {
			setError("Please select an occupation and an education level.")
		} else if (!authState.occupation) {
			setError("Please select an occupation.")
		} else if (!authState.educationLevel) {
			setError("Please select an education level.")
		} else if (authState.occupation && authState.educationLevel) {
			setError(null)
			updates.occupation = authState.occupation
			updates.educationLevel = authState.educationLevel
			handleUpdateUser(updates.occupation, updates.educationLevel)
		}
	}

	return (
		<View style={[GlobalStyles.container, { padding: 24 }]}>
			<CustomScrollView contentStyle={{ gap: 16, minHeight: "100%" }}>
				<Image
					source={require("../assets/study-buddy-logo.png")}
					style={{ width: 180, height: 180, alignSelf: "center" }}
					tintColor={tinycolor(theme.colors.background).isDark() ? "#fff" : "#000"}
				/>
				<Text style={GlobalStyles.subheading}>Welcome to Study Buddy!</Text>
				<Text style={GlobalStyles.paragraph}>
					Select the following options to personalize Study Buddy. These options only exist to
					provide better and more personalized results while using AI. You can change these later.
				</Text>

				<View>
					<HorizontalRule />
					<Select
						title='Occupation'
						choices={occupationChoicesState}
						onSelect={(index) => {
							const choiceLabel = occupationChoicesState[index].label

							// Find the key in occupationLabels that matches the label
							const occupationKey = Object.entries(occupationLabels).find(
								([_, label]) => label === choiceLabel
							)?.[0] as Occupation | undefined

							if (occupationKey) {
								const updatedChoices = occupationChoicesState.map((c, i) => ({
									...c,
									selected: i === index,
								}))
								setOccupationChoicesState(updatedChoices)
								setAuthState({ ...authState, occupation: occupationKey })
							}
						}}
					/>
					<Select
						title='Education Level'
						choices={educationChoicesState}
						onSelect={(index) => {
							const choiceLabel = educationChoicesState[index].label

							// Find the key in educationLabels that matches the label
							const educationKey = Object.entries(educationLevelLabels).find(
								([_, label]) => label === choiceLabel
							)?.[0] as EducationLevel | undefined

							if (educationKey) {
								const updatedChoices = educationChoicesState.map((c, i) => ({
									...c,
									selected: i === index,
								}))
								setEducationChoicesState(updatedChoices)
								setAuthState({ ...authState, educationLevel: educationKey })
							}
						}}
					/>
				</View>

				{error && (
					<View>
						<Text style={[GlobalStyles.error, { textAlign: "center" }]}>{error}</Text>
					</View>
				)}

				<CustomPressable
					type='secondary'
					title='Skip'
					onPress={skip}
					style={{ marginTop: "auto" }}
				/>
				<CustomPressable type='primary' title='Confirm' onPress={confirm} />
			</CustomScrollView>
		</View>
	)
}
