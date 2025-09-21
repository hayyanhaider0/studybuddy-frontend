/**
 * Notebook types
 *
 * Contains type information for Canvases, Chapters, and Notebooks.
 */

import { PathType } from "../features/drawing/types/DrawingTypes"

export type Canvas = {
	id: string
	paths: PathType[]
	undoStack: any[]
	redoStack: any[]
	createdAt: number
	updatedAt: number
	lastAccessedAt: number
}

export type Chapter = {
	id: string
	title: string
	canvases: Canvas[]
	order: number
	createdAt: string
	updatedAt: string
}

export type Notebook = {
	id: string
	title: string
	chapters: Chapter[]
	createdAt: string
	updatedAt: string
	lastAccessedAt: string
	color: string | null
}
