import { useCanvasContext } from "../contexts/CanvasStateContext"
import { PathType } from "../types/global"

export const getPathsForCanvas = (canvasId: string, paths: Record<string, PathType[]>) =>
	paths[canvasId] || []

export const updatePathsForCanvas = (
	canvasId: string,
	newPaths: PathType[],
	setPaths: React.Dispatch<React.SetStateAction<Record<string, PathType[]>>>
) => {
	setPaths((prev) => ({ ...prev, [canvasId]: newPaths }))
}
