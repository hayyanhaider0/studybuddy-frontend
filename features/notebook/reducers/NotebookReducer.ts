/**
 * notebookReducer
 *
 * Handles all noteook-related state operations.
 * It tracks:
 * - A list of notebooks (nested with chapters and canvases).
 * - Selected notebook, chapter, and canvas IDs.
 *
 * Includes creating, updating, deleting, and selecting notebooks,
 * chapters, canvases, and paths.
 */

import { Canvas, Chapter, Notebook } from "../../../types/notebook"
import { PathType } from "../../drawing/types/DrawingTypes"

export type NotebookState = {
	// List of notebooks.
	notebooks: Notebook[]
	// Currently selected notebook's ID.
	selectedNotebookId: string | undefined
	// Currently selected chapter's ID.
	selectedChapterId: string | undefined
	// Currently selected canvas's ID.
	selectedCanvasId: string | undefined
}

// Initial default state.
export const INITIAL_STATE: NotebookState = {
	notebooks: [],
	selectedNotebookId: undefined,
	selectedChapterId: undefined,
	selectedCanvasId: undefined,
}

// All possible reducer actions and their payload types.
export type NOTEBOOK_ACTION =
	| { type: "SET_NOTEBOOKS"; payload: Notebook[] }
	| { type: "ADD_NOTEBOOK"; payload: Notebook }
	| { type: "UPDATE_NOTEBOOK"; payload: { id: string; updates: Partial<Notebook> } }
	| { type: "DELETE_NOTEBOOK"; payload: { id: string } }
	| { type: "SELECT_NOTEBOOK"; payload: string }
	| { type: "ADD_CHAPTER"; payload: { notebookId: string; chapter: Chapter } }
	| {
			type: "UPDATE_CHAPTER"
			payload: { id: string; notebookId: string; updates: Partial<Chapter> }
	  }
	| { type: "DELETE_CHAPTER"; payload: { id: string; notebookId: string } }
	| { type: "SELECT_CHAPTER"; payload: string }
	| { type: "ADD_CANVAS"; payload: { notebookId: string; chapterId: string; canvas: Canvas } }
	| {
			type: "UPDATE_CANVAS"
			payload: { id: string; notebookId: string; chapterId: string; updates: Partial<Canvas> }
	  }
	| { type: "DELETE_CANVAS"; payload: { notebookId: string; chapterId: string; id: string } }
	| { type: "SELECT_CANVAS"; payload: string }
	| {
			type: "UPDATE_PATH"
			payload: {
				id: string
				notebookId: string
				chapterId: string
				canvasId: string
				updates: Partial<PathType>
			}
	  }

// Reducer function for managing notebook, chapter, canvas, and path state.
export const notebookReducer = (state: NotebookState, action: NOTEBOOK_ACTION): NotebookState => {
	switch (action.type) {
		// Replace all notebooks.
		case "SET_NOTEBOOKS":
			return { ...state, notebooks: action.payload }
		// Adds a new notebook and selects it, and the first chapter and canvas in it.
		case "ADD_NOTEBOOK":
			return {
				notebooks: [...state.notebooks, action.payload],
				selectedNotebookId: action.payload.id,
				selectedChapterId: action.payload.chapters[0].id,
				selectedCanvasId: action.payload.chapters[0].canvases[0].id,
			}
		// Selects a notebook.
		case "SELECT_NOTEBOOK":
			return { ...state, selectedNotebookId: action.payload }
		// Updates a notebook.
		case "UPDATE_NOTEBOOK":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
				),
			}
		// Deletes a notebook.
		case "DELETE_NOTEBOOK":
			return { ...state, notebooks: state.notebooks.filter((n) => n.id !== action.payload.id) }
		// Adds a new chapter.
		case "ADD_CHAPTER":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? { ...n, chapters: [...(n.chapters || []), action.payload.chapter] }
						: n
				),
			}
		// Selects a chapter.
		case "SELECT_CHAPTER":
			return { ...state, selectedChapterId: action.payload }
		// Updates a chapter.
		case "UPDATE_CHAPTER":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? {
								...n,
								chapters: n.chapters.map((ch) =>
									ch.id === action.payload.id ? { ...ch, ...action.payload.updates } : ch
								),
						  }
						: n
				),
			}
		// Deletes a chapter.
		case "DELETE_CHAPTER":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? { ...n, chapters: n.chapters.filter((ch) => ch.id !== action.payload.id) }
						: n
				),
			}
		// Adds a new canvas.
		case "ADD_CANVAS":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? {
								...n,
								chapters: n.chapters.map((ch) =>
									ch.id === action.payload.chapterId
										? { ...ch, canvases: [...(ch.canvases || []), action.payload.canvas] }
										: ch
								),
						  }
						: n
				),
			}
		// Selects a canvas.
		case "SELECT_CANVAS":
			return { ...state, selectedCanvasId: action.payload }
		// Updates a canvas.
		case "UPDATE_CANVAS":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? {
								...n,
								chapters: n.chapters.map((ch) =>
									ch.id === action.payload.chapterId
										? {
												...ch,
												canvases: ch.canvases.map((cv) =>
													cv.id === action.payload.id ? { ...cv, ...action.payload.updates } : cv
												),
										  }
										: ch
								),
						  }
						: n
				),
			}
		// Deletes a canvas.
		case "DELETE_CANVAS":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? {
								...n,
								chapters: n.chapters.map((ch) =>
									ch.id === action.payload.chapterId
										? { ...ch, canvases: ch.canvases.filter((cv) => cv.id !== action.payload.id) }
										: ch
								),
						  }
						: n
				),
			}
		// Updates a path.
		case "UPDATE_PATH":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? {
								...n,
								chapters: n.chapters.map((ch) =>
									ch.id === action.payload.chapterId
										? {
												...ch,
												canvases: ch.canvases.map((cv) =>
													cv.id === action.payload.canvasId
														? {
																...cv,
																paths: cv.paths.map((p) =>
																	p.id === action.payload.id
																		? { ...p, ...action.payload.updates }
																		: p
																),
														  }
														: cv
												),
										  }
										: ch
								),
						  }
						: n
				),
			}
		default:
			return state
	}
}
