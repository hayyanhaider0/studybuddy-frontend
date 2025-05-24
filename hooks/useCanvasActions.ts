import { useCanvasContext } from "../contexts/CanvasStateContext"
import { useToolContext } from "../contexts/ToolContext"

export function useCanvasActions() {
	const { setPaths } = useCanvasContext()
	const { tool, setTool } = useToolContext()

	const clearCanvas = () => setPaths([])

	const selectEraser = () => {
		if (tool === "eraser") {
			console.log("Eraser already selected!")
			return
		}

		setTool("eraser")
		console.log("Eraser selected!")
	}

	const undo = () => setPaths((prev) => prev.slice(0, -1))

	const redo = () => console.log("redo")

	const toggleMenu = () => console.log("menu")

	const handleErase = (x: number, y: number) => {
		const radius = 20
		setPaths((prev) =>
			prev.filter((p) => {
				const regex = /(-?\d+(\.\d+)?)[ ,](-?\d+(\.\d+)?)/g
				let match
				while ((match = regex.exec(p.d)) !== null) {
					const px = parseFloat(match[1])
					const py = parseFloat(match[3])
					const dx = px - x
					const dy = py - y
					if (Math.sqrt(dx * dx + dy * dy) < radius) return false
				}
				return true
			})
		)
	}

	return { clearCanvas, selectEraser, undo, redo, toggleMenu, handleErase }
}
