/**
 * Modal Component
 *
 * Uses the useModal() hook to generate a generic modal.
 */

import { useFocusEffect } from "@react-navigation/native"
import { AnimatePresence, MotiView } from "moti"
import { useCallback, useState } from "react"
import { BackHandler, View, Text, Pressable, TextInput } from "react-native"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"
import { useModal } from "../contexts/ModalContext"
import { useThemeContext } from "../contexts/ThemeContext"
import CustomPressable from "./CustomPressable"
import Handle from "./Handle"
import { ScrollView } from "react-native-gesture-handler"

export default function Modal() {
	const { isVisible, modalData, closeModal, handleSubmit } = useModal()
	const [input, setInput] = useState<string>("")

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	// Close the modal on backpress.
	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				if (isVisible) {
					closeModal()
					return true
				}
				return false
			}

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

			return () => subscription.remove()
		}, [isVisible])
	)

	// Don't render if no modal data
	if (!modalData) return null

	// Input modal
	if (modalData.type === "input") {
		return (
			<AnimatePresence>
				{isVisible && (
					// Dim background behind the modal
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "timing", duration: 128 }}
						style={GlobalStyles.dimBackground}
					>
						<MotiView
							from={{ translateY: 256, opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: 128, opacity: 0 }}
							transition={{ type: "spring", duration: 128 }}
							style={GlobalStyles.modalContainer}
						>
							{/* Title */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>
							{/* Description */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>
							{/* Input */}
							<TextInput
								value={input}
								onChangeText={setInput}
								placeholder={modalData.placeholder}
								placeholderTextColor={theme.colors.placeholder}
								style={GlobalStyles.input}
							/>
							{/* Close and Submit buttons */}
							<View
								style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}
							>
								{/* Close modal button */}
								<CustomPressable type='secondary' title='Close' onPress={closeModal} />
								{/* Confirm button */}
								<CustomPressable
									type='primary'
									title={modalData.buttonText || "ERROR LOL"}
									onPress={() => {
										modalData.onSubmit(input)
										setInput("")
										closeModal()
									}}
								/>
							</View>
						</MotiView>
					</MotiView>
				)}
			</AnimatePresence>
		)
	}

	// Confirmation modal
	if (modalData.type === "confirm") {
		return (
			<AnimatePresence>
				{isVisible && (
					// Dim background behind the modal
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "timing", duration: 128 }}
						style={GlobalStyles.dimBackground}
					>
						<MotiView
							from={{ translateY: 256, opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: 128, opacity: 0 }}
							transition={{ type: "spring", duration: 128 }}
							style={GlobalStyles.modalContainer}
						>
							{/* Title */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>
							{/* Description */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>
							{/* Close and Submit buttons */}
							<View
								style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}
							>
								{/* Close modal button */}
								<CustomPressable type='secondary' title='Close' onPress={closeModal} />
								{/* Submit button */}
								<CustomPressable
									type={"delete"}
									title={modalData.buttonText || "ERROR LOL"}
									onPress={() => handleSubmit()}
								/>
							</View>
						</MotiView>
					</MotiView>
				)}
			</AnimatePresence>
		)
	}

	// Single Choice Modal
	if (modalData.type === "single_choice") {
		return (
			<AnimatePresence>
				{isVisible && (
					// Dim background behind the modal
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "timing", duration: 128 }}
						style={GlobalStyles.dimBackground}
					>
						<MotiView
							from={{ translateY: 256, opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: 128, opacity: 0 }}
							transition={{ type: "spring", duration: 128 }}
							style={GlobalStyles.choiceModalContainer}
						>
							<Handle close={closeModal} />
							{/* Title */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>

							{/* Description */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>

							{/* Scrollable Choice List */}
							<ScrollView style={GlobalStyles.modalChoices}>
								{modalData.choices?.map((m, i) => (
									// Choices mapped
									<Pressable
										key={i}
										style={({ pressed }) => [
											{
												flexDirection: "row",
												width: "100%",
												padding: 12,
												backgroundColor: m.selected ? theme.colors.secondary : theme.colors.primary,
												alignItems: "center",
												gap: 8,
											},
											pressed && { opacity: 0.8 },
										]}
									>
										{/* Radio Icon */}
										<MaterialC
											name={m.selected ? "radiobox-marked" : "radiobox-blank"}
											size={12}
											color={theme.colors.textPrimary}
										/>

										{/* Label */}
										<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{m.label}</Text>
									</Pressable>
								))}
							</ScrollView>
						</MotiView>
					</MotiView>
				)}
			</AnimatePresence>
		)
	}

	// Multiple Choice Modal
	if (modalData.type === "multiple_choice") {
		return (
			<AnimatePresence>
				{isVisible && (
					// Dim background behind the modal
					<MotiView
						from={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "timing", duration: 128 }}
						style={GlobalStyles.dimBackground}
					>
						<MotiView
							from={{ translateY: 256, opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: 128, opacity: 0 }}
							transition={{ type: "spring", duration: 128 }}
							style={GlobalStyles.choiceModalContainer}
						>
							<Handle close={closeModal} />
							{/* Title */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>

							{/* Description */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>

							{/* Scrollable Choice List */}
							<ScrollView style={GlobalStyles.modalChoices}>
								{/* Choices */}
								{modalData.choices?.map((m, i) => (
									<Pressable
										key={i}
										style={({ pressed }) => [
											{
												flexDirection: "row",
												width: "100%",
												padding: 12,
												backgroundColor: modalData.selectedIndices?.includes(i)
													? theme.colors.secondary
													: theme.colors.primary,
												alignItems: "center",
												gap: 8,
											},
											pressed && { opacity: 0.8 },
										]}
									>
										{/* Radio Icon */}
										<MaterialC
											name={
												modalData.selectedIndices?.includes(i)
													? "radiobox-marked"
													: "radiobox-blank"
											}
											size={12}
											color={theme.colors.textPrimary}
										/>

										{/* Label */}
										<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{m.label}</Text>
									</Pressable>
								))}
							</ScrollView>

							{/* Submit Button */}
							<CustomPressable type='primary' title='Confirm' onPress={() => handleSubmit()} />
						</MotiView>
					</MotiView>
				)}
			</AnimatePresence>
		)
	}
}
