/**
 * LoginInput.tsx
 *
 * Contains the user input box and label for the login UI
 */

import { View, Text, TextInput } from "react-native";
import { GlobalStyles } from "../../styles/global";
import { styles } from "../../styles/login";
import { Controller } from "react-hook-form";

/**
 * Sets the types of component props
 */
type LoginInputProps = {
	control: any;
	name: string;
	label: string;
	placeholder: string;
	secure?: boolean;
	error?: any;
	rules?: object;
};

export default function LoginInput({
	control,
	name,
	rules,
	label,
	placeholder,
	secure,
	error,
}: LoginInputProps) {
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
							if (/^\S*$/.test(text)) onChange(text);
						}}
						placeholder={placeholder}
						secureTextEntry={secure}
						style={[GlobalStyles.paragraph, styles.input]}
					/>
				)}
			/>
		</View>
	);
}
