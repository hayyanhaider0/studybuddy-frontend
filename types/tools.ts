/**
 * tools.ts
 *
 * Contains:
 * All the type information for each category of available tools.
 * Size presets, default and constant settings for each tool that can draw.
 * Type guard functions to allow robust checking for gestures.
 * Helper functions to get size presets.
 */

import { Color } from "./global"

/**
 * Tool Categories
 */

// Drawing tools allow the user to draw on the canvas.
export type DrawingTool = "pen" | "pencil" | "highlighter"

// Eraser tool allows the user to erase drawings on the canvas.
export type EraserTool = "eraser"

// Mode tools change the mode the canvas is currently in.
export type ModeTool = "pointer" | "text"

// All available tools.
export type ToolType = DrawingTool | EraserTool | ModeTool

/**
 * Size Preset Types
 */

// Size preset indeces.
export type SizePresetIndex = 0 | 1 | 2 | 3 | 4 | 5

// Drawing tool size presets with pressure sensitivity ranges.
export type DrawingSizePreset = {
	// Base display size.
	base: number
	// Minimum width - light pressure.
	minWidth: number
	// Maximum width - heavy pressure.
	maxWidth: number
}

// Eraser size preset - no pressure sensitivity.
export type EraserSizePreset = number

/**
 * Tool Settings Types
 */

// Settings per drawing tool.
export type DrawingToolSettings = {
	color: Color
	activeSizePreset: SizePresetIndex
	opacity: number
	activeSwatchIndex: number
}

// Settings for the eraser.
export type EraserSettings = {
	activeSizePreset: SizePresetIndex
}

// Settings for the text mode.
export type TextSettings = {
	color: string
	fontSize: number
	fontFamily?: string
	alignment?: "left" | "center" | "right"
}

/**
 * State Shape Types
 */

// Map of all drawing tool settings.
export type DrawingToolSettingsMap = Record<DrawingTool, DrawingToolSettings>

// Map of swatches per drawing tool.
export type DrawingToolSwatchesMap = Record<DrawingTool, Color[]>

// Complete drawing settings state.
export type DrawingSettingsState = {
	settings: DrawingToolSettingsMap & { eraser: EraserSettings }
	swatches: DrawingToolSwatchesMap
}

/**
 * Constants
 */

// Array of all drawing tools.
export const DRAWING_TOOLS: readonly DrawingTool[] = ["pen", "pencil", "highlighter"] as const

// Array of all modes.
export const MODE_TOOLS: readonly ModeTool[] = ["pointer", "text"] as const

/**
 * Default Swatches
 */

// Default color swatches for drawing tools.
export const DEFAULT_DRAWING_SWATCHES: Color[] = [
	"#DC2626",
	"#FB923C",
	"#FACC15",
	"#3B82F6",
	"#10B981",
	"#000000",
]

// Default color swatches for the highlighter.
export const DEFAULT_HIGHLIGHTER_SWATCHES: Color[] = [
	"#FFFF0080",
	"#FF69B480",
	"#00FFFF80",
	"#90EE9080",
	"#FFA50080",
	"#DDA0DD80",
]

/**
 * Default Size Presets
 */

// Pen size presets with pressure sensitivity
export const PEN_SIZE_PRESETS: readonly DrawingSizePreset[] = [
	{ base: 2, minWidth: 1, maxWidth: 4 },
	{ base: 4, minWidth: 2, maxWidth: 8 },
	{ base: 8, minWidth: 4, maxWidth: 16 },
	{ base: 16, minWidth: 8, maxWidth: 32 },
	{ base: 32, minWidth: 16, maxWidth: 64 },
	{ base: 48, minWidth: 24, maxWidth: 96 },
] as const

// Pencil size presets with subtle pressure sensitivity
export const PENCIL_SIZE_PRESETS: readonly DrawingSizePreset[] = [
	{ base: 0.5, minWidth: 0.3, maxWidth: 1 },
	{ base: 1, minWidth: 0.5, maxWidth: 2 },
	{ base: 2, minWidth: 1, maxWidth: 3 },
	{ base: 3, minWidth: 1.5, maxWidth: 5 },
	{ base: 5, minWidth: 2.5, maxWidth: 8 },
	{ base: 8, minWidth: 4, maxWidth: 12 },
] as const

