/**
 * tools Utility
 *
 * Contains all available tools for the user on the toolbar i.e. pen, eraser,
 * pencil, highlighter, text.
 */

import { useToolContext } from "../contexts/ToolContext"
import { ToolName, ToolType } from "../types/global"

export function useToolDefinitions() {
	const { tool, setTool, setActiveMenu, setColorPicker } = useToolContext() // Get tool values.

	/**
	 * handleToolSelection function
	 *
	 * Handles logic related to selecting a tool, and allowing the user to
	 * toggle menus of different tools.
	 * @param selectedTool - Tool to be selected
	 */
	const handleToolSelection = (selectedTool: ToolName) => {
		// If the tool selected next is the currently selected tool.
		if (tool === selectedTool) {
			setActiveMenu((prev) => {
				// If the next selected tool is also the same, toggle its menu.
				const next = prev === selectedTool ? null : selectedTool
				// If the next tool is not the pen, close the color picker.
				if (next !== "pen") {
					setColorPicker(false)
				}
				return next
			})
		} else {
			// Else, select the other tool, and close the menu and color picker (if open).
			setTool(selectedTool)
			setActiveMenu(null)
			setColorPicker(false)
		}
	}

	// Object array that contains all available tools on the toolbar.
	const tools: ToolType[] = [
		// Default pen tool that allows the user to draw paths.
		{
			name: "pen",
			icon: "pen",
			image: require("../assets/canvasImages/pen.png"),
			action: () => handleToolSelection("pen"),
		},
		// Default eraser tool that allows the user to delete paths by drawing over them.
		{
			name: "eraser",
			icon: "eraser",
			image: require("../assets/canvasImages/eraser.png"),
			action: () => handleToolSelection("eraser"),
		},
		// Thicker pen tool with decreased opacity.
		{
			name: "highlighter",
			icon: "format-color-highlight",
			image: require("../assets/canvasImages/highlighter.png"),
			action: () => handleToolSelection("highlighter"),
		},
		// Text tool that allows the user to type ASCII characters on the canvas.
		{
			name: "text",
			icon: "format-text",
			image: require("../assets/canvasImages/text.png"),
			action: () => handleToolSelection("text"),
		},
		// Pointer tool to allow for gestures.
		{
			name: "pointer",
			icon: "pointer",
			image: require("../assets/canvasImages/pointer.png"),
			action: () => handleToolSelection("pointer"),
		},
	]

	return tools
}
