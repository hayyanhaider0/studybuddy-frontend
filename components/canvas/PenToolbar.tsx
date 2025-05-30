/**
 * PenToolbar Component
 *
 * Contains UI for the pen toolbar: color and stroke options.
 * Check /components/canvas/ColorOptions.tsx and
 * /components/canvas/StrokeOptions.tsx for more information.
 */

import { AnimatePresence, MotiView } from "moti"
import ColorOptions from "./ColorOptions"
import StrokeOptions from "./StrokeOptions"
import { useToolContext } from "../../contexts/ToolContext"
import { getCanvasStyles } from "../../styles/canvas"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function PenToolbar() {
	const { activeMenu } = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<AnimatePresence>
			{/* Only show when pen menu is active */}
			{activeMenu === "pen" && (
				// Animate up behind the toolbar
				<MotiView
					from={{ opacity: 0, translateY: 120 }}
					animate={{ opacity: 1, translateY: 0 }}
					exit={{ opacity: 0, translateY: 120 }}
					transition={{ type: "timing", duration: 300 }}
					style={styles.penToolbar}
				>
					<ColorOptions />
					<StrokeOptions />
				</MotiView>
			)}
		</AnimatePresence>
	)
}
