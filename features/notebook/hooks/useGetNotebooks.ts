import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getNotebooksApi, NotebookResponse } from "../api"

export default function useGetNotebooks() {
	return useQuery({
		queryKey: ["notebooks"],
		queryFn: getNotebooksApi,
		retry: 1,
		onError: (e: any) => {
			console.error("Error fetching notebooks:", e.message || e)
		},
	} as UseQueryOptions<NotebookResponse[], Error>)
}
