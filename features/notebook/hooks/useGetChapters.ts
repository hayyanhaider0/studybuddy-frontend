import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { ChapterResponse, getChaptersApi } from "../api"

export default function useGetChapters() {
	return useQuery({
		queryKey: ["chapters"],
		queryFn: getChaptersApi,
		retry: 1,
		onError: (e: any) => {
			console.error("Error fetching chapters:", e.message || e)
		},
	} as UseQueryOptions<ChapterResponse[] | Error>)
}
