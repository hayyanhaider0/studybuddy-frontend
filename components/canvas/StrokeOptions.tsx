import Slider from "@react-native-community/slider"
import { useToolContext } from "../../contexts/ToolContext"
import { Text, View } from "react-native"
import { useState } from "react"
import { useThemeContext } from "../../contexts/ThemeContext"

function ToolTip({ currentValue }: { currentValue: number }) {
	const { theme } = useThemeContext()

	return (
		<View
			style={{
				backgroundColor: "#000",
				borderWidth: 2,
				borderColor: "#fff",
				borderRadius: 999,
				borderBottomEndRadius: 0,
				aspectRatio: 1 / 1,
				transform: [{ translateY: -42 }, { rotate: "45deg" }],
				alignItems: "center",
			}}
		>
			<Text
				style={{ color: theme.colors.onPrimary, padding: 4, transform: [{ rotate: "-45deg" }] }}
			>
				{currentValue === 0 ? 1 : currentValue}
			</Text>
		</View>
	)
}

export default function StrokeOptions() {
	const [isActive, setActive] = useState(false)
	const { stroke, strokeWidth, setStrokeWidth } = useToolContext()
	const { theme } = useThemeContext()

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				paddingTop: 16,
				paddingHorizontal: 16,
				width: 232,
				gap: 8,
			}}
		>
			<View
				style={{
					backgroundColor: stroke,
					width: 24,
					height: 24,
					borderRadius: 999,
					borderColor: theme.colors.onPrimary,
					borderWidth: 2,
					alignItems: "center",
					justifyContent: "center",
				}}
			/>
			<Slider
				minimumValue={1}
				maximumValue={30}
				step={1}
				value={strokeWidth}
				onValueChange={(v) => setStrokeWidth(v)}
				thumbTintColor={isActive ? theme.colors.secondary : "#fff"}
				minimumTrackTintColor={isActive ? theme.colors.secondary : "#fff"}
				tapToSeek={true}
				onSlidingStart={() => setActive(true)}
				onSlidingComplete={() => setActive(false)}
				StepMarker={({ stepMarked, currentValue }) => {
					if (!stepMarked || !isActive) return

					return <ToolTip currentValue={currentValue} />
				}}
				style={{
					width: "100%",
					borderWidth: 2,
					backgroundColor: "#000",
					borderRadius: 999,
					borderColor: theme.colors.onPrimary,
					padding: 2,
				}}
			/>
		</View>
	)
}
