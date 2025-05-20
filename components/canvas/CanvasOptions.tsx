import { useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GlobalStyles } from "../../styles/global"

type canvasOptionsProps = {
	setStroke: (stroke: string) => void
	setStrokeWidth: (strokeWidth: number) => void
}

export default function CanvasOptions({ setStroke, setStrokeWidth }: canvasOptionsProps) {
	const colors = ["red", "blue", "green", "yellow", "purple"]
	const strokes = [2, 4, 6, 8, 16]

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: "row", gap: 8 }}>
				{colors.map((c: string, i: number) => (
					<TouchableOpacity
						key={i}
						onPress={() => {
							setStroke(c)
						}}
					>
						<View style={[styles.options, { backgroundColor: c }]} />
					</TouchableOpacity>
				))}
			</View>
			<View style={{ flexDirection: "row", gap: 8 }}>
				{strokes.map((s: number, i: number) => (
					<TouchableOpacity
						key={i}
						onPress={() => {
							setStrokeWidth(s)
						}}
					>
						<View style={[styles.options]}>
							<View style={[styles.strokes, { width: s }]} />
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: "auto",
		alignSelf: "flex-start",
		gap: 16,
		backgroundColor: "lightgray",
		padding: 8,
		borderRadius: 25,
	},
	options: {
		borderRadius: 999,
		height: 32,
		width: 32,
		borderWidth: 1,
		borderColor: "gray",
		alignItems: "center",
		justifyContent: "center",
	},
	strokes: {
		borderRadius: 999,
		backgroundColor: "#fff",
		aspectRatio: 1 / 1,
	},
})
