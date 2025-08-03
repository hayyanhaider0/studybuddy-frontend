import { StrokeCap, StrokeJoin } from "@shopify/react-native-skia"
import { BrushType } from "../../../enums/global"

// Single point in a drawing stroke.
export interface PathPoint {
	x: number // normalized x coordinate 0-1.
	y: number // normalized y coordinate 0-1.
	pressure: number // 0-1 (0 = no pressure, 1 = max pressure)
}

// Settings for how a brush draws.
export interface BrushSettings {
	type: BrushType
	color: string // hex color.
	baseWidth: number // base stroke width in pixels.
	minWidth: number // thinnest width (light pressure).
	maxWidth: number // thicket width (high pressure).
	opacity: number // 0-1 transparency.
	strokeCap: StrokeCap // sets the cap to the path.
	strokeJoin: StrokeJoin // Sets how the paths join.
}

// A complete drawing stroke.
export interface PathType {
	id: string
	points: PathPoint[] // points in the path.
	brush: BrushSettings // how the path should look.
}
