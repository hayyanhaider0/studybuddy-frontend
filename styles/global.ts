import { StyleSheet } from "react-native"

export const Colors = {
	primary: "#2e2e2e", // Dark gray — main UI elements (e.g. navbar, header)
	secondary: "#4a4a4a", // Medium gray — for borders, secondary buttons
	tertiary: "#b0b0b0", // Light gray — placeholder text, inactive icons
	background: "#f9f9f9", // Very light gray — app background
	accent: "#3f3f3f", // White — cards, note backgrounds
	text: "#1c1c1c", // Near-black — primary readable text
	buttonText: "#fcfcfc", // buttons
	link: "#007aff", // Blue-tinted gray — subtle but noticeable link color
	highlight: "#e0e0e0", // For selected notes or hover states
	error: "#ff3b30", // Red — validation errors or destructive actions
	success: "#4cd964", // Green — for confirmations
	warning: "#ffcc00", // Yellow — warnings or caution banners
	muted: "#888888", // Muted text or disabled elements
	divider: "#d1d1d1", // Thin line dividers between sections
	shadow: "rgba(0, 0, 0, 0.05)", // Soft shadow for depth
}

export const GlobalStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
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
		backgroundColor: Colors.accent,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 999,
		alignItems: "center",
		width: "100%",
	},
	buttonText: {
		color: Colors.buttonText,
		fontSize: 16,
		fontWeight: "bold",
	},
	link: {
		color: Colors.link,
		textDecorationLine: "underline",
	},
	error: {
		color: Colors.error,
	},
})
