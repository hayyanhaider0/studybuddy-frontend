import { Canvas } from "@shopify/react-native-skia"
import { PathType } from "../../drawing/types/DrawingTypes"
import PathRenderer from "../../drawing/PathRenderer"
import { useState } from "react"
import Background1 from "../../notebook/components/canvas/Background1"
import { useThemeContext } from "../contexts/ThemeContext"
import { View } from "react-native"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { getCanvas } from "../../../utils/notebook"

interface MiniCanvasProps {
	notebookId: string
	chapterId: string
	canvasId: string
}

export default function MiniCanvas({ notebookId, chapterId, canvasId }: MiniCanvasProps) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const { notebookState } = useNotebookContext()
	const { theme } = useThemeContext()

	const canvas = getCanvas(notebookState.notebooks, notebookId, chapterId, canvasId)!

	return (
		<View
			onLayout={(e) => {
				const { width, height } = e.nativeEvent.layout
				setDimensions({ width, height })
			}}
		>
			<Canvas style={{ height: "100%", aspectRatio: 9 / 16 }}>
				<Background1
					width={dimensions.width}
					height={dimensions.height}
					backgroundColor={theme.colors.background}
				/>
				{(canvas.paths ?? []).map((p: PathType) => (
					<PathRenderer key={p.id} path={p} width={dimensions.width} height={dimensions.height} />
				))}
			</Canvas>
		</View>
	)
}
