import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type RootStackParamList = {
	login: undefined
	canvas: undefined
}

export type NavProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<
	RootStackParamList,
	Screen
>
