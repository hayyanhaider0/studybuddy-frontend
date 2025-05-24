import { useToolContext } from "../contexts/ToolContext"
import { ToolType } from "../navigation/types"

export function useToolDefinitions() {
	const { tool, setTool, setActiveMenu } = useToolContext()
	const tools: ToolType[] = [
		{
			name: "pen",
			icon: "pen",
			action: () => {
				tool === "pen" ? setActiveMenu((prev) => (prev === "pen" ? null : "pen")) : setTool("pen")
			},
		},
		{ name: "eraser", icon: "eraser", action: () => setTool("eraser") },
		{ name: "pencil", icon: "pencil", action: () => setTool("pencil") },
		{ name: "highlighter", icon: "format-color-highlight", action: () => setTool("highlighter") },
		{ name: "text", icon: "format-text", action: () => setTool("text") },
	]

	return tools
}
