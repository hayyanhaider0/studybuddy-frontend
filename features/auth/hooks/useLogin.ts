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
import { useAuthContext } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { EducationLevel, Occupation } from "../../../enums/global"
import { saveToken, saveRefreshToken } from "../../../utils/secureStore"
import { AxiosError } from "axios"
import { queryClient } from "../../../api/queryClient"
import {
	CanvasResponse,
	ChapterResponse,
	getCanvasesApi,
	getChaptersApi,
	getNotebooksApi,
	getPathsApi,
	NotebookResponse,
} from "../../notebook/api"
import { buildNotebooksTree } from "../../../utils/notebook"
import { useNotebookContext } from "../../notebook/contexts/NotebookContext"
import { login } from "../api"

export default function useLogin(setError: UseFormSetError<LoginRequest>) {
	const nav = useNavigation<NavProp<"main">>()
	const { setAuthState } = useAuthContext()
	const { setNotebooks, setSelectedNotebookId, setSelectedChapterId, setSelectedCanvasId } =
		useNotebookContext()

	return useMutation({
		mutationFn: login,
		onSuccess: async (data) => {
			const response = data.data

			// Save the access token.
			saveToken(response.accessToken)
			// Save the refresh token.
			saveRefreshToken(response.refreshToken)

			// Fetch user's notebooks.
			const notebooks = await queryClient.fetchQuery<NotebookResponse[], Error>({
				queryKey: ["notebooks"],
				queryFn: getNotebooksApi,
			})

			// Fetch user's chapters.
			const notebookIds = notebooks.map((nb) => nb.id)
			const chapters = await queryClient.fetchQuery<ChapterResponse[], Error>({
				queryKey: ["chapters"],
				queryFn: () => getChaptersApi(notebookIds),
			})

			// Fetch user's canvases.
			const chapterIds = chapters.map((ch) => ch.id)
			const canvases = await queryClient.fetchQuery<CanvasResponse[], Error>({
				queryKey: ["canvases"],
				queryFn: () => getCanvasesApi(chapterIds),
			})

			// Fetch user's paths.
			const canvasIds = canvases.map((c) => c.id)
			const paths = await queryClient.fetchQuery({
				queryKey: ["paths", canvasIds],
				queryFn: () => getPathsApi(canvasIds),
			})

			// Build tree.
			const notebookTree = buildNotebooksTree(notebooks, chapters, canvases, paths)
			setNotebooks(notebookTree)
			setSelectedNotebookId(notebookTree[0].id)
			setSelectedChapterId(notebookTree[0].chapters[0].id)
			setSelectedCanvasId(notebookTree[0].chapters[0].canvases[0].id)

			// Set the user auth state.
			setAuthState({
				isLoggedIn: true,
				email: response.email,
				username: response.username,
				displayName: response.displayName,
				occupation: response.occupation || Occupation.STUDENT,
				educationLevel: response.educationLevel || EducationLevel.UNDERGRAD_YEAR_THREE,
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
