import { useCanvasActions } from "../hooks/useCanvasActions"
import { OptionType } from "../types/types"

export function useOptionDefinitions() {
	const { clearCanvas, undo, redo, toggleMenu } = useCanvasActions()
	const options: OptionType[] = [
		{ name: "undo", icon: "undo-variant", action: undo },
		{ name: "redo", icon: "redo-variant", action: redo },
		{ name: "clear", icon: "delete-off-outline", action: clearCanvas },
		{ name: "menu", icon: "dots-horizontal", action: toggleMenu },
	]

	return options
}
