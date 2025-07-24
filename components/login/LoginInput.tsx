/**
 * LoginInput.tsx
 *
 * Contains the user input box, label, and logic for the login UI
 */

import { View, Text, TextInput, Pressable } from "react-native"
import { Controller } from "react-hook-form"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getLoginStyles } from "../../styles/login"
import { useState } from "react"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

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
	const [showPassword, setShowPassword] = useState(false)

	// Theming
	const { theme, fontScale, GlobalStyles } = useThemeContext()
	const styles = getLoginStyles(theme.colors, fontScale)

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
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TextInput
							value={value}
							onChangeText={(text) => {
								if (/^\S*$/.test(text)) onChange(text)
							}}
							placeholder={placeholder}
							placeholderTextColor={theme.colors.placeholder}
							secureTextEntry={secure && !showPassword}
							autoCapitalize='none'
							style={[GlobalStyles.paragraph, styles.input, { flex: 1 }]}
						/>
						{secure && (
							<Pressable onPress={() => setShowPassword((prev) => !prev)}>
								<MaterialC
									name={showPassword ? "eye-off-outline" : "eye-outline"}
									size={20}
									color={theme.colors.textSecondary}
								/>
							</Pressable>
						)}
					</View>
				)}
			/>
		</View>
	)
}
