/**
 * DrawingCanvas Component
 *
 * Handles the actual drawing canvas with paths and transforms.
 * Separated from CanvasScreen to reduce complexity.
 */

import { Canvas, Circle, Path, Text as SkiaText, useFont } from "@shopify/react-native-skia"
import { PathType } from "../../types/global"
import { LayoutChangeEvent, View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import Background1 from "./Background1"
import { useCanvasContext } from "../../contexts/CanvasStateContext"
import { useToolContext } from "../../contexts/ToolContext"
import { useThemeContext } from "../../contexts/ThemeContext"
import { useNotebook } from "../../contexts/NotebookContext"
import useCanvasDrawingGestures from "../../hooks/useCanvasDrawingGestures"
import { useEffect } from "react"

interface DrawingCanvasProps {
	canvasId: string
	onLayout: (e: LayoutChangeEvent) => void
}

export default function DrawingCanvas({ canvasId, onLayout }: DrawingCanvasProps) {
	// Context Imports.
	const { paths, current, layout } = useCanvasContext()
	const { chapter } = useNotebook()
	const { tool, toolSettings, eraserPos } = useToolContext()
	const { theme } = useThemeContext()

	const canvas = chapter?.canvases.find((c) => c.id === canvasId)
	const canvasPaths = paths[canvasId] || []
	const currentPath = current[canvasId] || ""

	const CANVAS_WIDTH = 360
	const CANVAS_HEIGHT = CANVAS_WIDTH * (16 / 9)

	// Gesture.
	const drawingGestures = useCanvasDrawingGestures(canvasId)

	const Roboto = useFont(require("../../assets/fonts/Roboto-Bold.ttf"), 16)

	return (
		<View style={{ flex: 1 }}>
			{/* This View allows for gestures outside the canvas like pan and pinch */}
			<GestureDetector gesture={drawingGestures}>
				<Canvas style={{ height: CANVAS_HEIGHT, width: CANVAS_WIDTH }} onLayout={onLayout}>
					<Background1
						width={layout.width}
						height={layout.height}
						backgroundColor={theme.colors.background}
					/>
					{/* Render page number on the top right */}
					<SkiaText
						text={`${chapter?.canvases.findIndex((c) => c.id === canvas?.id)}`}
						x={CANVAS_WIDTH - 32}
						y={36}
						font={Roboto}
						color={theme.colors.textPrimary}
					/>
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
