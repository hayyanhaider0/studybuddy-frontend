import { Line } from "@shopify/react-native-skia"

interface GridBackgroundProps {
	width: number
	height: number
	spacing: number
	color: string
}

export default function GridBackground({ width, height, spacing, color }: GridBackgroundProps) {
	const lines = []

	// Vertical lines
	for (let x = spacing / 2; x < width; x += spacing) {
		lines.push(<Line key={`v-${x}`} p1={{ x, y: 0 }} p2={{ x, y: height }} color={color} />)
	}

	// Horizontal lines
	for (let y = spacing / 2; y < height; y += spacing) {
		lines.push(<Line key={`h-${y}`} p1={{ x: 0, y }} p2={{ x: width, y }} color={color} />)
	}

	return <>{lines}</>
}
