import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native"
import Material from "react-native-vector-icons/MaterialIcons"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../../contexts/ThemeContext"
import { AnimatePresence, MotiView } from "moti"
import { useState } from "react"
import { getChapterTabStyles } from "../../styles/chapterTab"

export default function Pagination({ extended }: { extended: boolean }) {
	const { theme } = useThemeContext()
	const styles = getChapterTabStyles(theme.colors)

	const prevPage = () => {
		console.log("Previous page")
	}

	const newPage = () => {
		console.log("New page")
	}

	const nextPage = () => {
		console.log("Next page")
	}

	return (
		<AnimatePresence>
			{extended && (
				<MotiView
					from={{ translateY: -36, opacity: 0 }}
					animate={{ translateY: 0, opacity: 1 }}
					exit={{ translateY: -36, opacity: 0 }}
					transition={{ duration: 100, type: "timing" }}
					style={styles.paginationContainer}
				>
					<TouchableOpacity
						onPress={prevPage}
						style={{
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 8,
						}}
					>
						<Material name='arrow-back-ios-new' size={24} color={theme.colors.textPrimary} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={newPage}
						style={{
							backgroundColor: theme.colors.secondary,
							borderRadius: 999,
							justifyContent: "center",
							alignItems: "center",
							overflow: "hidden",
						}}
					>
						<LinearGradient
							colors={theme.accent.gradient.colors}
							start={theme.accent.gradient.start}
							end={theme.accent.gradient.end}
						>
							<MaterialC name='plus' size={32} color={theme.accent.onAccent} />
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={nextPage}
						style={{
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal: 8,
						}}
					>
						<Material name='arrow-forward-ios' size={24} color={theme.colors.textPrimary} />
					</TouchableOpacity>
				</MotiView>
			)}
		</AnimatePresence>
	)
}
