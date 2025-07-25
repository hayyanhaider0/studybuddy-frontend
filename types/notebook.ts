/**
 * Notebook types
 *
 * Contains type information for Canvases, Chapters, and Notebooks.
 */

import { PathType } from "./global"

export type Canvas = {
	id: string
	paths: PathType[]
	undoStack: any[]
	redoStack: any[]
	createdAt: number
	updatedAt: number
}

export type Chapter = {
	id: string
	title: string
	canvases: Canvas[]
	createdAt: number
	updatedAt: number
}

export type Notebook = {
	id: string
	title: string
	chapters: Chapter[]
	createdAt: number
	updatedAt: number
	fill: string
}
