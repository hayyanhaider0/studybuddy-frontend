import { useMutation } from "@tanstack/react-query"
import { ChapterRequest, ChapterResponse, createChapterApi } from "../api"
import { queryClient } from "../../../api/queryClient"

export default function useCreateChapter() {
	return useMutation<ChapterResponse, Error, ChapterRequest>({
		mutationFn: createChapterApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapters"] })
		},
		onError: (e: any) => {
			console.error("Error creating chapter:", e.message || e)
		},
	})
}
