import { View, Text } from "react-native"
import { Colors } from "../../styles/global"

export default function HorizontalRule({ children }: any) {
	return (
		<View style={{ alignItems: "center", marginVertical: 16 }}>
			<View style={{ backgroundColor: "#ccc", height: 1, width: "100%" }} />
			{children && (
				<View
					style={{
						position: "absolute",
						top: -10,
						backgroundColor: Colors.background,
						paddingHorizontal: 8,
					}}
				>
					<Text style={{ color: "#666" }}>{children}</Text>
				</View>
			)}
		</View>
	)
}
