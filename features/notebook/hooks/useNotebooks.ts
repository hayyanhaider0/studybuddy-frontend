import { useQuery } from "@tanstack/react-query"
import { fetchNotebooks } from "../api/api"

export const useNotebooks = () => {
	return useQuery({
		queryKey: ["notebooks"],
		queryFn: fetchNotebooks,
	})
}
