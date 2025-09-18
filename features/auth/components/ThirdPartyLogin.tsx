/**
 * ThirdPartyLogin Component
 *
 * Contains UI for the third party login systems: Google, Facebook, and Apple
 * NOTE: USE SAVED IMAGES INSTEAD OF LINKS -- REMOVE THIS COMMENT WHEN DONE
 */

import { View, Image } from "react-native"
import { Text } from "react-native-gesture-handler"
import HorizontalRule from "../../common/components/HorizontalRule"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import CustomPressable from "../../common/components/CustomPressable"
import tinycolor from "tinycolor2"

export default function ThirdPartyLogin() {
	// Theming
	const { GlobalStyles } = useThemeContext()

	return (
		<View style={{ gap: 16 }}>
			{/* Horizontal rule to separate StudyBuddy and third party login UI */}
			<HorizontalRule>OR</HorizontalRule>

			{/* Google login */}
			<CustomPressable
				type='secondary'
				onPress={() => null}
				style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 16 }}
			>
				<Image
					source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
					style={{ width: 20, height: 20, marginRight: 8 }}
				/>
				<Text style={GlobalStyles.buttonText}>Sign in with Google</Text>
			</CustomPressable>

			{/* Facebook login */}
			<CustomPressable
				type='secondary'
				onPress={() => null}
				style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 16 }}
			>
				<Image
					source={{
						uri: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
					}}
					style={{ width: 20, height: 20, marginRight: 8 }}
				/>
				<Text style={GlobalStyles.buttonText}>Sign in with Facebook</Text>
			</CustomPressable>

			{/* Apple login */}
			<CustomPressable
				type='secondary'
				onPress={() => null}
				style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 16 }}
			>
				<Image
					source={{
						uri: "https://purepng.com/public/uploads/large/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl.png",
					}}
					style={{ width: 20, height: 20, marginRight: 8, resizeMode: "contain" }}
					tintColor={tinycolor(GlobalStyles.container.backgroundColor).isDark() ? "#fff" : "#000"}
				/>
				<Text style={GlobalStyles.buttonText}>Sign in with Apple</Text>
			</CustomPressable>
		</View>
	)
}
