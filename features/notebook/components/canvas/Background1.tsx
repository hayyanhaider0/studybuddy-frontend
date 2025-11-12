import { Line, Rect } from "@shopify/react-native-skia"

export default function Background1({
	width,
	height,
	backgroundColor,
}: {
	width: number
	height: number
	backgroundColor: string
}) {
	const totalLines = 24
	const spacing = height / (totalLines - 1)
	const strokeWidth = Math.max(1, height * 0.001)

	return (
		<>
			<Rect x={0} y={0} width={width} height={height} color={backgroundColor} />
			{Array.from({ length: totalLines - 3 }).map((_, i) => (
				<Line
					key={i}
					p1={{ x: width * 0.04, y: (i + 2) * spacing }}
					p2={{ x: width - width * 0.04, y: (i + 2) * spacing }}
					color='gray'
					strokeWidth={strokeWidth}
				/>
			))}
		</>
	)
}
