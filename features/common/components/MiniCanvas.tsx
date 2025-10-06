import { Canvas } from "@shopify/react-native-skia"
import { PathType } from "../../drawing/types/DrawingTypes"
import PathRenderer from "../../drawing/PathRenderer"
import { useState } from "react"
import Background1 from "../../notebook/components/canvas/Background1"
import { useThemeContext } from "../contexts/ThemeContext"
import { View } from "react-native"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"

export default function MiniCanvas({ id }: { id: string }) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const { notebooks } = useNotebookContext()
	const { theme } = useThemeContext()

	const notebook = notebooks.find((n) => n.id === id)

	if (!notebook) throw new Error("Notebook not found!")
	if (notebook.chapters && notebook.chapters.length === 0) {
		return <Canvas style={{ height: "100%", aspectRatio: 9 / 16 }} />
	}

	const firstChapter = notebook.chapters?.[0]
	const firstCanvas = firstChapter?.canvases?.[0]

	if (!firstCanvas) {
		return <Canvas style={{ height: "100%", aspectRatio: 9 / 16 }} />
	}

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
				{(firstCanvas.paths ?? []).map((p: PathType) => (
					<PathRenderer key={p.pid} path={p} width={dimensions.width} height={dimensions.height} />
				))}
			</Canvas>
		</View>
	)
}
