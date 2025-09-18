/**
 * Grid Component
 *
 * Creates a grid according to the number of columns specified.
 */

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
				<View key={i} style={[{ flexDirection: "row" }, rowStyle]}>
					{r.map((item, j) => (
						<View
							key={j}
							style={[
								{
									flex: 1,
									alignItems: "center",
									justifyContent: "center",
									margin: 8,
								},
								itemStyle,
							]}
						>
							{item}
						</View>
					))}
					{/* Add empty spacers for incomplete rows */}
					{r.length < cols &&
						Array.from({ length: cols - r.length }).map((_, k) => (
							<View key={`spacer-${k}`} style={{ flex: 1, margin: 8 }} />
						))}
				</View>
			))}
		</View>
	)
}
