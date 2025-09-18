/**
 * CanvasProvider Component
 *
 * Combines transform, tool, and canvas state providers.
 */

import { ReactNode } from "react"
import { ToolProvider } from "../features/notebook/contexts/ToolContext"
import { CanvasStateProvider } from "../features/notebook/contexts/CanvasStateContext"
import { TransformProvider } from "../features/notebook/contexts/TransformContext"

export function CanvasProvider({ children }: { children: ReactNode }) {
	return (
		<ToolProvider>
			<TransformProvider>
				<CanvasStateProvider>{children}</CanvasStateProvider>
			</TransformProvider>
		</ToolProvider>
	)
}
