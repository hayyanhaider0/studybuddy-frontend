/**
 * DrawingCanvas Component
 *
 * Handles the actual drawing canvas with paths and transforms.
 * Separated from CanvasScreen to reduce complexity.
 */

import { Canvas, Circle, Path, Text as SkiaText, useFont } from "@shopify/react-native-skia"
import { PathType } from "../../types/global"
import { View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import Background1 from "./Background1"
import { useCanvasContext } from "../../contexts/CanvasStateContext"
import { useToolContext } from "../../contexts/ToolContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { useNotebookContext } from "../../contexts/NotebookContext"
import useCanvasDrawingGestures from "../../hooks/useCanvasDrawingGestures"
import { useSettings } from "../../contexts/SettingsContext"
import { getChapter } from "../../utils/notebook"

export default function DrawingCanvas({ canvasId }: { canvasId: string }) {
	// Get values from context.
	const { current, layout } = useCanvasContext()
	const { notebooks, selectedNotebookId, selectedChapterId } = useNotebookContext()
	const { tool, toolSettings, eraserPos } = useToolContext()
	const { theme } = useThemeContext()
	const { showPageNumber } = useSettings()

	// Get the currently selected chapter.
	const chapter = getChapter(notebooks, selectedNotebookId, selectedChapterId)!

	const canvasIndex = chapter.canvases.findIndex((cv) => cv.id === canvasId)
	const canvasNumber = canvasIndex !== -1 ? canvasIndex + 1 + "" : "?"

	// Get the current canvas's paths and current path if any.
	const canvasPaths = chapter.canvases[canvasIndex].paths
	const currentPath = current[canvasId] || ""

	// Font import for Skia -- used for page number.
	const Roboto = useFont(require("../../assets/fonts/Roboto-Bold.ttf"), layout.height * 0.025)

	// Gesture.
	const drawingGestures = useCanvasDrawingGestures(canvasId)

	return (
		<View style={{ flex: 1 }}>
			{/* This View allows for gestures outside the canvas like pan and pinch */}
			<GestureDetector gesture={drawingGestures}>
				<Canvas style={{ height: layout.height, width: layout.width }}>
					<Background1
						width={layout.width}
						height={layout.height}
						backgroundColor={theme.colors.background}
					/>
					{/* Render page number on the top right if the show page number setting is enabled */}
					{showPageNumber && (
						<SkiaText
							text={canvasNumber}
							x={layout.width - layout.height * 0.05}
							y={layout.width * 0.1}
							font={Roboto}
							color={theme.colors.textPrimary}
						/>
					)}
					{/* Render completed paths */}
					{canvasPaths.map((p: PathType, i: number) => (
						<Path
							key={i}
							path={p.path}
							color={p.color}
							style='stroke'
							strokeWidth={p.size}
							strokeCap={p.strokeLinecap}
							strokeJoin='round'
						/>
					))}
					{/* Render current path being drawn */}
					<Path
						path={currentPath}
						color={toolSettings[tool].color}
						style='stroke'
						strokeWidth={toolSettings[tool].size}
						strokeCap={toolSettings[tool].strokeLinecap}
						strokeJoin='round'
					/>
					{tool === "eraser" && (
						<Circle
							cx={eraserPos.x}
							cy={eraserPos.y}
							r={toolSettings["eraser"].size / 2}
							color={theme.colors.onPrimary}
							strokeWidth={1}
							style='stroke'
						/>
					)}
				</Canvas>
			</GestureDetector>
		</View>
	)
}
