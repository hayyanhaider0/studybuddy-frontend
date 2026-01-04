import { createContext, ReactNode, useContext, useState } from "react"
import {
	DEFAULT_DRAWING_SETTINGS,
	DrawingSettingsState,
	DrawingTool,
	DrawingToolSettings,
	SizePresetIndex,
} from "../../../types/tools"
import { Color } from "../../../types/global"
import { storeJSON } from "../../../utils/storage"

interface DrawingSettingsContextType {
	// All settings for drawing tools and eraser.
	settings: DrawingSettingsState["settings"]
	// All swatches for drawing tools.
	swatches: DrawingSettingsState["swatches"]

	// Update a specific setting for a drawing tool.
	updateDrawingToolSetting: <K extends keyof DrawingToolSettings>(
		tool: DrawingTool,
		key: K,
		value: DrawingToolSettings[K]
	) => void

	// Update eraser size preset.
	updateEraserSizePreset: (presetIndex: SizePresetIndex) => void

	// Update a swatch color for some tool.
	updateSwatch: (tool: DrawingTool, index: number, color: Color) => void

	// Set active swatch index for a tool.
	setActiveSwatch: (tool: DrawingTool, index: number) => void

	// Set active size preset for a tool.
	setActiveSizePreset: (tool: DrawingTool | "eraser", presetIndex: SizePresetIndex) => void

	// Reset all settings to defaults.
	resetToDefaults: () => void
}

export const DrawingSettingsContext = createContext<DrawingSettingsContextType | null>(null)

export const DrawingSettingsProvider = ({ children }: { children: ReactNode }) => {
	const [settings, setSettings] = useState<DrawingSettingsState["settings"]>(
		DEFAULT_DRAWING_SETTINGS.settings
	)
	const [swatches, setSwatches] = useState<DrawingSettingsState["swatches"]>(
		DEFAULT_DRAWING_SETTINGS.swatches
	)

	const updateDrawingToolSetting = <K extends keyof DrawingToolSettings>(
		tool: DrawingTool,
		key: K,
		value: DrawingToolSettings[K]
	) => {
		setSettings((prev) => {
			const updated = {
				...prev,
				[tool]: {
					...prev[tool],
					[key]: value,
				},
			}

			storeJSON(`${tool}_settings`, JSON.stringify(updated[tool]))
			return updated
		})
	}

	const updateEraserSizePreset = (presetIndex: SizePresetIndex) => {
		setSettings((prev) => {
			const updated = {
				...prev,
				eraser: { activeSizePreset: presetIndex },
			}

			storeJSON("eraser_settings", JSON.stringify(updated["eraser"]))
			return updated
		})
	}

	const updateSwatch = (tool: DrawingTool, index: number, color: Color) => {
		setSwatches((prev) => {
			const updatedSwatches = [...prev[tool]]
			updatedSwatches[index] = color
			const updated = {
				...prev,
				[tool]: updatedSwatches,
			}

			storeJSON(`${tool}_swatches`, JSON.stringify(updated[tool]))
			return updated
		})

		if (settings[tool].activeSwatchIndex === index) {
			updateDrawingToolSetting(tool, "color", color)
		}
	}

	const setActiveSwatch = (tool: DrawingTool, index: number) => {
		const color = swatches[tool][index]
		setSettings((prev) => {
			const updated = {
				...prev,
				[tool]: {
					...prev[tool],
					activeSwatchIndex: index,
					color,
				},
			}

			storeJSON(`${tool}_settings`, JSON.stringify(updated[tool]))
			return updated
		})
	}

	const setActiveSizePreset = (tool: DrawingTool | "eraser", presetIndex: SizePresetIndex) => {
		if (tool === "eraser") {
			updateEraserSizePreset(presetIndex)
		} else {
			updateDrawingToolSetting(tool, "activeSizePreset", presetIndex)
		}
	}

	const resetToDefaults = () => {
		setSettings(DEFAULT_DRAWING_SETTINGS.settings)
		setSwatches(DEFAULT_DRAWING_SETTINGS.swatches)

		// Clear storage
		storeJSON("pen_settings", JSON.stringify(DEFAULT_DRAWING_SETTINGS.settings.pen))
		storeJSON("pencil_settings", JSON.stringify(DEFAULT_DRAWING_SETTINGS.settings.pencil))
		storeJSON("highlighter_settings", JSON.stringify(DEFAULT_DRAWING_SETTINGS.settings.highlighter))
		storeJSON("eraser_settings", JSON.stringify(DEFAULT_DRAWING_SETTINGS.settings.eraser))
		storeJSON("pen_swatches", JSON.stringify(DEFAULT_DRAWING_SETTINGS.swatches.pen))
		storeJSON("pencil_swatches", JSON.stringify(DEFAULT_DRAWING_SETTINGS.swatches.pencil))
		storeJSON("highlighter_swatches", JSON.stringify(DEFAULT_DRAWING_SETTINGS.swatches.highlighter))
	}

	return (
		<DrawingSettingsContext.Provider
			value={{
				settings,
				swatches,
				updateDrawingToolSetting,
				updateEraserSizePreset,
				updateSwatch,
				setActiveSwatch,
				setActiveSizePreset,
				resetToDefaults,
			}}
		>
			{children}
		</DrawingSettingsContext.Provider>
	)
}

export const useDrawingSettings = () => {
	const ctx = useContext(DrawingSettingsContext)
	if (!ctx) throw new Error("useDrawingSettings must be used within a DrawingSettingsProvider")
	return ctx
}

export const useDrawingToolSettings = (tool: DrawingTool) => {
	const { settings, updateDrawingToolSetting } = useDrawingSettings()
	return {
		settings: settings[tool],
		updateSetting: <K extends keyof DrawingToolSettings>(key: K, value: DrawingToolSettings[K]) =>
			updateDrawingToolSetting(tool, key, value),
	}
}

export const useEraserSettings = () => {
	const { settings, updateEraserSizePreset } = useDrawingSettings()
	return {
		settings: settings.eraser,
		updateSizePreset: updateEraserSizePreset,
	}
}

export const useToolSettings = (tool: DrawingTool) => {
	const { swatches, updateSwatch, setActiveSwatch } = useDrawingSettings()
	return {
		swatches: swatches[tool],
		updateSwatch: (index: number, color: Color) => updateSwatch(tool, index, color),
		setActiveSwatch: (index: number) => setActiveSwatch(tool, index),
	}
}
