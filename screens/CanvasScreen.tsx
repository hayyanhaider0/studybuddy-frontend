import React, { useState } from "react"
import Svg, { Path } from "react-native-svg"
import { View, PanResponder } from "react-native"
import CanvasOptions from "../components/canvas/CanvasOptions"
import { SafeAreaView } from "react-native-safe-area-context"

type PathData = {
	d: string
	color: string
	sw: number
}

export default function DrawingCanvas() {
	const [paths, setPaths] = useState<PathData[]>([])
	const [current, setCurrent] = useState<string>("")
	const [stroke, setStroke] = useState<string>("black")
	const [strokeWidth, setStrokeWidth] = useState<number>(3)

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: ({ nativeEvent }) => {
			const { locationX, locationY } = nativeEvent
			setCurrent(`M ${locationX} ${locationY}`)
		},
		onPanResponderMove: ({ nativeEvent }) => {
			const { locationX, locationY } = nativeEvent
			setCurrent((prev) => `${prev} L ${locationX} ${locationY}`)
		},
		onPanResponderRelease: () => {
			setPaths((prev) => [...prev, { d: current, color: stroke, sw: strokeWidth }])
			setCurrent("")
		},
	})

	return (
		<SafeAreaView style={{ flex: 1 }} {...panResponder.panHandlers}>
			<CanvasOptions setStroke={setStroke} setStrokeWidth={setStrokeWidth} />
			<Svg style={{ flex: 1 }}>
				{paths.map((p, i) => (
					<Path key={i} d={p.d} stroke={p.color} strokeWidth={p.sw} fill='none' />
				))}
				{current && <Path d={current} stroke={stroke} strokeWidth={strokeWidth} fill='none' />}
			</Svg>
		</SafeAreaView>
	)
}
