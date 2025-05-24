import { TouchableOpacity, View } from "react-native"
import { useToolContext } from "../../contexts/ToolContext"
import { styles } from "../../styles/canvas"
import { FlatList } from "react-native"

export default function ColorOptions() {
	const { setStroke } = useToolContext()

	const colors = [
		// Grays
		"#1e1e1e",
		"#4a4a4a",
		"#888888",
		"#d1d1d1",
		"#f5f5f5",

		// Red
		"#7f1d1d",
		"#b91c1c",
		"#dc2626",
		"#f87171",
		"#fecaca",

		// Orange
		"#7c2d12",
		"#ea580c",
		"#fb923c",
		"#fdba74",
		"#ffedd5",

		// Yellow
		"#854d0e",
		"#ca8a04",
		"#eab308",
		"#facc15",
		"#fef08a",

		// Green
		"#064e3b",
		"#047857",
		"#10b981",
		"#34d399",
		"#bbf7d0",

		// Blue
		"#1e3a8a",
		"#2563eb",
		"#3b82f6",
		"#60a5fa",
		"#bfdbfe",

		// Indigo
		"#312e81",
		"#4338ca",
		"#6366f1",
		"#818cf8",
		"#e0e7ff",

		// Violet (Purple)
		"#581c87",
		"#7e22ce",
		"#a855f7",
		"#c084fc",
		"#e9d5ff",
	]

	return (
		<FlatList
			data={colors}
			keyExtractor={(i: string) => i}
			renderItem={({ item }) => (
				<TouchableOpacity onPress={() => setStroke(item)} activeOpacity={0.5}>
					<View style={[styles.options, { backgroundColor: item }]} />
				</TouchableOpacity>
			)}
			horizontal
			contentContainerStyle={{ gap: 8 }}
			showsHorizontalScrollIndicator={false}
		/>
	)
}
