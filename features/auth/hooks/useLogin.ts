/**
 * useLogin Hook
 *
 * Custom hook that deals with API calls to the backend for when the user wants to
 * login to their account.
 */

import { UseFormSetError } from "react-hook-form"
import { LoginRequest } from "../../../types/auth"
import { useNavigation } from "@react-navigation/native"
import { NavProp } from "../../../types/global"
import { EducationLevel, Occupation, useAuthContext } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { saveToken, saveRefreshToken } from "../../../utils/secureStore"
import { AxiosError } from "axios"
import { login } from "../api/api"
import { queryClient } from "../../../api/queryClient"
import {
	CanvasResponse,
	ChapterResponse,
	fetchCanvases,
	fetchChapters,
	fetchNotebooks,
	fetchPaths,
	mapToCanvas,
	mapToChapter,
	mapToNotebook,
	mapToPathType,
	PathResponse,
} from "../../notebook/api/api"
import { buildNotebooksTree } from "../../../utils/notebook"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"

export default function useLogin(setError: UseFormSetError<LoginRequest>) {
	const nav = useNavigation<NavProp<"main">>()
	const { setAuthState } = useAuthContext()
	const { dispatch } = useNotebookContext()

	return useMutation({
		mutationFn: login,
		onSuccess: async (data) => {
			// Save the access token.
			saveToken(data.accessToken)
			// Save the refresh token.
			saveRefreshToken(data.refreshToken)

			const notebooks = await queryClient.fetchQuery({
				queryKey: ["notebooks"],
				queryFn: fetchNotebooks,
			})
			const notebookIds = notebooks.map((n) => n.id)

			// Fetch chapters only if there are notebooks
			let chapters: ChapterResponse[] = []
			if (notebookIds.length > 0) {
				chapters = await queryClient.fetchQuery({
					queryKey: ["chapters", notebookIds],
					queryFn: () => fetchChapters(notebookIds),
				})
			}
			const chapterIds = chapters.map((ch) => ch.id)

			// Fetch canvases only if there are chapters
			let canvases: CanvasResponse[] = []
			if (chapterIds.length > 0) {
				canvases = await queryClient.fetchQuery({
					queryKey: ["canvases", chapterIds],
					queryFn: () => fetchCanvases(chapterIds),
				})
			}
			const canvasIds = canvases.map((cv) => cv.id)

			// Fetch paths only if there are canvases
			let paths: PathResponse[] = []
			if (canvasIds.length > 0) {
				paths = await queryClient.fetchQuery({
					queryKey: ["paths", canvasIds],
					queryFn: () => fetchPaths(canvasIds),
				})
			}

			const mappedNotebooks = notebooks.map(mapToNotebook)
			const mappedChapters = chapters.map(mapToChapter)
			const mappedCanvases = canvases.map(mapToCanvas)
			const mappedPaths = paths.map(mapToPathType)

			const nbTree = buildNotebooksTree(
				mappedNotebooks,
				mappedChapters,
				mappedCanvases,
				mappedPaths
			)
			dispatch({ type: "SET_NOTEBOOKS", payload: nbTree })

			if (nbTree.length > 0) {
				dispatch({ type: "SELECT_NOTEBOOK", payload: nbTree[0].id })
				if (nbTree[0].chapters.length > 0) {
					dispatch({ type: "SELECT_CHAPTER", payload: nbTree[0].chapters[0].id })
					if (nbTree[0].chapters[0].canvases.length > 0) {
						dispatch({ type: "SELECT_CANVAS", payload: nbTree[0].chapters[0].canvases[0].id })
					}
				}
			}

			// Set the user auth state.
			setAuthState({
				isLoggedIn: true,
				email: data.email,
				username: data.username,
				displayName: data.displayName,
				occupation: (data.occupation as Occupation) || null,
				educationLevel: (data.educationLevel as EducationLevel) || null,
			})
		},
		onError: (e: AxiosError<{ data: any; error: string; message: string }>) => {
			const errorData = e.response?.data

			if (errorData?.error === "EMAIL_NOT_VERIFIED") {
				nav.navigate("verify", { email: errorData.data.email })
				return
			}

			const errorMessage = e.response?.data?.message
			if (!errorMessage) {
				setError("root", { message: e.response?.data?.message || "A network error has occured." })
			} else if (errorMessage.toLowerCase().includes("user")) {
				setError("login", { type: "server", message: errorMessage })
			} else {
				setError("root", { type: "server", message: errorMessage })
			}
		},
	})
}
