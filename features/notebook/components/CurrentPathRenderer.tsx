import PathRenderer from "../../drawing/PathRenderer"
import { PathType } from "../../drawing/types/DrawingTypes"

interface CurrentPathRendererProps {
	currentPath: PathType | null
	width: number
	height: number
}

export default function CurrentPathRenderer({
	currentPath,
	width,
	height,
}: CurrentPathRendererProps) {
	if (!currentPath || currentPath.points.length <= 0) return null

	return (
		<PathRenderer
			key={`current-${currentPath.canvasId}`}
			path={currentPath}
			width={width}
			height={height}
		/>
	)
}
