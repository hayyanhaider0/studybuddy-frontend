import { Dimensions, View } from "react-native"

export default function Background1() {
	const { height } = Dimensions.get("window")

	const numLines = Math.floor(height / 52)

	return (
		<View
			style={{
				maxHeight: height,
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				zIndex: -1,
				padding: 16,
			}}
		>
			{Array.from({ length: numLines }).map((_, i) => (
				<View
					key={i}
					style={{
						height: 1,
						width: "100%",
						backgroundColor: "gray",
						marginTop: 48,
					}}
				/>
			))}
		</View>
	)
}
