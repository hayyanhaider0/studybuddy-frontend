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
	{ base: 0.002, minWidth: 0.001, maxWidth: 0.004 }, // ~2px on 1000px canvas
	{ base: 0.004, minWidth: 0.002, maxWidth: 0.008 }, // ~4px
	{ base: 0.008, minWidth: 0.004, maxWidth: 0.016 }, // ~8px
	{ base: 0.016, minWidth: 0.008, maxWidth: 0.032 }, // ~16px
	{ base: 0.032, minWidth: 0.016, maxWidth: 0.064 }, // ~32px
	{ base: 0.048, minWidth: 0.024, maxWidth: 0.096 }, // ~48px
] as const

// Pencil size presets with subtle pressure sensitivity
export const PENCIL_SIZE_PRESETS: readonly DrawingSizePreset[] = [
	{ base: 0.0005, minWidth: 0.0003, maxWidth: 0.001 }, // ~0.5px
	{ base: 0.001, minWidth: 0.0005, maxWidth: 0.002 }, // ~1px
	{ base: 0.002, minWidth: 0.001, maxWidth: 0.003 }, // ~2px
	{ base: 0.003, minWidth: 0.0015, maxWidth: 0.005 }, // ~3px
	{ base: 0.005, minWidth: 0.0025, maxWidth: 0.008 }, // ~5px
	{ base: 0.008, minWidth: 0.004, maxWidth: 0.012 }, // ~8px
] as const

// Highlighter size presets with wide pressure range
export const HIGHLIGHTER_SIZE_PRESETS: readonly DrawingSizePreset[] = [
	{ base: 0.016, minWidth: 0.012, maxWidth: 0.024 }, // ~16px
	{ base: 0.024, minWidth: 0.016, maxWidth: 0.032 }, // ~24px
	{ base: 0.032, minWidth: 0.02, maxWidth: 0.04 }, // ~32px
	{ base: 0.04, minWidth: 0.028, maxWidth: 0.052 }, // ~40px
	{ base: 0.048, minWidth: 0.036, maxWidth: 0.064 }, // ~48px
	{ base: 0.064, minWidth: 0.048, maxWidth: 0.08 }, // ~64px
] as const

// Eraser size presets (normalized)
export const ERASER_SIZE_PRESETS: readonly EraserSizePreset[] = [
	0.002, // ~2px
	0.004, // ~4px
	0.008, // ~8px
	0.016, // ~16px
	0.032, // ~32px
	0.064, // ~64px
] as const

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
