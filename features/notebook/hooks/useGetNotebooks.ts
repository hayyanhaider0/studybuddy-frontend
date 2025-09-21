import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getNotebooksApi, NotebookResponse } from "../api"
import { useAuthContext } from "../../auth/contexts/AuthContext"

export default function useGetNotebooks() {
	const { authState } = useAuthContext()

	return useQuery({
		queryKey: ["notebooks"],
		queryFn: getNotebooksApi,
		retry: 1,
		onError: (e: any) => {
			console.error("Error fetching notebooks:", e.message || e)
		},
		enabled: authState.isLoggedIn,
	} as UseQueryOptions<NotebookResponse[], Error>)
}
