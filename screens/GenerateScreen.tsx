/**
 * GenerateScreen Component
 *
 * Generic screen used for LLM features (notes, flashcards, quizzes, exams).
 */

import { Text, View } from "react-native"
import CustomScrollView from "../features/common/components/CustomScrollView"
import { useThemeContext } from "../features/common/contexts/ThemeContext"
import ChapterSelector from "../features/llm/components/ChapterSelector"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/Navigation"
import { capitalize } from "../utils/formatters"
import CustomPressable from "../features/common/components/CustomPressable"
import { useLLMContext } from "../features/llm/contexts/LLMContext"
import { llmSettingsGroup } from "../utils/llmOptions"
import LLMSetting from "../features/llm/components/LLMSetting"
import { useAuthContext } from "../features/auth/contexts/AuthContext"
import { generate, NotesRequest } from "../features/llm/api/api"
import { useNotebookContext } from "../features/notebook/contexts/NotebookContext"
import { getChapter, getNotebook } from "../utils/notebook"
import { useEffect } from "react"
import { Canvas } from "../types/notebook"
import { Skia } from "@shopify/react-native-skia"
import { toSkiaPath } from "../features/drawing/processors/PathProcessor"

export default function GenerateScreen() {
	// Get values from context.
	const { authState } = useAuthContext()
	const { settings, selectedChapters, setSelectedChapters } = useLLMContext()
	const { notebookState } = useNotebookContext()

	// Get values from route.
	const route = useRoute<RouteProp<RootStackParamList, "generate">>()
	const taskType = route.params?.taskType // Selected task type i.e. notes, flashcards, quiz, exam.
	const notebookId = route.params?.notebookId // Selected notebook's ID.
	const notebook = getNotebook(notebookState.notebooks, notebookId) // Get notebook from ID.

	// Theming
	const { GlobalStyles } = useThemeContext()

	/**
	 * Creates a JSON to send to the backend.
	 * @returns A JSON for information to send to the OCR and LLM.
	 */
	const handleGenerate = () => {
		// Get the chapters with their canvases in base64.
		const chaptersWithCanvases = selectedChapters
			.map((chapterId) => {
				const chapter = getChapter(notebookState.notebooks, notebookId, chapterId)
				if (!chapter) return null // Skip if chapter doesn't exist.

				// Canvases within the chapter.
				const canvases = chapter.canvases
					.map((cv) => {
						// If no paths in the canvas, skip it.
						// Text and other canvas items will be added.
						if (cv.paths.length === 0) return null
						// Return the canvas in base64.
						return renderCanvasToBase64(cv, 360, 640)
					})
					// Filter null canvases.
					.filter((canvas): canvas is string => canvas !== null)

				// Skip chapters with no valid canvases.
				if (canvases.length === 0) return null

				return { chapterName: chapter.title, canvases }
			})
			// Filter null chapters.
			.filter((chapter): chapter is { chapterName: string; canvases: string[] } => chapter !== null)

		// Don't call API if there are no chapters.
		if (chaptersWithCanvases.length === 0) return

		// Create a request.
		const req: NotesRequest = {
			taskType,
			occupation: authState.occupation,
			educationLevel: authState.educationLevel,
			notebookName: notebook?.title!,
			chaptersWithCanvases,
			options: getFlatJSON(),
		}

		// Empty selected chapters.
		setSelectedChapters([])

		// Generate.
		generate(req)
	}

	/**
	 * Takes a canvas and renders a base64 encoded image to send to the backend for OCR.
	 *
	 * @param canvas - The canvas to render.
	 * @param width - Width of the image.
	 * @param height - Height of the image.
	 * @returns A base64 image of the canvas.
	 */
	const renderCanvasToBase64 = (
		canvas: Canvas,
		width: number,
		height: number
	): string | undefined => {
		// Create a Skia off screen surface.
		const skCanvas = Skia.Surface.MakeOffscreen(width, height)
		if (!skCanvas) return

		// Convert paths to Skia paths.
		canvas.paths.forEach((path) => {
			const skPath = toSkiaPath(path.points, path.brush, width, height)
			const skPaint = Skia.Paint()
			skPaint.setColor(Skia.Color(path.brush.color))
			skCanvas.getCanvas().drawPath(skPath!, skPaint)
		})

		// Take snapshot.
		const image = skCanvas.makeImageSnapshot()

		// Return encoded base64 image.
		return image.encodeToBase64()
	}

	/**
	 * Creates a flat JSON for options selected by the user.
	 * @returns A flat JSON for options.
	 */
	const getFlatJSON = () => {
		// Get settings group.
		const group = settings.find((g) => g.type === taskType)
		if (!group) return {}

		// Initialize output.
		const output: Record<string, string | boolean> = {}

		// Get selected values for each option and key it to the option label.
		group.sections.forEach((section) => {
			section.options.forEach((opt) => {
				output[opt.label] = opt.selectedValue
			})
		})

		return output
	}

	useEffect(() => {
		// Nothing on mount
		return () => {
			// Reset when leaving the screen
			setSelectedChapters([])
		}
	}, [])

	return (
		<View style={[GlobalStyles.container, { padding: 16 }]}>
			<CustomScrollView contentStyle={{ gap: 8 }}>
				<View style={{ gap: 16 }}>
					{/* Title for generating */}
					<Text style={GlobalStyles.subheading}>
						Generate {capitalize(taskType)} for '{notebook?.title}'
					</Text>

					{/* Button to generate */}
					<CustomPressable type='primary' title='Generate' onPress={() => handleGenerate()} />

					{/* Chapter Selection */}
					<Text style={GlobalStyles.paragraph}>Select chapters to generate {taskType} for.</Text>
					<ChapterSelector />
				</View>

				{/* LLM Settings */}
				{settings
					.filter((g: llmSettingsGroup) => g.type === taskType)
					.map((group: llmSettingsGroup, i) => (
						<LLMSetting key={i} type={group.type} sections={group.sections} />
					))}
			</CustomScrollView>
		</View>
	)
}
