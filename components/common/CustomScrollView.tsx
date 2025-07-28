import { ReactNode } from "react"
import { ScrollViewProps, View, ViewStyle } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { ScrollView } from "react-native-gesture-handler"

interface CustomScrollView extends Omit<ScrollViewProps, "style" | "contentContainerStyle"> {
	containerStyle?: ViewStyle
	contentStyle?: ViewStyle
	padding?: number
	showScrollIndicator?: boolean
	fillSpace?: boolean
	children: ReactNode
}

export default function CustomScrollView({
	children,
	containerStyle,
	contentStyle,
	padding = 8,
	showScrollIndicator = false,
	fillSpace = false,
	keyboardShouldPersistTaps = "handled",
	bounces = true,
	...scrollViewProps
}: CustomScrollView) {
	const { GlobalStyles } = useThemeContext()

	return (
		<View style={[GlobalStyles.container, containerStyle]}>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={[
					{
						padding,
						paddingTop: padding * 2,
						...(fillSpace && { flexGrow: 1 }),
					},
					contentStyle,
				]}
				showsVerticalScrollIndicator={showScrollIndicator}
				showsHorizontalScrollIndicator={false}
				keyboardShouldPersistTaps={keyboardShouldPersistTaps}
				bounces={bounces}
				scrollEventThrottle={16}
				removeClippedSubviews={true}
				{...scrollViewProps}
			>
				{children}
			</ScrollView>
		</View>
	)
}
