/**
 * ContextMenu Component
 *
 * This includes the UI for a general context menu that opens up as a dropdown on some menus
 * and on long press.
 */

import { AnimatePresence, MotiView } from "moti"
import { View, Text, BackHandler } from "react-native"
import { TouchableOpacity } from "react-native"
import { useContextMenu } from "../contexts/ContextMenuContext"
import { useThemeContext } from "../contexts/ThemeContext"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"

export default function ContextMenu() {
	// Get context values
	const { visible, position, options, closeMenu, setMenuSize } = useContextMenu()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	// Close menu on tap.
	const gesture = Gesture.Tap()
		.onEnd(() => {
			closeMenu()
		})
		.runOnJS(true)

	// Close the menu on backpress.
	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				if (visible) {
					closeMenu()
					return true
				}
				return false
			}

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

			return () => subscription.remove()
		}, [visible])
	)

	return (
		<AnimatePresence>
			{visible && (
				<GestureDetector gesture={gesture}>
					<View style={{ flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
						<MotiView
							// Get the layout to protect the menu from going off screen.
							onLayout={(e) => {
								const { width, height } = e.nativeEvent.layout
								setMenuSize({ width, height })
							}}
							from={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: "timing", duration: 200 }}
							style={[
								GlobalStyles.dropdownContainer,
								{
									top: position.y,
									left: position.x,
									// Hide the menu initially if it's at 0,0 (not yet positioned)
									opacity: position.x === 0 && position.y === 0 ? 0 : undefined,
									elevation: 4,
								},
							]}
						>
							{/* All options in the menu */}
							{options?.map((opt, i) => (
								<TouchableOpacity
									key={i}
									onPress={opt.onPress}
									style={[
										i !== options.length - 1 && {
											borderBottomWidth: 1,
											borderColor: theme.colors.onSecondary,
										},
										{ padding: 16, paddingRight: 32, justifyContent: "center" },
									]}
								>
									<Text
										style={[
											GlobalStyles.paragraph,
											opt.label.startsWith("Generate")
												? { color: "lightblue" }
												: opt.label === "Delete"
												? { color: theme.colors.error }
												: {},
										]}
									>
										{opt.label}
									</Text>
								</TouchableOpacity>
							))}
						</MotiView>
					</View>
				</GestureDetector>
			)}
		</AnimatePresence>
	)
}
