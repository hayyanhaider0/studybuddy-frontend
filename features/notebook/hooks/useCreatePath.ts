import { useMutation } from "@tanstack/react-query"
import { createPathApi, PathRequest, PathResponse } from "../api"
import { queryClient } from "../../../api/queryClient"

export default function useCreatePath() {
	return useMutation<PathResponse, Error, PathRequest>({
		mutationFn: (req: PathRequest) => createPathApi(req),
		onSuccess: () => {
			// Invalidate the paths query so React Query refetches paths for the canvas
			queryClient.invalidateQueries({ queryKey: ["paths"] })
		},
		onError: (err: any) => {
			console.error("Error adding path:", err.message || err)
		},
	})
}
