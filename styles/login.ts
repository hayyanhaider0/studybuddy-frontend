import { StyleSheet } from "react-native"
import { Colors } from "./global"

export const styles = StyleSheet.create({
	screen: {
		flexGrow: 1,
		padding: 32,
		paddingVertical: 64,
	},
	inputContainer: {
		width: "100%",
		gap: 32,
	},
	inputBox: {
		position: "relative",
		borderWidth: 1,
		borderColor: Colors.text,
		borderRadius: 999,
		width: "100%",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	label: {
		position: "absolute",
		backgroundColor: Colors.background,
		paddingHorizontal: 4,
		top: -12,
		left: 16,
		fontSize: 16,
	},
	input: {
		textAlign: "left",
		paddingVertical: 4,
		outlineWidth: 0,
	},
	errors: {
		backgroundColor: "#f9c5d1",
		padding: 16,
		borderRadius: 25,
		width: "100%",
	},
	errorMsg: {
		color: "#8b1e3f",
	},
})
