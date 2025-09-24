import { useMutation } from "@tanstack/react-query";
import { createPathApi, PathRequest, PathResponse } from "../api";

export default function useCreatePath()
{
    return useMutation<PathResponse, Error, PathRequest>({
        mutationFn: createPathApi,
        
    })
}