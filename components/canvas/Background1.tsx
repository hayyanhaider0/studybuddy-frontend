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
	const totalLines = 18
	const spacing = height / (totalLines - 1)

	return (
		<>
			<Rect x={0} y={0} width={width} height={height} color={backgroundColor} />
			{Array.from({ length: totalLines - 3 }).map((_, i) => (
				<Line
					key={i}
					p1={{ x: 16, y: (i + 2) * spacing }}
					p2={{ x: width - 16, y: (i + 2) * spacing }}
					color='gray'
					strokeWidth={2}
				/>
			))}
		</>
	)
}
