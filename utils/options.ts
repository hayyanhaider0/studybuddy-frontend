import { useCanvasActions } from "../hooks/useCanvasActions"

type OptionType = {
	name: string
	icon: string
	action: () => void
}

export function useOptionDefinitions() {
	const { clearCanvas, undo, redo, toggleMenu } = useCanvasActions()
	const options: OptionType[] = [
		{ name: "clear", icon: "delete", action: clearCanvas },
		{ name: "undo", icon: "undo", action: undo },
		{ name: "redo", icon: "redo", action: redo },
		{ name: "menu", icon: "menu", action: toggleMenu },
	]

	return options
}
