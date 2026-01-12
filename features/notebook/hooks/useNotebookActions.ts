/**
 * useNotebookActions Hook
 *
 * Contains all the required functions related to notebooks, chapters, and canvases.
 * Also contains helper functions that open a modal when required.
 */

import { PathType } from "../../drawing/types/DrawingTypes"
import { useModal } from "../../common/contexts/ModalContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import { Canvas, Chapter, Notebook } from "../../../types/notebook"
import { getCanvas } from "../../../utils/notebook"
import { useNotebookMutations } from "./useNotebookMutations"
import { ChapterRequest, mapToPathRequest, PathRequest } from "../api/api"
import { Color } from "../../../types/global"
import CanvasBackgroundModal from "../components/CanvasBackgroundModal"
import React from "react"
import { DrawingToolSettings, isDrawingTool, EraserSettings, canDraw } from "../../../types/tools"
import { useTool } from "../contexts/ToolContext"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import EraserProcessor from "../../drawing/processors/EraserProcessor"
import { toSkiaPath } from "../../drawing/processors/PathProcessor"
import { CanvasRef, ImageFormat } from "@shopify/react-native-skia"
import * as FileSystem from "expo-file-system"
import { Paths, Directory } from "expo-file-system"

export default function useNotebookActions() {
	// Get context values.
	const { notebookState, dispatch } = useNotebookContext()
	const { layout } = useCanvasContext()
	const { activeTool } = useTool()
	const { openModal } = useModal()
	const {
		createNotebookServer,
		updateNotebookServer,
		deleteNotebookServer,
		createChapterServer,
		updateChapterServer,
		deleteChapterServer,
		createCanvasServer,
		deleteCanvasServer,
		createPathsServer,
		deletePathsServer,
	} = useNotebookMutations()

	const activeCanvas = getCanvas(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId,
		notebookState.selectedCanvasId
	)

	const MAX_UNDO_HISTORY = 100
	const MAX_REDO_HISTORY = 100

	/////////////////////////////////////////
	// UI Aware Functions
	/////////////////////////////////////////
	// Helper function to create a new notebook with a title.
	const handleCreateNotebook = () => {
		openModal({
			type: "input",
			title: "Add New Notebook",
			description: "Give your notebook a title to start organizing your study materials.",
			placeholder: "Enter notebook name...",
			color: true,
			buttonText: "Create",
			onSubmit: (input: string, color: Color = null) => {
				const title = input.trim() === "" ? `Notebook ${notebookState.notebooks.length + 1}` : input
				createNotebookServer.mutate({ title, color })
			},
		})
	}

	// Helper function to update a notebook's title and cover fill.
	const handleUpdateNotebook = (notebook: Notebook) => {
		openModal({
			type: "input",
			title: `Edit ${notebook.title}`,
			description: "Change your notebook's name and cover icon color.",
			placeholder: "Enter notebook name...",
			color: true,
			defaultValue: notebook.title,
			defaultColor: notebook.color,
			buttonText: "Apply",
			onSubmit: (input: string, color?: Color) =>
				updateNotebookServer.mutate({
					id: notebook.id,
					req: { title: input, color: color ?? null },
				}),
		})
	}

	const handleDeleteNotebook = (notebook: Notebook) => {
		openModal({
			type: "confirm",
			title: `Delete ${notebook.title}?`,
			description: "Are you sure you want to delete this notebook?",
			buttonText: "Delete",
			onSubmit: () => deleteNotebookServer.mutate(notebook),
		})
	}

	// Helper function to create a new chapter with a title.
	const handleCreateChapter = () => {
		openModal({
			type: "input",
			title: "Create New Chapter",
			description: "Organize your content by adding a new chapter to this notebook.",
			placeholder: "Enter chapter name...",
			buttonText: "Create",
			onSubmit: (input: string) => {
				const notebook = notebookState.notebooks.find(
					(n) => n.id === notebookState.selectedNotebookId
				)
				if (!notebook) throw new Error("Notebook not found.")

				const order = notebook.chapters.length

				// Create chapter here
				createChapterServer.mutate({
					title: input,
					notebookId: notebookState.selectedNotebookId!,
					order,
				})
			},
		})
	}

	// Helper function to update a chapter.
	const handleUpdateChapter = (chapter: Chapter) => {
		openModal({
			type: "input",
			title: `Edit ${chapter.title}`,
			description: "Change your chapter's name.",
			placeholder: "Enter chapter name...",
			buttonText: "Apply",
			onSubmit: (input: string) =>
				updateChapterServer.mutate({ id: chapter.id, req: { title: input } as ChapterRequest }),
		})
	}

	// Helper function to delete a chapter.
	const handleDeleteChapter = (chapter: Chapter) => {
		openModal({
			type: "confirm",
			title: `Delete ${chapter.title}?`,
			description: "Are you sure you want to delete this notebook?",
			buttonText: "Delete",
			onSubmit: () => deleteChapterServer.mutate(chapter),
		})
	}

	// Helper function to create a new canvas.
	const handleCreateCanvas = (order: number = 0) => {
		createCanvasServer.mutate({
			chapterId: notebookState.selectedChapterId!,
			notebookId: notebookState.selectedNotebookId!,
			order,
		})
	}

	// Helper function to change canvas pattern.
	const handleChangeBackground = (canvas: Canvas) => {
		openModal({
			type: "CUSTOM",
			title: "Change Background",
			description: "Select a background for this canvas.",
			children: React.createElement(CanvasBackgroundModal, {
				notebookId: canvas.notebookId,
				chapterId: canvas.chapterId,
				canvasId: canvas.id,
			}),
		})
	}

	// Helper function to delete a canvas.
	const handleDeleteCanvas = (canvas: Canvas) => {
		deleteCanvasServer.mutate(canvas)
	}

	const handlePNGExport = async (
		notebookTitle: string,
		chapterTitle: string,
		canvasNumber: number,
		canvasRef: React.RefObject<CanvasRef | null>
	) => {
		console.log("Not implemented yet.")
	}

	// Helper function to create a path on some canvas.
	const handleCreatePath = (
		x: number,
		y: number,
		pressure: number,
		canvasId: string,
		toolSettings: DrawingToolSettings | EraserSettings
	): PathType | undefined => {
		if (!canDraw(activeTool)) return

		if (isDrawingTool(activeTool)) {
			const drawingSettings = toolSettings as DrawingToolSettings

			return {
				id: `temp-${Date.now()}`,
				canvasId,
				points: [{ x, y, pressure }],
				brush: {
					type: activeTool,
					color: drawingSettings.color as string,
					sizePresetIndex: drawingSettings.activeSizePreset,
					opacity: drawingSettings.opacity,
				},
			}
		} else if (activeTool === "eraser") {
			return {
				id: `temp-${Date.now()}`,
				canvasId,
				points: [{ x, y, pressure }],
				brush: {
					type: activeTool,
					color: "#FFFFFF50",
					sizePresetIndex: toolSettings.activeSizePreset,
					opacity: 0.5,
				},
			}
		}
	}

	/////////////////////////////////////////
	// Canvas State Management
	/////////////////////////////////////////
	// Create a snapshot of the canvas.
	const createSnapshot = () => {
		if (!activeCanvas) return

		return {
			paths: [...activeCanvas.paths],
		}
	}

	/**
	 * Helper function that adds a new path to the canvas.
	 * @param path - The new path drawn by the user.
	 * @param width - Width of the canvas.
	 * @param height - Height of the canvas.
	 * @param isStylus - Whether the pointer type is a stylus.
	 */
	const addPathToCanvas = (path: PathType, width: number, height: number, isStylus: boolean) => {
		if (!activeCanvas) return

		const resampledPath = resamplePath(path, width, height, isStylus)

		const snapshot = createSnapshot()

		const updatedCanvas = {
			...activeCanvas,
			paths: [...activeCanvas.paths, resampledPath],
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		// Create path here
		createPathsServer.mutate([mapToPathRequest(resampledPath)])

		updateCanvas(updatedCanvas)
	}

	/**
	 * Resamples a path's point by distance. If the distance between 2 points is
	 * below the threshold, the first of the 2 points is not included in the
	 * resampled path. It also includes a point if the pressure change between
	 * the 2 points is significant enough.
	 *
	 * @param path - Original path created by the user.
	 * @param width - Width of the canvas.
	 * @param height - Height of the canvas.
	 * @param isStylus - Whether the pointer type is a stylus.
	 *
	 * @returns A resampled path with less points (potentially).
	 */
	const resamplePath = (
		path: PathType,
		width: number,
		height: number,
		isStylus: boolean
	): PathType => {
		const points = path.points
		let resampledPath = path

		if (points.length <= 2) return path

		// Resample the path for less points.
		const resampledPoints = [points[0]] // Include the first point.
		let lastAdded = points[0]

		for (let i = 1; i < points.length; i++) {
			const dx = (points[i].x - lastAdded.x) * width
			const dy = (points[i].y - lastAdded.y) * height
			const distance = Math.sqrt(dx * dx + dy * dy)

			// If the distance is significant enough, or the pressure changes enough, include the point.
			if (distance > 0.2 || Math.abs(points[i].pressure - lastAdded.pressure) > 0.05) {
				resampledPoints.push(points[i])
				lastAdded = points[i]
			}
		}

		// Include the last point.
		resampledPoints.push(points[points.length - 1])

		let finalPoints = resampledPoints

		if (isStylus) {
			// Detect if the stylus is inputting fake pressure.
			const pressures = resampledPoints.map((p) => p.pressure)
			const minP = Math.min(...pressures)
			const maxP = Math.max(...pressures)
			const meanP = pressures.reduce((a, b) => a + b, 0) / pressures.length
			const variance = pressures.reduce((a, b) => a + (b - meanP) ** 2, 0) / pressures.length

			// Only consider pressure real if range or variance is meaningful
			const usePressure = maxP - minP > 0.05 || variance > 0.0005

			// If the stylus is using some fake pressure value, just default to 0.5.
			finalPoints = resampledPoints.map((p) => ({
				x: p.x,
				y: p.y,
				pressure: usePressure ? p.pressure : 0.5,
			}))
		}

		resampledPath = {
			id: path.id,
			canvasId: path.canvasId,
			points: finalPoints,
			brush: path.brush,
			skPath: toSkiaPath(finalPoints, path.brush, width, height),
		}

		return resampledPath
	}

	const handleErase = (
		normX: number,
		normY: number,
		normSize: number,
		prevEraserX: number,
		prevEraserY: number,
		canvasId: string
	) => {
		const canvas = getCanvas(
			notebookState.notebooks,
			notebookState.selectedNotebookId,
			notebookState.selectedChapterId,
			canvasId
		)

		if (!activeCanvas || !canvas) return

		// Get updated paths after erasing
		const deletedPathId = EraserProcessor({
			eraserX: normX,
			eraserY: normY,
			eraserSize: normSize,
			prevEraserX,
			prevEraserY,
			canvasPaths: canvas.paths,
			width: layout.width,
			height: layout.height,
		})

		if (!deletedPathId) return

		deletePathsServer.mutate([deletedPathId])

		const updatedPaths = canvas.paths.filter((p) => p.id !== deletedPathId)

		// Update the canvas with new paths
		const snapshot = createSnapshot()

		const updatedCanvas = {
			...activeCanvas,
			paths: updatedPaths,
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		updateCanvas(updatedCanvas)
	}

	// Undo the last action by the user.
	const undo = () => {
		if (!activeCanvas) return

		const lastItem = activeCanvas.undoStack.at(-1)
		if (!lastItem) return

		const prevSnapshot = activeCanvas.undoStack.slice(0, -1)

		const updatedCanvas = {
			...activeCanvas,
			paths: [...lastItem.paths],
			undoStack: prevSnapshot,
			redoStack: limitStackSize(
				pushToStack(activeCanvas.redoStack, activeCanvas),
				MAX_REDO_HISTORY
			),
			updatedAt: Date.now(),
		}

		// Previous and current paths arrays.
		const currPaths = activeCanvas.paths
		const prevPaths = [...lastItem.paths]
		syncPaths(currPaths, prevPaths)

		updateCanvas(updatedCanvas)
	}

	// Redo the last undone action.
	const redo = () => {
		if (!activeCanvas) return

		const lastItem = activeCanvas.redoStack.at(-1)
		if (!lastItem) return

		const prevSnapshot = activeCanvas.redoStack.slice(0, -1)

		const updatedCanvas = {
			...activeCanvas,
			paths: [...lastItem.paths],
			undoStack: limitStackSize(
				pushToStack(activeCanvas.undoStack, activeCanvas),
				MAX_UNDO_HISTORY
			),
			redoStack: prevSnapshot,
			updatedAt: Date.now(),
		}

		// Previous and current paths arrays.
		const prevPaths = activeCanvas.paths
		const currPaths = [...lastItem.paths]
		syncPaths(prevPaths, currPaths)

		updateCanvas(updatedCanvas)
	}

	// Clears the current canvas.
	const clearCanvas = () => {
		if (!activeCanvas) return

		const snapshot = createSnapshot()

		const pathIdsToDelete = activeCanvas.paths.map((path) => path.id)

		const updatedCanvas = {
			...activeCanvas,
			paths: [],
			undoStack: limitStackSize([...activeCanvas.undoStack, snapshot], MAX_UNDO_HISTORY),
			redoStack: [],
			updatedAt: Date.now(),
		}

		if (pathIdsToDelete.length > 0) {
			deletePathsServer.mutate(pathIdsToDelete)
		}

		updateCanvas(updatedCanvas)
	}

	/**
	 * Helper function to update the canvas from the notebooks array.
	 * @param newCanvas - The new canvas state
	 */
	const updateCanvas = (newCanvas: Canvas) => {
		if (!activeCanvas) return

		dispatch({
			type: "UPDATE_CANVAS",
			payload: {
				notebookId: notebookState.selectedNotebookId!,
				chapterId: notebookState.selectedChapterId!,
				id: activeCanvas.id,
				updates: newCanvas,
			},
		})
	}

	// Helper to push items onto both undo and redo stacks.
	const pushToStack = (stack: any[], canvas: Canvas) => [...stack, { paths: [...canvas.paths] }]

	// Helper to limit stack sizes for better memory usage.
	const limitStackSize = (stack: any[], max: number) =>
		stack.length >= max ? stack.slice(stack.length - max + 1) : stack

	// Helper to delete and add paths from the database.
	const syncPaths = (prevPaths: PathType[], currPaths: PathType[]) => {
		if (prevPaths.length === currPaths.length) {
			// Intentionally left empty.
			return
		} else if (prevPaths.length > currPaths.length) {
			// Delete the extra paths after operation.
			let pathsToDelete: string[] = []
			prevPaths.forEach((prevPath) => {
				if (!currPaths.some((currPath) => currPath.id === prevPath.id)) {
					pathsToDelete.push(prevPath.id)
				}
			})

			if (pathsToDelete.length > 0) {
				deletePathsServer.mutate(pathsToDelete)
			}
		} else if (prevPaths.length < currPaths.length) {
			// Add back the previous paths after operation.
			let pathsToAdd: PathRequest[] = []
			currPaths.forEach((currPath) => {
				if (!prevPaths.some((prevPath) => prevPath.id === currPath.id)) {
					pathsToAdd.push(mapToPathRequest(currPath))
				}
			})

			if (pathsToAdd.length > 0) {
				createPathsServer.mutate(pathsToAdd)
			}
		}
	}

	// Helpers to allow for checking if undo and redo are enabled.
	const canUndo = () => activeCanvas && activeCanvas.undoStack.length > 0
	const canRedo = () => activeCanvas && activeCanvas.redoStack.length > 0

	return {
		handleCreateNotebook,
		handleUpdateNotebook,
		handleDeleteNotebook,
		handleCreateChapter,
		handleUpdateChapter,
		handleDeleteChapter,
		handleCreateCanvas,
		handleChangeBackground,
		handleDeleteCanvas,
		handlePNGExport,
		handleCreatePath,
		addPathToCanvas,
		handleErase,
		undo,
		canUndo,
		redo,
		canRedo,
		clearCanvas,
	}
}
