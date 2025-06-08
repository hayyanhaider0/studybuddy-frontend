/**
 * ToolMenu Component
 *
 * Contains UI for the pen toolbar: color and stroke options.
 * Check /components/canvas/ColorOptions.tsx and
 * /components/canvas/StrokeOptions.tsx for more information.
 */

import { AnimatePresence, MotiView } from "moti"
import ColorOptions from "./ColorOptions"
import SizeOptions from "./SizeOptions"
import { useToolContext } from "../../../contexts/ToolContext"
import { getCanvasStyles } from "../../../styles/canvas"
import { useThemeContext } from "../../../contexts/ThemeContext"
import Handle from "../../common/Handle"

export default function ToolMenu() {
	const { tool, activeMenu, setActiveMenu, setColorPicker } = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<>
			<AnimatePresence>
				{/* Only show when pen menu is active */}
				{activeMenu !== null && (
					// Animate up behind the toolbar
					<MotiView
						from={{ opacity: 0, translateY: 120 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 120 }}
						transition={{ type: "timing", duration: 300 }}
						style={styles.toolMenu}
					>
						<Handle
							close={() => {
								setActiveMenu(null)
								setColorPicker(false)
							}}
						/>
						<ColorOptions tool={tool} />
						<SizeOptions />
					</MotiView>
				)}
			</AnimatePresence>
		</>
	)
}