// Highlighter size presets with wide pressure range
export const HIGHLIGHTER_SIZE_PRESETS: readonly DrawingSizePreset[] = [
	{ base: 16, minWidth: 12, maxWidth: 24 },
	{ base: 24, minWidth: 16, maxWidth: 32 },
	{ base: 32, minWidth: 20, maxWidth: 40 },
	{ base: 40, minWidth: 28, maxWidth: 52 },
	{ base: 48, minWidth: 36, maxWidth: 64 },
	{ base: 64, minWidth: 48, maxWidth: 80 },
] as const

// Highlighter size presets with pressure sensitivity.
export const ERASER_SIZE_PRESETS: readonly EraserSizePreset[] = [2, 4, 8, 16, 32, 64] as const

/**
 * Default Settings
 */

// Default settings for the pen tool.
export const DEFAULT_PEN_SETTINGS: DrawingToolSettings = {
	color: "#DC2626",
	activeSizePreset: 0,
	opacity: 1,
	activeSwatchIndex: 0,
}

// Default settings for the pencil tool.
export const DEFAULT_PENCIL_SETTINGS: DrawingToolSettings = {
	color: "#000000",
	activeSizePreset: 0,
	opacity: 0.8,
	activeSwatchIndex: 5,
}

// Default settings for the pencil tool.
export const DEFAULT_HIGHLIGHTER_SETTINGS: DrawingToolSettings = {
	color: "#FFFF0080",
	activeSizePreset: 0,
	opacity: 0.5,
	activeSwatchIndex: 0,
}

// Default settings for the eraser tool.
export const DEFAULT_ERASER_SETTINGS: EraserSettings = {
	activeSizePreset: 0,
}

// Complete default settings map.
export const DEFAULT_DRAWING_SETTINGS: DrawingSettingsState = {
	settings: {
		pen: DEFAULT_PEN_SETTINGS,
		pencil: DEFAULT_PENCIL_SETTINGS,
		highlighter: DEFAULT_HIGHLIGHTER_SETTINGS,
		eraser: DEFAULT_ERASER_SETTINGS,
	},
	swatches: {
		pen: DEFAULT_DRAWING_SWATCHES,
		pencil: DEFAULT_DRAWING_SWATCHES,
		highlighter: DEFAULT_HIGHLIGHTER_SWATCHES,
	},
}

/**
 * Type Guards
 */

/**
 * Checks whether a tool is a drawing tool.
 * @param tool - The tool to be checked.
 * @returns True if the tool is a drawing tool.
 */
export function isDrawingTool(tool: ToolType): tool is DrawingTool {
	return DRAWING_TOOLS.includes(tool as DrawingTool)
}

/**
 * Checks whether a tool is an eraser.
 * @param tool - The tool to be checked.
 * @returns True if the tool is an eraser.
 */
export function isEraserTool(tool: ToolType): tool is EraserTool {
	return tool === "eraser"
}

/**
 * Checks whether a tool is a mode selector tool.
 * @param tool - The tool to be checked.
 * @returns True if the tool is a mode selector tool.
 */
export function isModeTool(tool: ToolType): tool is ModeTool {
	return MODE_TOOLS.includes(tool as ModeTool)
}

/**
 * Checks whether a tool can draw on the canvas.
 * @param tool - The tool to be checked.
 * @returns True if the tool can draw on the canvas.
 */
export function canDraw(tool: ToolType): tool is DrawingTool | EraserTool {
	return isDrawingTool(tool) || isEraserTool(tool)
}

/**
 * Helper Functions
 */

/**
 * Gets the size preset on a given index for the given drawing tool.
 * @param tool - The tool to get size preset of.
 * @param presetIndex - The index of the size preset.
 * @returns Size preset for the tool on presetIndex.
 */
export function getDrawingSizePreset(
	tool: DrawingTool,
	presetIndex: SizePresetIndex
): DrawingSizePreset {
	switch (tool) {
		case "pen":
			return PEN_SIZE_PRESETS[presetIndex]
		case "pencil":
			return PENCIL_SIZE_PRESETS[presetIndex]
		case "highlighter":
			return HIGHLIGHTER_SIZE_PRESETS[presetIndex]
	}
}

/**
 * Gets the size preset of the eraser on a given index.
 * @param presetIndex - Index of the size preset.
 * @returns Size of the eraser at the presetIndex.
 */
export function getEraserSizePreset(presetIndex: SizePresetIndex): EraserSizePreset {
	return ERASER_SIZE_PRESETS[presetIndex]
}
