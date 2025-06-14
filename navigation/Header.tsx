import { View, Pressable, Text, useWindowDimensions } from "react-native"
import { useThemeContext } from "../contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { getGlobalStyles } from "../styles/global"
import { useNavigation, useRoute } from "@react-navigation/native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { DrawerParamList } from "./DrawerNavigation"
import { useSort } from "../contexts/SortContext"
import { useRef } from "react"

export default function Header({ title, sort }: { title: string; sort?: boolean }) {
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()
	const { sorts, toggleSort, setSorts } = useSort()
	const route = useRoute()
	const section = route.name as keyof typeof sorts

	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	const buttonRef = useRef<View>(null)

	const sortOptions = [
		{ label: "Sort By Name", value: "name-asc", onPress: () => setSorts("notebooks", "name-asc") },
		{
			label: "Sort By Updated At",
			value: "updated-newest",
			onPress: () => setSorts("notebooks", "updated-newest"),
		},
		{
			label: "Sort By Created At",
			value: "created-newest",
			onPress: () => setSorts("notebooks", "created-newest"),
		},
	]

	return (
		<View style={GlobalStyles.headerContainer}>
			<View style={GlobalStyles.headerItemsContainer}>
				<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
					<Pressable onPress={() => navigation.toggleDrawer()}>
						<MaterialC name='chevron-right' size={24} color={theme.colors.textPrimary} />
					</Pressable>
					<Text style={GlobalStyles.heading}>{title}</Text>
				</View>
				<View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
					{sort && (
						<>
							<Pressable ref={buttonRef} onPress={() => toggleSort(section)}>
								<MaterialC name='sort' size={24} color={theme.colors.textPrimary} />
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
