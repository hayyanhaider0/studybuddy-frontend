import { Text as SkiaText, useFont } from "@shopify/react-native-skia"
import React from "react"
import tinycolor from "tinycolor2"

type PositionType =
	| "top-left"
	| "top"
	| "top-right"
	| "right"
	| "bottom-right"
	| "bottom"
	| "bottom-left"
	| "left"

interface PageNumberProps {
	number: string
	position: PositionType
	backgroundColor: string
	width: number
	height: number
}

export default function PageNumber({
	number,
	position,
	backgroundColor,
	width,
	height,
}: PageNumberProps) {
	const calculatePosition = (position: PositionType) => {
		let x = width / 2 // Center
		let y = width / 2 // Center

		if (position.includes("top")) y = height * 0.05
		if (position.includes("bottom")) y = height * 0.95
		if (position.includes("left")) x = width * 0.075
		if (position.includes("right")) x = width * 0.9

		return { x, y }
	}

	const { x, y } = calculatePosition(position)

	const Roboto = useFont(require("../../../assets/fonts/Roboto-Medium.ttf"), height * 0.025)

	const color = tinycolor(backgroundColor).isDark() ? "#E0E0E0" : "#1A1A1A"

	return <SkiaText text={number} x={x} y={y} font={Roboto} color={color} />
}
