/**
 * DrawingCanvas Component
 *
 * Handles the actual drawing canvas with paths and transforms.
 * Separated from CanvasScreen to reduce complexity.
 */

import { Canvas } from "@shopify/react-native-skia"
import { View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import { getChapter, getCanvas } from "../../../utils/notebook"
import { useSettings } from "../../common/contexts/SettingsContext"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useNotebookContext } from "../contexts/NotebookContext"
import useCanvasDrawingGestures from "../hooks/useCanvasDrawingGestures"
import CanvasBackground from "./CanvasBackground"
import PageNumber from "./PageNumber"
import CanvasPaths from "./CanvasPaths"
import CurrentPathRenderer from "./CurrentPathRenderer"
import tinycolor from "tinycolor2"

export default function DrawingCanvas({ canvasId }: { canvasId: string }) {
	// Get values from context.
	const { current, layout } = useCanvasContext()
	const { notebookState } = useNotebookContext()
	const { theme } = useThemeContext()
	const { showPageNumber } = useSettings()

	// Get the currently selected chapter.
	const chapter = getChapter(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId
	)!

	const canvasIndex = chapter.canvases.findIndex((cv) => cv.id === canvasId)
	const canvasNumber = canvasIndex !== -1 ? canvasIndex + 1 + "" : "?"

	// Get the current canvas's paths and current path if any.
	const canvas = getCanvas(
		notebookState.notebooks,
		notebookState.selectedNotebookId,
		notebookState.selectedChapterId,
		canvasId
	)

	if (!canvasId) {
		return (
			<Canvas style={{ height: layout.height, width: layout.width }}>
				<CanvasBackground
					width={layout.width}
					height={layout.height}
					backgroundColor={theme.colors.primary}
					patternColor={theme.colors.textSecondary}
				/>
			</Canvas>
		)
	}

	if (!canvas) return

	// Gesture.
	const drawingGestures = useCanvasDrawingGestures(canvasId)

	// Background and pattern colors.
	const backgroundColor = canvas.color ?? theme.colors.primary
	const patternColor = tinycolor(backgroundColor).isDark()
		? theme.colors.textPrimary
		: theme.colors.textSecondary

	return (
		<View style={{ flex: 1 }}>
			<GestureDetector gesture={drawingGestures}>
				{/* Container for Skia Canvas + Overlay UI */}
				<View style={{ flex: 1 }} collapsable={false}>
					{/* The drawing canvas */}
					<Canvas style={{ height: layout.height, width: layout.width }}>
						{/* Background */}
						<CanvasBackground
							width={layout.width}
							height={layout.height}
							backgroundColor={backgroundColor}
							pattern={canvas.pattern}
							patternColor={patternColor}
						/>

						{/* Render page number on the bottom of the canvas */}
						{showPageNumber && (
							<PageNumber
								number={canvasNumber}
								position='top-right'
								backgroundColor={(canvas.color as string) ?? theme.colors.primary}
								width={layout.width}
								height={layout.height}
							/>
						)}

						{/* Paths that already exist */}
						<CanvasPaths paths={canvas.paths} width={layout.width} height={layout.height} />

						{/* Current path (the one the user is currently drawing) */}
						<CurrentPathRenderer
							currentPath={current[canvasId]}
							width={layout.width}
							height={layout.height}
						/>
					</Canvas>
				</View>
			</GestureDetector>
		</View>
	)
}
