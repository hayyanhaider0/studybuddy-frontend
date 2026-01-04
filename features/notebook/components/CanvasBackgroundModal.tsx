import { Pressable, ScrollView, Switch, Text, View } from "react-native"
import { Color } from "../../../types/global"
import Swatch from "./Swatch"
import MiniCanvas from "../../common/components/MiniCanvas"
import { CanvasPattern, canvasPatterns } from "./CanvasBackground"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import HorizontalRule from "../../common/components/HorizontalRule"
import { useNotebookContext } from "../contexts/NotebookContext"
import { getCanvas, getChapter } from "../../../utils/notebook"
import { useNotebookMutations } from "../hooks/useNotebookMutations"
import { CanvasUpdateRequest } from "../api/api"
import { useState } from "react"
import CustomPressable from "../../common/components/CustomPressable"
import { useModal } from "../../common/contexts/ModalContext"

type SelectionType = {
	color: Color | "default"
	pattern: CanvasPattern | null
	applyToAll: boolean
	colorChanged: boolean
	patternChanged: boolean
}

export default function CanvasBackgroundModal({
	notebookId,
	chapterId,
	canvasId,
}: {
	notebookId: string
	chapterId: string
	canvasId: string
}) {
	const [selection, setSelection] = useState<SelectionType>({
		color: null,
		pattern: null,
		applyToAll: false,
		colorChanged: false,
		patternChanged: false,
	})

	const { notebookState } = useNotebookContext()
	const { updateCanvasesServer } = useNotebookMutations()
	const { closeModal } = useModal()
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

	const updateCanvas = () => {
		const chapter = getChapter(notebookState.notebooks, notebookId, chapterId)

		if (!chapter) {
			console.log("[CanvasBackgroundModal/UPDATE_CANVAS] Error: No chapter found.")
			return
		}

		const changedColor = selection.color === "default" ? null : selection.color

		const req: CanvasUpdateRequest = {
			ids: selection.applyToAll
				? chapter.canvases.map((cv) => cv.id) // All canvases
				: [canvasId], // Just one canvas
			chapterId: canvas.chapterId,
			notebookId: canvas.notebookId,
			...(selection.colorChanged && { color: changedColor }),
			...(selection.patternChanged && { pattern: selection.pattern as CanvasPattern }),
		}

		updateCanvasesServer.mutate(req)
		closeModal()
	}

	const selectedColor = selection.color ?? canvas.color
	const selectedPattern = selection.pattern ?? canvas.pattern ?? "solid"

	return (
		<ScrollView contentContainerStyle={{ alignItems: "center", gap: 16 }}>
			{/* Confirm Selection */}
			<CustomPressable
				type='primary'
				title='Confirm'
				onPress={updateCanvas}
				style={{ width: "100%" }}
			/>

			<HorizontalRule width='100%' />

			<View style={{ flexDirection: "row", maxWidth: "100%", paddingHorizontal: 8 }}>
				<Text style={[GlobalStyles.paragraph, { flexShrink: 1, textAlign: "left" }]}>
					Apply to all canvases in this chapter?
				</Text>
				<Switch
					value={selection.applyToAll}
					onChange={() => setSelection((prev) => ({ ...prev, applyToAll: !prev.applyToAll }))}
				/>
			</View>

			<HorizontalRule width='100%' />

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
					width={30}
					selected={selectedColor === "default" || selectedColor === null}
					onPress={() =>
						setSelection((prev) => ({ ...prev, color: "default", colorChanged: true }))
					}
					isDefault
				/>

				{/* Other Colors */}
				{colors.slice(1).map((c, i) => (
					<Swatch
						key={i}
						color={c}
						width={30}
						selected={c === selectedColor}
						onPress={() => setSelection((prev) => ({ ...prev, color: c, colorChanged: true }))}
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
							onPress={() =>
								setSelection((prev) => ({ ...prev, pattern: p, patternChanged: true }))
							}
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
