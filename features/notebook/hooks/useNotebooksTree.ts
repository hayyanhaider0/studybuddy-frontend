import { useMemo } from "react"
import { buildNotebooksTree } from "../../../utils/notebook"
import useGetCanvases from "./useGetCanvases"
import useGetChapters from "./useGetChapters"
import useGetNotebooks from "./useGetNotebooks"
import useGetPaths from "./useGetPaths"

export default function useNotebooksTree() {
	const notebooksQuery = useGetNotebooks()
	const chaptersQuery = useGetChapters(notebooksQuery.data?.map((n) => n.id) || [])
	const canvasesQuery = useGetCanvases(chaptersQuery.data?.map((c) => c.id) || [])
	const pathsQuery = useGetPaths(canvasesQuery.data?.map((c) => c.id) || [])

	const isPending = [notebooksQuery, chaptersQuery, canvasesQuery, pathsQuery].some(
		(q) => q.isPending
	)
	const isError = [notebooksQuery, chaptersQuery, canvasesQuery, pathsQuery].some((q) => q.isError)

	const notebookTree = useMemo(() => {
		if (isPending || isError) return []

		// only build if all data is present
		if (!notebooksQuery.data || !chaptersQuery.data || !canvasesQuery.data || !pathsQuery.data) {
			return []
		}

		return buildNotebooksTree(
			notebooksQuery.data,
			chaptersQuery.data,
			canvasesQuery.data,
			pathsQuery.data
		)
	}, [
		isPending,
		isError,
		notebooksQuery.data,
		chaptersQuery.data,
		canvasesQuery.data,
		pathsQuery.data,
	])

	return { notebookTree, isPending, isError }
}
