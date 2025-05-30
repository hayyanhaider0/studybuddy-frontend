/**
 * LoginInput.tsx
 *
 * Contains the user input box, label, and logic for the login UI
 */

import { View, Text, TextInput } from "react-native"
import { Controller } from "react-hook-form"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getLoginStyles } from "../../styles/login"

/**
 * Sets the types of component props
 */
type LoginInputProps = {
	control: any
	name: string
	label: string
	placeholder: string
	secure?: boolean
	error?: any
	rules?: object
}

export default function LoginInput({
	control,
	name,
	rules,
	label,
	placeholder,
	secure,
	error,
}: LoginInputProps) {
	// Theming
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors)

	return (
		// The container around the input -- turns red upon error
		<View style={[styles.inputBox, error && { borderColor: "red" }]}>
			{/* Label -- tells the user what to input e.g. email, password, etc. */}
			<Text style={[GlobalStyles.paragraph, styles.label]}>{label}</Text>

			{/* Controller component, handles all logic */}
			<Controller
				control={control}
				name={name}
				rules={rules} // Rules for validation
				render={({ field: { value, onChange } }) => (
					<TextInput
						value={value}
						onChangeText={(text) => {
							if (/^\S*$/.test(text)) onChange(text)
						}}
						placeholder={placeholder}
						placeholderTextColor={theme.colors.placeholder}
						secureTextEntry={secure}
						style={[GlobalStyles.paragraph, styles.input]}
					/>
				)}
			/>
		</View>
	)
}
