/**
 * tools Utility
 *
 * Contains all available tools for the user on the toolbar i.e. pen, eraser,
 * pencil, highlighter, text.
 */

import { useTool } from "../features/notebook/contexts/ToolContext"
import { ToolType } from "../types/tools"

type ToolDefinitionType = {
	name: ToolType
	icon: string
	action: () => void
}

export function useToolDefinitions() {
	const { setActiveTool } = useTool() // Get tool values.

	// Object array that contains all available tools on the toolbar.
	const tools: ToolDefinitionType[] = [
		// Pointer tool to allow for gestures.
		{
			name: "pointer",
			icon: "cursor-default",
			action: () => setActiveTool("pointer"),
		},
		// Default pen tool that allows the user to draw paths.
		{
			name: "pen",
			icon: "pen",
			action: () => setActiveTool("pen"),
		},
		// Default eraser tool that allows the user to delete paths by drawing over them.
		{
			name: "eraser",
			icon: "eraser",
			action: () => setActiveTool("eraser"),
		},
		// Thicker pen tool with decreased opacity.
		{
			name: "highlighter",
			icon: "format-color-highlight",
			action: () => setActiveTool("highlighter"),
		},
		// Text tool that allows the user to type ASCII characters on the canvas.
		{
			name: "text",
			icon: "format-text",
			action: () => setActiveTool("text"),
		},
	]

	return tools
}
