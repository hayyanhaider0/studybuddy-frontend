/**
 * LoginInput.tsx
 *
 * Contains the user input box and label for the login UI
 */

import { View, Text, TextInput } from "react-native"
import { Controller } from "react-hook-form"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
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
	const { theme, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors)

	return (
		<View style={[styles.inputBox, error && { borderColor: "red" }]}>
			<Text style={[GlobalStyles.paragraph, styles.label]}>{label}</Text>

			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({ field: { value, onChange } }) => (
					<TextInput
						value={value}
						onChangeText={(text) => {
							if (/^\S*$/.test(text)) onChange(text)
						}}
						placeholder={placeholder}
						secureTextEntry={secure}
						style={[GlobalStyles.paragraph, styles.input]}
					/>
				)}
			/>
		</View>
	)
}
