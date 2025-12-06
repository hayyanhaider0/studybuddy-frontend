/**
 * DrawingCanvas Component
 *
 * Handles the actual drawing canvas with paths and transforms.
 * Separated from CanvasScreen to reduce complexity.
 */

import { Canvas, Circle, Text as SkiaText, useFont } from "@shopify/react-native-skia"
import { GestureResponderEvent, Pressable, View } from "react-native"
import { GestureDetector } from "react-native-gesture-handler"
import Background1 from "./Background1"
import { useCanvasContext } from "../../contexts/CanvasStateContext"
import { useToolContext } from "../../contexts/ToolContext"
import { useThemeContext } from "../../../common/contexts/ThemeContext"
import { useNotebookContext } from "../../contexts/NotebookContext"
import useCanvasDrawingGestures from "../../hooks/useCanvasDrawingGestures"
import { useSettings } from "../../../common/contexts/SettingsContext"
import { getCanvas, getChapter } from "../../../../utils/notebook"
import PathRenderer from "../../../drawing/PathRenderer"
import { PathType } from "../../../drawing/types/DrawingTypes"
import useNotebookActions from "../../hooks/useNotebookActions"
import { useContextMenu } from "../../../common/contexts/ContextMenuContext"
import { Canvas as CanvasType } from "../../../../types/notebook"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useMemo } from "react"

export default function DrawingCanvas({ canvasId }: { canvasId: string }) {
	// Get values from context.
	const { current, layout } = useCanvasContext()
	const { notebookState } = useNotebookContext()
	const { handleDeleteCanvas } = useNotebookActions()
	const { openMenu } = useContextMenu()
	const { tool, toolSettings, eraserPos } = useToolContext()
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
	const canvasPaths = canvas?.paths ?? []

	const memoizedPaths = useMemo(() => {
		return canvasPaths.map((path: PathType) => (
			<PathRenderer key={path.id} path={path} width={layout.width} height={layout.height} />
		))
	}, [canvasPaths, layout.width, layout.height])

	// Font import for Skia -- used for page number.
	const Roboto = useFont(
		require("../../../../assets/fonts/Roboto-Medium.ttf"),
		layout.height * 0.025
	)

	// Gesture.
	const drawingGestures = useCanvasDrawingGestures(canvasId)

	// Long press to open a context menu.
	const handleCanvasMenu = (canvas: CanvasType, event: GestureResponderEvent) => {
		const { pageX, pageY } = event.nativeEvent

		openMenu({
			position: { x: pageX, y: pageY },
			options: [
				{ label: "Change Background", onPress: () => console.log("Change Background") },
				{ label: "Duplicate", onPress: () => console.log("Duplicate") },
				{ label: "Export", onPress: () => console.log("Export") },
				{ label: "Delete", onPress: () => handleDeleteCanvas(canvas) },
			],
		})
	}

	return (
		<View style={{ flex: 1 }}>
			<GestureDetector gesture={drawingGestures}>
				{/* Container for Skia Canvas + Overlay UI */}
				<View style={{ flex: 1 }}>
					{/* The drawing canvas */}
					<Canvas style={{ height: layout.height, width: layout.width }}>
						<Background1
							width={layout.width}
							height={layout.height}
							backgroundColor={theme.colors.background}
						/>

						{/* Render page number on the bottom of the canvas */}
						{showPageNumber && (
							<SkiaText
								text={canvasNumber}
								x={layout.width * 0.9}
								y={layout.height - layout.width * 0.1}
								font={Roboto}
								color={theme.colors.textPrimary}
							/>
						)}

						{memoizedPaths}

						{current[canvasId] && current[canvasId]!.points.length > 0 && (
							<PathRenderer
								key={`current-${canvasId}`}
								path={current[canvasId]!}
								width={layout.width}
								height={layout.height}
							/>
						)}

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

					{/* The overlay menu icon */}
					<Pressable
						onPress={(e) => {
							e.stopPropagation()
							handleCanvasMenu(canvas!, e)
						}}
						style={{
							position: "absolute",
							top: 10,
							right: 10,
							padding: 8,
						}}
					>
						<MaterialC name='dots-vertical' size={24} color={theme.colors.textPrimary} />
					</Pressable>
				</View>
			</GestureDetector>
		</View>
	)
}
