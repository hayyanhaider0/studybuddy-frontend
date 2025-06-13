import { Pressable, Text, View } from "react-native"
import { useNotebookContext } from "../contexts/NotebookContext"
import { getGlobalStyles } from "../styles/global"
import { useThemeContext } from "../contexts/ThemeContext"
import useNotebookActions from "../hooks/useNotebookActions"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { formatDate, timeAgo } from "../utils/date"
import { ScrollView } from "react-native-gesture-handler"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { DrawerParamList } from "../navigation/DrawerNavigation"

export default function NotebooksScreen() {
	const { handleCreateNotebook } = useNotebookActions()
	const { notebooks } = useNotebookContext()

	const { theme } = useThemeContext()
	const GlobalStyles = getGlobalStyles(theme.colors)

	// Navigation for the sidebar menu.
	const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>()

	return (
		<ScrollView style={GlobalStyles.container}>
			<View
				style={{
					paddingTop: 72,
					paddingBottom: 36,
					marginHorizontal: 36,
					borderBottomWidth: 1,
					borderBottomColor: theme.colors.textPrimary,
					flexDirection: "row",
					alignItems: "center",
					gap: 16,
				}}
			>
				<Pressable onPress={() => navigation.toggleDrawer()}>
					<MaterialC name='chevron-right' size={24} color={theme.colors.textPrimary} />
				</Pressable>
				<Text style={GlobalStyles.heading}>Notebooks</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					padding: 32,
					gap: 16,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{notebooks.map((n) => (
					<View key={n.id} style={{ width: "28%", justifyContent: "center", alignItems: "center" }}>
						<View style={{ width: "100%", height: 96, backgroundColor: theme.colors.secondary }} />
						<Text
							style={[GlobalStyles.paragraph, { paddingVertical: 4 }]}
							ellipsizeMode='middle'
							numberOfLines={1}
						>
							{n.title}
						</Text>
						<Text style={GlobalStyles.subtext}>{`Updated ${timeAgo(n.updatedAt)}`}</Text>
						<Text style={GlobalStyles.subtext}>{`Created ${formatDate(n.createdAt)}`}</Text>
					</View>
				))}
				<Pressable
					onPress={handleCreateNotebook}
					style={{
						width: "28%",
						height: 96,
						backgroundColor: theme.colors.secondary,
						alignSelf: "flex-start",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 8,
					}}
				>
					<MaterialC name='plus-circle-outline' size={36} color={theme.colors.textPrimary} />
					<Text style={[GlobalStyles.subtext, { paddingTop: 4 }]}>Add New Notebook</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}
