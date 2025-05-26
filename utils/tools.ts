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
			action: () => handleToolSelection("pen"),
		},
		{
			name: "eraser",
			icon: "eraser",
			action: () => handleToolSelection("eraser"),
		},
		{ name: "pencil", icon: "pencil", action: () => handleToolSelection("pencil") },
		{
			name: "highlighter",
			icon: "format-color-highlight",
			action: () => handleToolSelection("highlighter"),
		},
		{ name: "text", icon: "format-text", action: () => handleToolSelection("text") },
	]

	return tools
}
