/**
 * ContextMenu Component
 *
 * This includes the UI for a general context menu that opens up as a dropdown on some menus
 * and on long press.
 */

import { AnimatePresence, MotiView } from "moti"
import { View, Text } from "react-native"
import { TouchableOpacity } from "react-native"
import { useContextMenu } from "../../contexts/ContextMenuContext"
import { getGlobalStyles } from "../../styles/global"
import { useThemeContext } from "../../contexts/ThemeContext"

export default function ContextMenu() {
	// Get context values
	const { visible, position, options, closeMenu, setMenuSize } = useContextMenu()

	// Theming
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	return (
		<AnimatePresence>
			{visible && (
				<View style={{ position: "absolute", width: "100%", height: "100%" }}>
					<TouchableOpacity style={{ width: "100%", height: "100%" }} onPress={closeMenu}>
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
										{ padding: 16 },
									]}
								>
									<Text style={{ textAlign: "left", color: theme.colors.textPrimary }}>
										{opt.label}
									</Text>
								</TouchableOpacity>
							))}
						</MotiView>
					</TouchableOpacity>
				</View>
			)}
		</AnimatePresence>
	)
}
