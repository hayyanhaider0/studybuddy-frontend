import { View, ActivityIndicator } from "react-native"

export default function LoadingSpinner() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<ActivityIndicator size="large" />
		</View>
	)
}
