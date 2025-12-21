import { Circle } from "@shopify/react-native-skia"

interface DotsBackgroundProps {
	width: number
	height: number
	spacing: number
	color: string
}

export default function DotsBackground({ width, height, spacing, color }: DotsBackgroundProps) {
	const dots = []

	// Dots
	for (let x = spacing / 2; x < width * 1.1; x += spacing) {
		for (let y = spacing / 2; y < height * 1.1; y += spacing) {
			dots.push(<Circle key={`${x}-${y}`} cx={x} cy={y} r={1} color={color} />)
		}
	}

	return <>{dots}</>
}
