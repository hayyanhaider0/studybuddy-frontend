import { Pressable, ScrollView, Text, View } from "react-native"
import { Color } from "../../../types/global"
import Swatch from "./Swatch"
import MiniCanvas from "../../common/components/MiniCanvas"
import { CanvasPattern, canvasPatterns } from "./CanvasBackground"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import HorizontalRule from "../../common/components/HorizontalRule"
import { useNotebookContext } from "../contexts/NotebookContext"
import { getCanvas } from "../../../utils/notebook"

export default function CanvasBackgroundModal({
	notebookId,
	chapterId,
	canvasId,
}: {
	notebookId: string
	chapterId: string
	canvasId: string
}) {
	const { notebookState, dispatch } = useNotebookContext()
	const { theme, GlobalStyles } = useThemeContext()

	// always get the latest canvas from state
	const canvas = getCanvas(notebookState.notebooks, notebookId, chapterId, canvasId)
	if (!canvas) return null

	const colors: Color[] = [
		theme.colors.primary as Color,
		"#E6E6E6", // Default (light)
		"#1A1A1A", // Default (dark)
		"#F7E9D7", // Warm Beige (light)
		"#FFF7CC", // Pastel Yellow (light)
		"#B8E1FF", // Sky Blue (light)
		"#E5D4EF", // Lavender (light)
		"#FFD8C2", // Peach (light)
		"#5A4630", // Warm Beige (dark)
		"#5C5225", // Pastel Yellow (dark)
		"#274861", // Sky Blue (dark)
		"#3E2F49", // Lavender (dark)
		"#714C3A", // Peach (dark)
	]

	const updateCanvas = (updates: Partial<typeof canvas>) => {
		dispatch({
			type: "UPDATE_CANVAS",
			payload: {
				notebookId,
				chapterId,
				id: canvasId,
				updates,
			},
		})
	}

	const selectedColor = canvas.color ?? null
	const selectedPattern = canvas.pattern ?? "solid"

	return (
		<ScrollView contentContainerStyle={{ alignItems: "center", gap: 16 }}>
			<Text style={GlobalStyles.paragraph}>Select a background color.</Text>

			<View
				style={{
					flexWrap: "wrap",
					flexDirection: "row",
					gap: 8,
					justifyContent: "center",
					width: 196,
				}}
			>
				{/* Default Swatch */}
				<Swatch
					color={colors[0]}
					selected={!selectedColor}
					onPress={() => updateCanvas({ color: null })}
					isDefault
				/>

				{/* Other Colors */}
				{colors.slice(1).map((c, i) => (
					<Swatch
						key={i}
						color={c}
						selected={c === selectedColor}
						onPress={() => updateCanvas({ color: c })}
					/>
				))}
			</View>

			<HorizontalRule width='100%' />

			<Text style={GlobalStyles.paragraph}>Select a background pattern.</Text>

			<View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
				{canvasPatterns.map((p) => {
					const isSelected = p === selectedPattern
					return (
						<Pressable
							key={p}
							onPress={() => updateCanvas({ pattern: p })}
							style={{ justifyContent: "center", alignItems: "center", width: 64, gap: 8 }}
						>
							<MiniCanvas
								notebookId={notebookId}
								chapterId={chapterId}
								canvasId={canvasId}
								pattern={p}
								width={64}
							/>
							<MaterialC
								name={isSelected ? "check-circle" : "checkbox-blank-circle-outline"}
								size={16}
								color={theme.colors.textPrimary}
								style={{ position: "absolute", top: 8, right: 8 }}
							/>
						</Pressable>
					)
				})}
			</View>
		</ScrollView>
	)
}
