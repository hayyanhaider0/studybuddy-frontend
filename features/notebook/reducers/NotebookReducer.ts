import { Canvas, Chapter, Notebook } from "../../../types/notebook"

export type NotebookState = {
	notebooks: Notebook[]
	selectedNotebookId: string | undefined
	selectedChapterId: string | undefined
	selectedCanvasId: string | undefined
}

export const INITIAL_STATE: NotebookState = {
	notebooks: [],
	selectedNotebookId: undefined,
	selectedChapterId: undefined,
	selectedCanvasId: undefined,
}

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

export const notebookReducer = (state: NotebookState, action: NOTEBOOK_ACTION): NotebookState => {
	switch (action.type) {
		case "SET_NOTEBOOKS":
			return { ...state, notebooks: action.payload }
		case "ADD_NOTEBOOK":
			return {
				notebooks: [...state.notebooks, action.payload],
				selectedNotebookId: action.payload.id,
				selectedChapterId: action.payload.chapters[0].id,
				selectedCanvasId: action.payload.chapters[0].canvases[0].id,
			}
		case "SELECT_NOTEBOOK":
			return { ...state, selectedNotebookId: action.payload }
		case "UPDATE_NOTEBOOK":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
				),
			}
		case "DELETE_NOTEBOOK":
			return { ...state, notebooks: state.notebooks.filter((n) => n.id !== action.payload.id) }
		case "ADD_CHAPTER":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? { ...n, chapters: [...(n.chapters || []), action.payload.chapter] }
						: n
				),
			}
		case "SELECT_CHAPTER":
			return { ...state, selectedChapterId: action.payload }
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
		case "DELETE_CHAPTER":
			return {
				...state,
				notebooks: state.notebooks.map((n) =>
					n.id === action.payload.notebookId
						? { ...n, chapters: n.chapters.filter((ch) => ch.id !== action.payload.id) }
						: n
				),
			}
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
		case "SELECT_CANVAS":
			return { ...state, selectedCanvasId: action.payload }
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
		default:
			return state
	}
}
