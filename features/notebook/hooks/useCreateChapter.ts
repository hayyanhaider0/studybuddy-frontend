import { useMutation } from "@tanstack/react-query"
import { createChapterApi } from "../api"
import { queryClient } from "../../../api/queryClient"

export default function useCreateChapter() {
	return useMutation({
		mutationFn: createChapterApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapters"] })
		},
		onError: (e: any) => {
			console.error("Error creating chapter:", e.message || e)
		},
	})
}
