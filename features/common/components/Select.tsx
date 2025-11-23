import React from "react"
import { View, Pressable, Text } from "react-native"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useThemeContext } from "../contexts/ThemeContext"
import { Choice, useModal } from "../contexts/ModalContext"

interface SelectProps {
	title: string
	choices: Choice[]
	onSelect: (selectedIndex: number) => void
}

export default function Select({ title, choices, onSelect }: SelectProps) {
	// Get values from context.
	const { openModal } = useModal()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	const expand = (select: string) => {
		openModal({
			type: "single_choice",
			title: `Change ${select}`,
			choices,
			description: "Select one of the options below.",
			onSubmit: (selectedIndex: number) => {
				onSelect(selectedIndex)
			},
		})
	}

	const selected = choices.find((c) => c.selected)?.label

	return (
		<View style={GlobalStyles.select}>
			<Text style={GlobalStyles.paragraph}>{title}</Text>
			<Pressable onPress={() => expand(title)} style={GlobalStyles.option}>
				<Text
					numberOfLines={1}
					ellipsizeMode='tail'
					style={[GlobalStyles.paragraph, { flexShrink: 1 }]}
				>
					{selected ? selected : "Select"}
				</Text>
				<MaterialC name='chevron-down' size={24} color={theme.colors.textPrimary} />
			</Pressable>
		</View>
	)
}
