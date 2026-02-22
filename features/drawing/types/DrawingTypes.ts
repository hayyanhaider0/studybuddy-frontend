import { SkPath, SkRect } from "@shopify/react-native-skia"
import { SizePresetIndex, ToolType } from "../../../types/tools"

// Single point in a drawing stroke.
export interface PathPoint {
	x: number // normalized x coordinate 0-1.
	y: number // normalized y coordinate 0-1.
	pressure: number // 0-1 (0 = no pressure, 1 = max pressure)
}

// Settings for how a brush draws.
export interface BrushSettings {
	type: ToolType // type of brush.
	color: string // hex color.
	sizePresetIndex: SizePresetIndex // size preset index.
	opacity: number // 0-1 transparency.
}

// A complete drawing stroke.
export interface PathType {
	id: string // path id.
	canvasId: string // which canvas this path belongs to.
	points: PathPoint[] // points in the path.
	brush: BrushSettings // how the path should look.
	bounds?: SkRect // bounding box for the path.
	skPath?: SkPath | null // cached Skia path.
}
