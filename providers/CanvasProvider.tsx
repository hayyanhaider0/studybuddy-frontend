/**
 * CanvasProvider Component
 *
 * Combines zoom, pan, tool, and canvas state providers.
 */

import { ReactNode } from "react"
import { ToolProvider } from "../contexts/ToolContext"
import { CanvasStateProvider } from "../contexts/CanvasStateContext"
import { TransformProvider } from "../contexts/TransformContext"

export function CanvasProvider({ children }: { children: ReactNode }) {
	return (
		<ToolProvider>
			<TransformProvider>
				<CanvasStateProvider>{children}</CanvasStateProvider>
			</TransformProvider>
		</ToolProvider>
	)
}
