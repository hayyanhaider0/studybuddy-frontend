import { useCanvasActions } from "../hooks/useCanvasActions"
import { OptionType } from "../types/types"

export function useOptionDefinitions() {
	const { clearCanvas, undo, redo, toggleMenu } = useCanvasActions()
	const options: OptionType[] = [
		{ name: "undo", icon: "undo", action: undo },
		{ name: "redo", icon: "redo", action: redo },
		{ name: "clear", icon: "delete", action: clearCanvas },
		{ name: "menu", icon: "menu", action: toggleMenu },
	]

	return options
}
