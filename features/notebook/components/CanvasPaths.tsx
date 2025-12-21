import { useMemo } from "react"
import PathRenderer from "../../drawing/PathRenderer"
import { PathType } from "../../drawing/types/DrawingTypes"

interface CanvasPathsProps {
	paths: PathType[]
	width: number
	height: number
}

export default function CanvasPaths({ paths, width, height }: CanvasPathsProps) {
	if (paths.length === 0) return []

	const memoizedPaths = useMemo(() => {
		return paths.map((path: PathType) => (
			<PathRenderer key={path.id} path={path} width={width} height={height} />
		))
	}, [paths, width, height])

	return memoizedPaths
}
