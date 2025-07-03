import { Canvas, Path } from "@shopify/react-native-skia"
import { useNotebookContext } from "../../contexts/NotebookContext"
import { PathType } from "../../types/global"

export default function MiniCanvas({ id }: { id: string }) {
	const { notebooks } = useNotebookContext()

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
		<Canvas style={{ height: "100%", aspectRatio: 9 / 16 }}>
			{firstCanvas.paths.map((p: PathType, i) => (
				<Path
					key={i}
					path={p.path}
					color={p.color}
					style='stroke'
					strokeWidth={p.size}
					strokeCap={p.strokeLinecap}
					strokeJoin='round'
				/>
			))}
		</Canvas>
	)
}
