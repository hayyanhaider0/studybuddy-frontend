import { Canvas } from "@shopify/react-native-skia"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { PathType } from "../drawing/types/DrawingTypes"
import PathRenderer from "../drawing/PathRenderer"
import { useState } from "react"
import Background1 from "../canvas/Background1"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function MiniCanvas({ id }: { id: string }) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const { notebooks } = useNotebookContext()
	const { theme } = useThemeContext()

	const notebook = notebooks.find((n) => n.id === id)

	if (!notebook) throw new Error("Notebook not found!")
	if (notebook.chapters.length === 0) {
		return <Canvas style={{ height: "100%", aspectRatio: 9 / 16 }} />
	}

	const firstChapter = notebook.chapters[0]
	if (firstChapter.canvases.length === 0) {
		return <Canvas style={{ height: "100%", aspectRatio: 9 / 16 }} />
	}

	const firstCanvas = firstChapter.canvases[0]

	return (
		<Canvas
			onLayout={(e) => {
				const { width, height } = e.nativeEvent.layout
				setDimensions({ width, height })
			}}
			style={{ height: "100%", aspectRatio: 9 / 16 }}
		>
			<Background1
				width={dimensions.width}
				height={dimensions.height}
				backgroundColor={theme.colors.background}
			/>
			{firstCanvas.paths.map((p: PathType) => (
				<PathRenderer key={p.id} path={p} width={dimensions.width} height={dimensions.height} />
			))}
		</Canvas>
	)
}
