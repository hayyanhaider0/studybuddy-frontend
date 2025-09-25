import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getPathsApi, PathResponse } from "../api";

export default function useGetPaths(chapterId: string)
{
    return useQuery({
        queryKey: ["paths"],
        queryFn: () => getPathsApi(chapterId),
        retry: 1,
        onError: (e: any) => console.error("Error fetching paths: ", e.message || e),
    } as UseQueryOptions<PathResponse[],Error>)
}