import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getPathsApi, PathResponse } from "../api"
import { useAuthContext } from "../../auth/contexts/AuthContext"

export default function useGetPaths(canvasIds: string[]) {
	const { authState } = useAuthContext()

	return useQuery({
		queryKey: ["paths", canvasIds],
		queryFn: () => getPathsApi(canvasIds),
		retry: 1,
		onError: (e: any) => console.error("Error fetching paths: ", e.message || e),
		enabled: authState.isLoggedIn,
	} as UseQueryOptions<PathResponse[], Error>)
}
