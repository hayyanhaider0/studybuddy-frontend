import { TouchableOpacity, View, Image } from "react-native"
import { Text } from "react-native-gesture-handler"
import { getGlobalStyles } from "../../styles/global"
import HorizontalRule from "../common/HorizontalRule"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function ThirdPartyLogin() {
	const { GlobalStyles } = useThemeContext()

	return (
		<View style={{ gap: 16 }}>
			<HorizontalRule>OR</HorizontalRule>

			<TouchableOpacity
				style={[
					GlobalStyles.button,
					{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "center" },
				]}
			>
				<Image
					source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
					style={{ width: 20, height: 20, marginRight: 8 }}
				/>
				<Text>Sign in with Google</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					GlobalStyles.button,
					{ backgroundColor: "#1877f2", flexDirection: "row", justifyContent: "center" },
				]}
			>
				<Image
					source={{
						uri: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
					}}
					style={{ width: 20, height: 20, marginRight: 8 }}
				/>
				<Text style={{ color: "#fff" }}>Sign in with Facebook</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					GlobalStyles.button,
					{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "center" },
				]}
			>
				<Image
					source={{
						uri: "https://purepng.com/public/uploads/large/purepng.com-apple-logologobrand-logoiconslogos-251519938788qhgdl.png",
					}}
					style={{ width: 20, height: 20, marginRight: 8, resizeMode: "contain" }}
				/>
				<Text>Sign in with Apple</Text>
			</TouchableOpacity>
		</View>
	)
}
