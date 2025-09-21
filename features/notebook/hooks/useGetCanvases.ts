import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAuthContext } from "../../auth/contexts/AuthContext"
import { CanvasResponse, getCanvasesApi } from "../api"

export default function useGetCanvases(chapterIds: string[]) {
	const { authState } = useAuthContext()

	return useQuery({
		queryKey: ["canvases", chapterIds],
		queryFn: () => getCanvasesApi(chapterIds),
		retry: 1,
		onError: (e: any) => console.error("Error fetching canvases:", e.message || e),
		enabled: authState.isLoggedIn,
	} as UseQueryOptions<CanvasResponse[], Error>)
}
