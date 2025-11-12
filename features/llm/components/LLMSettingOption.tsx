/**
 * LLMSettingOption Component
 *
 * Renders a single option inside an LLM section.
 * Supports string dropdowns and boolean switches.
 */

import { View, Text, Pressable } from "react-native"
import { useState } from "react"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { Switch } from "react-native-gesture-handler"
import { useThemeContext } from "../../common/contexts/ThemeContext"
import { useModal } from "../../common/contexts/ModalContext"
import { llmOption } from "../../../utils/llmOptions"

interface LLMSettingOptionProps {
	settingTitle: string
	option: llmOption
	onChange: (value: string | boolean) => void
}

export default function LLMSettingOption({ option, onChange }: LLMSettingOptionProps) {
	const { theme, GlobalStyles } = useThemeContext()
	const { openModal } = useModal()

	// Local value state
	const [value, setValue] = useState<string | boolean>(option.selectedValue)

	const handleValueChange = (newValue: string | boolean) => {
		setValue(newValue)
		onChange(newValue)
	}

	// Handle dropdown for string options
	const handleStringOption = (values: string[]) => {
		openModal({
			type: "single_choice",
			title: `Change ${option.label}`,
			description: "Choose one of the following options:",
			choices: values.map((v) => ({ label: v, selected: v === value })),
			onSubmit: (selectedIndex) => handleValueChange(values[selectedIndex]),
		})
	}

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<Text style={GlobalStyles.paragraph}>{option.label}</Text>

			{typeof value === "string" ? (
				<Pressable
					onPress={() => handleStringOption(option.values ?? [])}
					style={{
						flexDirection: "row",
						alignItems: "center",
						borderWidth: 1,
						borderColor: theme.colors.tertiary,
						borderRadius: 50,
						paddingVertical: 8,
						paddingHorizontal: 16,
						gap: 4,
					}}
				>
					<Text style={GlobalStyles.paragraph}>{value}</Text>
					<MaterialC name='menu-down' size={16} color={theme.colors.textPrimary} />
				</Pressable>
			) : (
				<Switch value={!!value} onValueChange={(newVal) => handleValueChange(newVal)} />
			)}
		</View>
	)
}
