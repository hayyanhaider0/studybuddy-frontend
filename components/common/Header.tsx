import React, { ReactNode } from "react"
import { View, Pressable, Text } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { getGlobalStyles } from "../../styles/global"
import { useNavigation } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "../../navigation/DrawerNavigation"

export default function Header({ title, sort }: { title: string; sort?: () => void }) {
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()
	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	return (
		<View
			style={{
				backgroundColor: theme.colors.primary,
				paddingTop: 48,
				paddingBottom: 16,
				paddingHorizontal: 16,
				borderBottomColor: theme.colors.textPrimary,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					gap: 16,
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
					<Pressable onPress={() => navigation.toggleDrawer()}>
						<MaterialC name='chevron-right' size={24} color={theme.colors.textPrimary} />
					</Pressable>
					<Text style={GlobalStyles.heading}>{title}</Text>
				</View>
				<View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
					{sort && (
						<Pressable onPress={sort}>
							<MaterialC name='sort' size={24} color={theme.colors.textPrimary} />
						</Pressable>
					)}

					<Pressable>
						<MaterialC name='dots-horizontal' size={24} color={theme.colors.textPrimary} />
					</Pressable>
				</View>
			</View>
		</View>
	)
}
