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
import { useNotebookMutations } from "../hooks/useNotebookMutations"
import { Canvas } from "../../../types/notebook"
import { CanvasUpdateRequest } from "../api/api"

export default function CanvasBackgroundModal({
	notebookId,
	chapterId,
	canvasId,
}: {
	notebookId: string
	chapterId: string
	canvasId: string
}) {
	const { notebookState } = useNotebookContext()
	const { updateCanvasServer } = useNotebookMutations()
	const { theme, GlobalStyles } = useThemeContext()

	// Always get the latest canvas from state
	const canvas = getCanvas(notebookState.notebooks, notebookId, chapterId, canvasId)
	if (!canvas) return null

	const colors: Color[] = [
		theme.colors.primary as Color,
		"#E6E6E6", // Default (light)
		"#1A1A1A", // Default (dark)

		// Light colors
		"#FFE4D6", // Coral Blush (Red/Orange)
		"#FFF9F0", // Soft Cream (Orange)
		"#FFF4E6", // Warm Sand (Yellow)
		"#F1F8F4", // Sage Green (Green)
		"#E3F2FD", // Powder Blue (Blue)
		"#E8EAF6", // Periwinkle (Indigo)
		"#F3E5F5", // Lavender Mist (Violet)

		// Dark colors
		"#5C4239", // Coral Blush (dark)
		"#4A3F35", // Soft Cream (dark)
		"#5A4A3C", // Warm Sand (dark)
		"#3A4D42", // Sage Green (dark)
		"#2C4A5E", // Powder Blue (dark)
		"#3A3D52", // Periwinkle (dark)
		"#4A3A52", // Lavender Mist (dark)
	]

	const updateCanvas = (updates: Partial<Canvas>) => {
		const req: CanvasUpdateRequest = {
			id: canvasId,
			chapterId: canvas.chapterId,
			notebookId: canvas.notebookId,
			...(updates.color !== undefined && { color: updates.color as Color }),
			...(updates.pattern !== undefined && { pattern: updates.pattern as CanvasPattern }),
			order: -1,
		}
		updateCanvasServer.mutate({ id: canvas.id, req })
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
