import { Gesture } from "react-native-gesture-handler"
import { runOnJS, withDecay } from "react-native-reanimated"
import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"
import { useZoomContext } from "../contexts/ZoomContext"
import { useCanvasActions } from "./useCanvasActions"
import { usePanContext } from "../contexts/PanContext"

export function useCanvasGestures() {
	const { current, setCurrent, setPaths, layout } = useCanvasContext()
	const { tool, stroke, strokeWidth } = useToolContext()
	const { scale, savedScale } = useZoomContext()
	const { offsetX, offsetY, translateX, translateY } = usePanContext()
	const { handleErase } = useCanvasActions()

	const pinchGesture = Gesture.Pinch()
		.onUpdate((e) => {
			const nextScale = savedScale.value * e.scale
			scale.value = Math.min(Math.max(nextScale, 0.7), 4)
		})
		.onEnd(() => {
			savedScale.value = scale.value
		})
		.runOnJS(true)

	const drawGesture = Gesture.Pan()
		.onBegin((e) => {
			if (e.numberOfPointers !== 1) return
			const localX = e.x - layout.x
			const localY = e.y - layout.y
			setCurrent(`M ${localX} ${localY}`)
		})
		.onUpdate((e) => {
			if (e.numberOfPointers !== 1) return

			if (tool === "eraser") {
				runOnJS(handleErase)(e.x, e.y)
				return
			}

			const localX = e.x - layout.x
			const localY = e.y - layout.y
			setCurrent((prev) => `${prev} L ${localX} ${localY}`)
		})
		.onEnd(() => {
			if (current) {
				setPaths((prev) => [...prev, { d: current, color: stroke, sw: strokeWidth }])
				setCurrent("")
			}
		})
		.runOnJS(true)

	const minX = -200
	const maxX = 200
	const minY = -300
	const maxY = 300

	const panGesture = Gesture.Pan()
		.onStart(() => {
			offsetX.value = translateX.value
			offsetY.value = translateY.value
		})
		.onUpdate((e) => {
			if (e.numberOfPointers && e.numberOfPointers === 2) {
				translateX.value = Math.max(minX, Math.min(offsetX.value + e.translationX, maxX))
				translateY.value = Math.max(minY, Math.min(offsetY.value + e.translationY, maxY))
			}
		})
		.runOnJS(true)

	return Gesture.Simultaneous(pinchGesture, panGesture, drawGesture)
}
