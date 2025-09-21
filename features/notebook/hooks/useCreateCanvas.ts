import { useMutation } from "@tanstack/react-query"
import { CanvasRequest, CanvasResponse, createCanvasApi } from "../api"
import { queryClient } from "../../../api/queryClient"

export default function useCreateCanvas() {
	return useMutation<CanvasResponse, Error, CanvasRequest>({
		mutationFn: createCanvasApi,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canvases"] }),
		onError: (e: any) => console.error("Error fetching canvases:", e),
	})
}
