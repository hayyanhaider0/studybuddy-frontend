/**
 * React Query hook to fetch notebooks and store them in cache.
 */
import { useQuery } from "@tanstack/react-query"
import { fetchNotebooks } from "../api/api"

export const useNotebooks = () => {
	return useQuery({
		queryKey: ["notebooks"],
		queryFn: fetchNotebooks,
	})
}
