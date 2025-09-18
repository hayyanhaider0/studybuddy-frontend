/**
 * StrokeOptions Component
 *
 * Contains UI for the stroke options slider. Also contains
 * a ToolTip component that shows up while sliding through the
 * options.
 */

import Slider from "@react-native-community/slider"
import { useToolContext } from "../../../contexts/ToolContext"
import { Text, View } from "react-native"
import { useThemeContext } from "../../../../common/contexts/ThemeContext"
import { getCanvasStyles } from "../../../../../styles/canvas"

/**
 * ToolTip Component
 *
 * Shows a tool tip with a number that contains the stroke width
 *
 * @param currentValue - The current stroke width
 * @returns JSX Component
 */
function ToolTip({ currentValue }: { currentValue: number }) {
	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.tooltipContainer}>
			<Text style={styles.tooltipText}>{currentValue}</Text>
		</View>
	)
}

/**
 * SizeOptions Component
 *
 * Contains the slider that allows the user to select a stroke width.
 *
 * @returns JSX Component
 */
export default function SizeOptions() {
	const { tool, toolSettings, setToolSettings } = useToolContext() // Get tool context
	// Default minimum and maximum values for the slider.
	const MINIMUM_VALUE = 1
	const MAXIMUM_VALUE = 50

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors)

	return (
		<View style={styles.sliderContainer}>
			{/* Slider Component: Allows the user to slide and select a stroke width */}
			<Text style={{ color: theme.colors.textPrimary, fontWeight: "bold" }}>{MINIMUM_VALUE}</Text>
			<Slider
				key={tool}
				minimumValue={1}
				maximumValue={50}
				step={1}
				value={toolSettings[tool].size}
				// Change the size of the tool according to the slider value.
				onValueChange={(v) => {
					setToolSettings((prev) => ({
						...prev,
						[tool]: {
							...prev[tool],
							size: v,
							minWidth: v * 0.5,
							maxWidth: v * 1.5,
						},
					}))
				}}
				// Set the thumb and track color according to user interaction
				// Secondary when being used, white when not
				thumbTintColor='transparent'
				minimumTrackTintColor={theme.colors.tertiary}
				tapToSeek={true} // iOS only -- allow the user to tap and set a stroke width
				// Used for showing the tooltip
				// Check out the ToolTip function for more information
				StepMarker={({ stepMarked }) => {
					if (stepMarked) {
						return <ToolTip currentValue={toolSettings[tool].size} />
					}
				}}
				style={styles.slider}
			/>
			<Text style={{ color: theme.colors.textPrimary, fontWeight: "bold" }}>{MAXIMUM_VALUE}</Text>
		</View>
	)
}
