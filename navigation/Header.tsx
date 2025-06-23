import { View, Pressable, Text, useWindowDimensions, Dimensions } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { getGlobalStyles } from "../styles/global"
import { useNavigation, useRoute } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "./DrawerNavigation"
import { useSort } from "../contexts/SortContext"
import { useRef, useState } from "react"
import { useContextMenu } from "../contexts/ContextMenuContext"
import { getSortOptions } from "../utils/contextMenuOptions"

type HeaderProps = {
	title: string
	sort?: boolean
	menu?: boolean
}

export default function Header({ title, sort, menu = true }: HeaderProps) {
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()
	const { sorts, toggleOrder } = useSort()
	const route = useRoute()
	const section = route.name as keyof typeof sorts

	const sortOptions = getSortOptions(section)

	const { theme, GlobalStyles } = useThemeContext()

	const { openMenu } = useContextMenu()

	const buttonRef = useRef<View>(null)

	const openSortMenu = () => {
		buttonRef.current?.measureInWindow((x, y) => {
			openMenu({
				options: sortOptions,
				position: { x, y },
				selectedOption: "Edit",
			})
		})
	}

	return (
		<View style={GlobalStyles.headerContainer}>
			<View style={GlobalStyles.headerItemsContainer}>
				<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
					{menu ? (
						<Pressable onPress={() => navigation.toggleDrawer()}>
							<MaterialC name='chevron-right' size={24} color={theme.colors.textPrimary} />
						</Pressable>
					) : (
						<Pressable onPress={() => navigation.goBack()}>
							<MaterialC name='chevron-left' size={24} color={theme.colors.textPrimary} />
						</Pressable>
					)}
					<Text style={GlobalStyles.subheading}>{title}</Text>
				</View>
				<View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
					{sort && (
						<>
							<Pressable ref={buttonRef} onPress={openSortMenu}>
								<MaterialC name='sort-variant' size={24} color={theme.colors.textPrimary} />
							</Pressable>
							<Pressable onPress={() => toggleOrder(section)}>
								<MaterialC
									name={sorts[section].ascending ? "sort-ascending" : "sort-descending"}
									size={24}
									color={theme.colors.textPrimary}
								/>
							</Pressable>
						</>
					)}

					<Pressable>
						<MaterialC name='dots-horizontal' size={24} color={theme.colors.textPrimary} />
					</Pressable>
				</View>
			</View>
		</View>
	)
}
