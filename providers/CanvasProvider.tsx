/**
 * CanvasProvider Component
 *
 * Combines zoom, pan, tool, and canvas state providers.
 */

import { ReactNode } from "react"
import { ZoomProvider } from "../contexts/ZoomContext"
import { ToolProvider } from "../contexts/ToolContext"
import { CanvasStateProvider } from "../contexts/CanvasStateContext"
import { PanProvider } from "../contexts/PanContext"

export function CanvasProvider({ children }: { children: ReactNode }) {
	return (
		<ZoomProvider>
			<PanProvider>
				<ToolProvider>
					<CanvasStateProvider>{children}</CanvasStateProvider>
				</ToolProvider>
			</PanProvider>
		</ZoomProvider>
	)
}
