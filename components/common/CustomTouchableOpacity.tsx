import { TouchableOpacity, Text } from "react-native";
import { GlobalStyles } from "../../styles/global";

type ctoProps = {
	text: string;
	onPress: () => void;
};

export default function CustomTouchableOpacity({ text, onPress }: ctoProps) {
	return (
		<TouchableOpacity style={GlobalStyles.button} onPress={onPress}>
			<Text style={GlobalStyles.buttonText}>{text}</Text>
		</TouchableOpacity>
	);
}
