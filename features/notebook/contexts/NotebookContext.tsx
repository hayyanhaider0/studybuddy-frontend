/**
 * NotebookContext
 *
 * Provides shared values for notebook related tasks -- pagination, chapter and notebook
 * selection.
 */

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { Canvas, Chapter, Notebook } from "../../../types/notebook"
import { ChapterResponse, NotebookResponse, PathResponse } from "../api"
import useGetNotebooks from "../hooks/useGetNotebooks"
import useGetChapters from "../hooks/useGetChapters"
import useGetCanvases from "../hooks/useGetCanvases"
import useGetPaths from "../hooks/useGetPaths"
import { BrushSettings, PathType } from "../../drawing/types/DrawingTypes"
import { StrokeCap, StrokeJoin } from "@shopify/react-native-skia"

// Types for the notebook context.
type NotebookContextType = {
    // React query stored state for the list of all notebooks.
    notebooks: Notebook[]
    // Sets the selected ids for UI components.
    setNotebooks: (newNotebooks: Notebook[]) => void
    // Id of the currently selected notebook, or null if no notebook is selected.
    selectedNotebookId: string
    // Setter for the id of the currently selected notebook.
    setSelectedNotebookId: React.Dispatch<React.SetStateAction<string>>
    // Id of the currently selected chapter.
    selectedChapterId: string
    // Setter for the id of the currently selected notebook.
    setSelectedChapterId: React.Dispatch<React.SetStateAction<string>>
    // Id of the currently selected canvas.
    selectedCanvasId: string
    // Setter for the id of the currently selected notebook.
    setSelectedCanvasId: React.Dispatch<React.SetStateAction<string>>
}

// React context for pagination, chapter and notebook selection.
const NotebookContext = createContext<NotebookContextType | null>(null)

/**
 * NotebookProvider Component
 *
 * Wraps children components, providing notebook state values via context.
 *
 * @param children - JSX Components that require NotebookProvider shared values.
 */
export const NotebookProvider = ({ children }: { children: ReactNode }) => {
    // Pagination, chapter and notebook state values.
    const [selectedNotebookId, setSelectedNotebookId] = useState<string>("")
    const [selectedChapterId, setSelectedChapterId] = useState<string>("")
    const [selectedCanvasId, setSelectedCanvasId] = useState<string>("")

    // Fetch user notebook data.
    const { data: notebooksData } = useGetNotebooks()

    // Fetch user chapter data.
    const notebookIds = notebooksData?.map((n) => n.id) || []
    const { data: chaptersData } = useGetChapters(notebookIds)

    // Fetch user canvas data.
    const chapterIds = chaptersData?.map((c) => c.id) || []
    const { data: canvasesData } = useGetCanvases(chapterIds)

    // Fetch user path data.
    const { data: pathsData } = useGetPaths(selectedChapterId)

    const notebooks: Notebook[] = useMemo(() => {
        if (
            !notebooksData ||
            !chaptersData ||
            !canvasesData ||
            notebooksData.length === 0
        )
            return []

        return notebooksData.map((n: NotebookResponse) => {
            const chapterResponses = chaptersData.filter(
                (c) => c.notebookId === n.id
            )

            const chapters: Chapter[] = chapterResponses.map(
                (c: ChapterResponse) => {
                    const canvasesForChapter: Canvas[] = canvasesData
                        .filter((cv) => cv.chapterId === c.id)
                        .map((cv) => {
                            // Map paths for this canvas
                            const pathsForCanvas: PathType[] = (pathsData ?? [])
                                .filter(
                                    (p: PathResponse) => p.canvasId === cv.id
                                )
                                .map((p: PathResponse) => {
                                    const brushSettings: BrushSettings = {
                                        type: p.brushType,
                                        color: p.color ?? "#000000", // fallback
                                        opacity: p.opacity ?? 1,
                                        baseWidth: p.baseWidth ?? 2,
                                        minWidth: (p.baseWidth ?? 2) * 0.5,
                                        maxWidth: (p.baseWidth ?? 2) * 1.5,
                                        strokeCap: StrokeCap.Round,
                                        strokeJoin: StrokeJoin.Round,
                                    }

                                    return {
                                        points: p.points,
                                        brush: brushSettings,
                                        bbox: {
                                            minX: 0,
                                            maxX: 0,
                                            minY: 0,
                                            maxY: 0,
                                        },
                                    }
                                })

                            return {
                                id: cv.id,
                                order: cv.order ?? 0,
                                createdAt: Date.parse(cv.createdAt),
                                updatedAt: Date.parse(cv.updatedAt),
                                paths: pathsForCanvas,
                                undoStack: [],
                                redoStack: [],
                                lastAccessedAt: 0,
                            }
                        })

                    return {
                        id: c.id,
                        title: c.title,
                        order: c.order ?? 0,
                        createdAt: Date.parse(c.createdAt),
                        updatedAt: Date.parse(c.updatedAt),
                        canvases: canvasesForChapter,
                    }
                }
            )

            return {
                ...n,
                chapters,
                createdAt: Date.parse(n.createdAt),
                updatedAt: Date.parse(n.updatedAt),
                lastAccessedAt: Date.parse(n.lastAccessedAt),
            }
        })
    }, [notebooksData, chaptersData, canvasesData, pathsData])

    /**
     * Sets the notebooks array to a new state. Also initializes selected notebook, chapter, and canvas
     * in case they don't exist -- this should only happen when the user opens the app for the first time.
     * @param newNotebooks - New notebooks array state.
     */
    const setNotebooks = (newNotebooks: Notebook[]) => {
        const currentNotebook = newNotebooks.find(
            (n) => n.id === selectedNotebookId
        )
        const currentChapter = currentNotebook?.chapters.find(
            (ch) => ch.id === selectedChapterId
        )
        const currentCanvas = currentChapter?.canvases.find(
            (cv) => cv.id === selectedCanvasId
        )

        if (!currentNotebook || !currentChapter || !currentCanvas) {
            const firstNotebook = newNotebooks[0]
            const firstChapter = firstNotebook?.chapters[0]
            const firstCanvas = firstChapter?.canvases[0]

            setSelectedNotebookId(firstNotebook?.id || "")
            setSelectedChapterId(firstChapter?.id || "")
            setSelectedCanvasId(firstCanvas?.id || "")
        }
    }

    useEffect(() => {
        if (notebooks.length && notebooks[0].chapters.length) {
            if (!selectedNotebookId) setSelectedNotebookId(notebooks[0].id)
            if (!selectedChapterId)
                setSelectedChapterId(notebooks[0].chapters[0].id)
            if (!selectedCanvasId)
                setSelectedCanvasId(
                    notebooks[0].chapters[0].canvases[0]?.id || ""
                )
        }
    }, [notebooks])

    return (
        <NotebookContext.Provider
            value={{
                notebooks,
                setNotebooks,
                selectedNotebookId,
                setSelectedNotebookId,
                selectedChapterId,
                setSelectedChapterId,
                selectedCanvasId,
                setSelectedCanvasId,
            }}
        >
            {children}
        </NotebookContext.Provider>
    )
}

/**
 * useNotebook Hook
 *
 * Custom hook to provide shared notebook context values.
 *
 * @throws Error if used outside NotebookProvider.
 * @returns NotebookContext shared values.
 */
export const useNotebookContext = () => {
    const ctx = useContext(NotebookContext)
    if (!ctx)
        throw new Error("useNotebook must be used within a NotebookProvider")
    return ctx
}
