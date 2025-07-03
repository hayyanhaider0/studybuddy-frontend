import { ReactNode } from "react"
import { View, ViewStyle } from "react-native"

type GridProps = {
	data: ReactNode[]
	cols: number
	itemStyle?: ViewStyle
	rowStyle?: ViewStyle
}

export default function Grid({ data, cols, itemStyle, rowStyle }: GridProps) {
	if (cols <= 2) throw new Error("Grid must have more than 1 column!")

	const rows = Array.from({ length: Math.ceil(data.length / cols) }, (_, i) =>
		data.slice(i * cols, i * cols + cols)
	)

	return (
		<View style={{ flex: 1 }}>
			{rows.map((r, i) => (
				<View key={i} style={[{ flexDirection: "row", gap: 8 }, rowStyle]}>
					{r.map((item, i) => (
						<View
							key={i}
							style={[
								{
									flex: 1 / cols,
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 8,
								},
								itemStyle,
							]}
						>
							{item}
						</View>
					))}
				</View>
			))}
		</View>
	)
}
