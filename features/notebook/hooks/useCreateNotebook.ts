import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../../../api/queryClient"
import { createNotebookApi, NotebookRequest, NotebookResponse } from "../api"

export default function useCreateNotebook() {
	return useMutation<NotebookResponse, Error, NotebookRequest>({
		mutationFn: createNotebookApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notebooks"] })
		},
		onError: (e: any) => {
			console.error("Error creating notebook:", e.message || e)
		},
	})
}
