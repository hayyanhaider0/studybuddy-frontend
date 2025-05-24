import { StyleSheet } from "react-native"
import { Colors } from "./global"

export const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		backgroundColor: Colors.primary,
		padding: 16,
		alignItems: "center",
		zIndex: 10,
	},
	options: {
		borderRadius: 999,
		height: 32,
		width: 32,
		borderWidth: 2,
		borderColor: Colors.buttonText,
		alignItems: "center",
		justifyContent: "center",
	},
})
