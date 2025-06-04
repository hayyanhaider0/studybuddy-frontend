import { Line, Rect } from "@shopify/react-native-skia"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function Background1({
	width,
	height,
	backgroundColor,
}: {
	width: number
	height: number
	backgroundColor: string
}) {
	const DIVISOR = 36
	const numLines = Math.floor(height / DIVISOR)

	return (
		<>
			<Rect x={0} y={0} width={width} height={height} color={backgroundColor} />
			{Array.from({ length: numLines }).map((_, i) => (
				<Line
					key={i}
					p1={{ x: 16, y: (i + 2) * DIVISOR }}
					p2={{ x: width - 16, y: (i + 2) * DIVISOR }}
					color='gray'
					strokeWidth={1}
				/>
			))}
		</>
	)
}
