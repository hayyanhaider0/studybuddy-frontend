/**
 * PathProcessor Processor
 *
 * Converts the user drawn path into a Skia path.
 */

import { Skia, SkPath } from "@shopify/react-native-skia"
import { PathPoint } from "../types/DrawingTypes"

export const toSkiaPath = (points: PathPoint[], width: number, height: number): SkPath | null => {
	// Don't create a path if there are no points.
	if (points.length === 0) return null

	const path = Skia.Path.Make() // Start creating a path.

	// // Simulate a dot with a very small line.
	// if (points.length === 1) {
	// 	const p = points[0]
	// 	path.moveTo(p.x * width, p.y * height)
	// 	path.lineTo(p.x * width + 0.1, p.y * height + 0.1)
	// 	return path
	// }

	// // Create the user drawn line as a skia path.
	// const start = points[0]
	// path.moveTo(start.x * width, start.y * height)

	// for (let i = 1; i < points.length; i++) {
	// 	const p = points[i]
	// 	path.lineTo(p.x * width, p.y * height)
	// }

	points.forEach((p) => {
		const x = p.x * width
		const y = p.y * height
		path.moveTo(x, y)
		path.lineTo(x + 0.1, y + 0.1) // Tiny line to simulate a visible point
	})

	return path
}
