import { StyleSheet } from "react-native"

export const Colors = {
	primary: "#ff0000",
	secondary: "#a0a0a0",
	background: "#f0f0f0",
	accent: "#00ff00",
	text: "#333",
	link: "#0000ff",
}

export const GlobalStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: 16,
	},
	heading: {
		fontSize: 32,
		fontWeight: "bold",
		color: Colors.text,
		textAlign: "center",
	},
	paragraph: {
		fontSize: 16,
		color: Colors.text,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#6200EE",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 999,
		alignItems: "center",
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	link: {
		color: Colors.link,
		textDecorationLine: "underline",
	},
})
