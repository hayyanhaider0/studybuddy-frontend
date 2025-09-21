import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { ChapterResponse, getChaptersApi } from "../api"
import { useAuthContext } from "../../auth/contexts/AuthContext"

export default function useGetChapters(notebookIds: string[]) {
	const { authState } = useAuthContext()

	return useQuery({
		queryKey: ["chapters", notebookIds],
		queryFn: () => getChaptersApi(notebookIds),
		retry: 1,
		onError: (e: any) => console.error("Error fetching chapters:", e.message || e),
		enabled: authState.isLoggedIn,
	} as UseQueryOptions<ChapterResponse[], Error>)
}
