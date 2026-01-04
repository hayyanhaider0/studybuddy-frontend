/**
 * tools Utility
 *
 * Contains all available tools for the user on the toolbar i.e. pen, eraser,
 * pencil, highlighter, text.
 */

import { useTool } from "../features/notebook/contexts/ToolContext"
import { Pencil, Eraser, Highlighter, MousePointer2, TextCursor } from "lucide-react-native"
import { ToolType } from "../types/tools"

type ToolDefinitionType = {
	name: ToolType
	icon: React.ComponentType<{ size?: number; color?: string }>
	action: () => void
}

export function useToolDefinitions() {
	const { setActiveTool } = useTool() // Get tool values.

	// Object array that contains all available tools on the toolbar.
	const tools: ToolDefinitionType[] = [
		// Pointer tool to allow for gestures.
		{
			name: "pointer",
			icon: MousePointer2,
			action: () => setActiveTool("pointer"),
		},
		// Default pen tool that allows the user to draw paths.
		{
			name: "pen",
			icon: Pencil,
			action: () => setActiveTool("pen"),
		},
		// Default eraser tool that allows the user to delete paths by drawing over them.
		{
			name: "eraser",
			icon: Eraser,
			action: () => setActiveTool("eraser"),
		},
		// Thicker pen tool with decreased opacity.
		{
			name: "highlighter",
			icon: Highlighter,
			action: () => setActiveTool("highlighter"),
		},
		// Text tool that allows the user to type ASCII characters on the canvas.
		{
			name: "text",
			icon: TextCursor,
			action: () => setActiveTool("text"),
		},
	]

	return tools
}
