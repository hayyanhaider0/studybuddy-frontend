/**
 * CanvasProvider Component
 *
 * Combines transform, tool, and canvas state providers.
 */

import { ReactNode } from "react"
import { ToolProvider } from "../features/notebook/contexts/ToolContext"
import { CanvasStateProvider } from "../features/notebook/contexts/CanvasStateContext"
import { TransformProvider } from "../features/notebook/contexts/TransformContext"
import { DrawingSettingsProvider } from "../features/notebook/contexts/DrawingSettingsContext"

export function CanvasProvider({ children }: { children: ReactNode }) {
	return (
		<ToolProvider>
			<DrawingSettingsProvider>
				<TransformProvider>
					<CanvasStateProvider>{children}</CanvasStateProvider>
				</TransformProvider>
			</DrawingSettingsProvider>
		</ToolProvider>
	)
}
