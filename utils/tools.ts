import { useToolContext } from "../contexts/ToolContext"
import { ToolName, ToolType } from "../types/types"

export function useToolDefinitions() {
	const { tool, setTool, setActiveMenu, setColorPicker } = useToolContext()

	const handleToolSelection = (selectedTool: ToolName) => {
		if (tool === selectedTool) {
			setActiveMenu((prev) => {
				const next = prev === selectedTool ? null : selectedTool
				if (next !== "pen") {
					setColorPicker(false)
				}
				return next
			})
		} else {
			setTool(selectedTool)
			setActiveMenu(null)
			setColorPicker(false)
		}
	}

	const tools: ToolType[] = [
		{
			name: "pen",
			icon: "pen",
			image: require("../assets/canvasImages/pen.png"),
			action: () => handleToolSelection("pen"),
		},
		{
			name: "eraser",
			icon: "eraser",
			image: require("../assets/canvasImages/eraser.png"),
			action: () => handleToolSelection("eraser"),
		},
		{
			name: "pencil",
			icon: "pencil",
			image: require("../assets/canvasImages/pencil.png"),
			action: () => handleToolSelection("pencil"),
		},
		{
			name: "highlighter",
			icon: "format-color-highlight",
			image: require("../assets/canvasImages/highlighter.png"),
			action: () => handleToolSelection("highlighter"),
		},
		{
			name: "text",
			icon: "format-text",
			image: require("../assets/canvasImages/text.png"),
			action: () => handleToolSelection("text"),
		},
	]

	return tools
}
