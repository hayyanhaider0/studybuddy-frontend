import { Canvas } from "@shopify/react-native-skia"
import { PathType } from "../../drawing/types/DrawingTypes"
import PathRenderer from "../../drawing/PathRenderer"
import { useState } from "react"
import { useThemeContext } from "../contexts/ThemeContext"
import { DimensionValue, View } from "react-native"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { getCanvas } from "../../../utils/notebook"
import CanvasBackground, { CanvasPattern } from "../../notebook/components/CanvasBackground"
import { Color } from "../../../types/global"

interface MiniCanvasProps {
	notebookId: string
	chapterId: string
	canvasId: string
	backgroundColor?: Color
	pattern?: CanvasPattern
	width?: DimensionValue
}

export default function MiniCanvas({
	notebookId,
	chapterId,
	canvasId,
	backgroundColor,
	pattern,
	width = "100%",
}: MiniCanvasProps) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const { notebookState } = useNotebookContext()

	const { theme } = useThemeContext()

	const canvas = getCanvas(notebookState.notebooks, notebookId, chapterId, canvasId)

	return (
		<View
			onLayout={(e) => {
				const { width, height } = e.nativeEvent.layout
				setDimensions({ width, height })
			}}
		>
			<Canvas style={{ width, aspectRatio: 9 / 16 }}>
				<CanvasBackground
					width={dimensions.width}
					height={dimensions.height}
					backgroundColor={backgroundColor ?? theme.colors.primary}
					pattern={pattern}
					patternColor={theme.colors.textSecondary}
				/>
				{canvas &&
					(canvas.paths ?? []).map((p: PathType) => (
						<PathRenderer key={p.id} path={p} width={dimensions.width} height={dimensions.height} />
					))}
			</Canvas>
		</View>
	)
}
