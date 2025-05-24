import Slider from "@react-native-community/slider"
import { useToolContext } from "../../contexts/ToolContext"
import { Text, View } from "react-native"
import { Colors, GlobalStyles } from "../../styles/global"
import { useState } from "react"

function ToolTip({ currentValue }: { currentValue: number }) {
	return (
		<View
			style={{
				backgroundColor: Colors.tertiary,
				borderRadius: 999,
				aspectRatio: 1 / 1,
				transform: [{ translateY: -32 }, { translateX: -1 }],
				alignItems: "center",
			}}
		>
			<Text style={{ color: Colors.text, padding: 4 }}>
				{currentValue === 0 ? 1 : currentValue}
			</Text>
		</View>
	)
}

export default function StrokeOptions() {
	const [isActive, setActive] = useState(false)
	const { stroke, strokeWidth, setStrokeWidth } = useToolContext()

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				paddingTop: 16,
				paddingHorizontal: 16,
			}}
		>
			<View
				style={{
					backgroundColor: stroke,
					width: 24,
					height: 24,
					borderRadius: 999,
					borderColor: Colors.buttonText,
					borderWidth: 2,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: Colors.buttonText, fontSize: 12 }}>{strokeWidth}</Text>
			</View>
			<Slider
				style={{ width: "100%" }}
				minimumValue={0}
				maximumValue={20}
				step={2}
				value={strokeWidth}
				onValueChange={(v) => {
					v === 0 ? setStrokeWidth(1) : setStrokeWidth(v)
				}}
				StepMarker={({ stepMarked, currentValue }) => {
					if (!stepMarked || !isActive) return

					return <ToolTip currentValue={currentValue} />
				}}
				thumbTintColor={Colors.buttonText}
				onSlidingStart={() => setActive(true)}
				onSlidingComplete={() => setActive(false)}
			/>
		</View>
	)
}
