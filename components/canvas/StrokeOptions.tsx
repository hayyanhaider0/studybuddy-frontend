/**
 * StrokeOptions Component
 *
 * Contains UI for the stroke options slider. Also contains
 * a ToolTip component that shows up while sliding through the
 * options.
 */

import Slider from "@react-native-community/slider"
import { useToolContext } from "../../contexts/ToolContext"
import { Text, View } from "react-native"
import { useState } from "react"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getCanvasStyles } from "../../styles/canvas"

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
			{/* Text inside the tool tip */}
			<Text style={styles.tooltipText}>{currentValue === 0 ? 1 : currentValue}</Text>
		</View>
	)
}

/**
 * StrokeOptions Component
 *
 * Contains the slider that allows the user to select a stroke width.
 *
 * @returns JSX Component
 */
export default function StrokeOptions() {
	const [isActive, setActive] = useState(false) // State to track whether the user is sliding
	const { tool, toolSettings, setToolSettings } = useToolContext() // Get tool context

	// Theming
	const { theme } = useThemeContext()
	const styles = getCanvasStyles(theme.colors, toolSettings[tool].color)

	return (
		<View style={styles.sliderContainer}>
			{/* A circle that shows the current stroke color */}
			<View style={styles.strokeIndicator} />

			{/* Slider Component: Allows the user to slide and select a stroke width */}
			<Slider
				minimumValue={1}
				maximumValue={30}
				step={1}
				value={toolSettings[tool].size}
				onValueChange={(v) =>
					setToolSettings((prev) => ({
						...prev,
						[tool]: {
							...prev[tool],
							size: v,
						},
					}))
				}
				// Set the thumb and track color according to user interaction
				// Secondary when being used, white when not
				thumbTintColor={isActive ? theme.colors.secondary : "#fff"}
				minimumTrackTintColor={isActive ? theme.colors.secondary : "#fff"}
				tapToSeek={true} // iOS only -- allow the user to tap and set a stroke width
				// Track sliding state
				onSlidingStart={() => setActive(true)}
				onSlidingComplete={() => setActive(false)}
				// Used for showing the tooltip
				// Check out the ToolTip function for more information
				StepMarker={({ stepMarked, currentValue }) => {
					if (!stepMarked || !isActive) return

					return <ToolTip currentValue={currentValue} />
				}}
				style={styles.slider}
			/>
		</View>
	)
}
