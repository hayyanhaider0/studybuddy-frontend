import { Line } from "@shopify/react-native-skia"

interface LinesBackgroundProps {
	width: number
	height: number
	spacing: number
	color: string
}

export default function LinesBackground({ width, height, spacing, color }: LinesBackgroundProps) {
	const lines = []

	// Horizontal lines
	for (let y = spacing / 2; y < height; y += spacing) {
		lines.push(<Line key={`h-${y}`} p1={{ x: 0, y }} p2={{ x: width, y }} color={color} />)
	}

	return <>{lines}</>
}
