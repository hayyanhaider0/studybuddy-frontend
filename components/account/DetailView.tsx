/**
 * DetailView Component
 *
 * A box that shows details about the user in the AccountScreen.
 */

import { View, Pressable, Text, StyleProp, ViewStyle } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { ReactNode } from "react"
import { getAccountStyles } from "../../styles/account"

// Base props for all DetailView.
type BaseProps = {
	header: string
	onPress: () => void
	children?: ReactNode
	style?: StyleProp<ViewStyle>
}

// Hinted props for the View that has some editable information.
type HintedProps = BaseProps & {
	variant: "hinted"
	hintText: string
	hintIcon: string
}

// Plain props for the View that only shows information via a tooltip.
type PlainProps = BaseProps & {
	variant?: "plain"
}

// Props for this component.
type DetailViewProps = HintedProps | PlainProps

export default function DetailView(props: DetailViewProps) {
	// Deconstruct the props.
	const { header, onPress, children, style } = props

	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getAccountStyles(theme.colors)

	return (
		// Main DetailView box.
		<View style={styles.detailViewContainer}>
			{/* Header and pressable hint (if any, else shows information icon with tooltip) */}
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text style={[GlobalStyles.subtext, { textAlign: "left" }]}>{header}</Text>
				<Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }} onPress={onPress}>
					{props.variant === "hinted" && (
						<Text style={[GlobalStyles.subtext, { textAlign: "left" }]}>{props.hintText}</Text>
					)}
					<MaterialC
						name={(props.variant === "hinted" && props.hintIcon) || "information-outline"}
						size={16}
						color={theme.colors.textSecondary}
					/>
				</Pressable>
			</View>

			{/* Information within the box */}
			{children && (
				<View
					style={[
						{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
						},
						style,
					]}
				>
					{children}
				</View>
			)}
		</View>
	)
}
