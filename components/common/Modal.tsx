/**
 * Modal Component
 *
 * Uses the useModal() hook to generate a generic modal.
 */

import { View, Text, BackHandler } from "react-native"
import { useThemeContext } from "../../contexts/ThemeContext"
import { getGlobalStyles } from "../../styles/global"
import { Pressable, TextInput } from "react-native-gesture-handler"
import { ModalType, useModal } from "../../contexts/ModalContext"
import CustomPressable from "./CustomPressable"
import { AnimatePresence, MotiView } from "moti"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import Handle from "./Handle"
import MaterialC from "react-native-vector-icons/MaterialCommunityIcons"

export default function Modal() {
	const { showModal, input, setInput, modalData, closeModal, handleSubmit } = useModal()

	// Theming
	const { theme, GlobalStyles } = useThemeContext()

	// Close the menu on backpress.
	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				if (showModal) {
					closeModal()
					return true
				}
				return false
			}

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

			return () => subscription.remove()
		}, [showModal])
	)

	// Don't render if no modal data
	if (!modalData) return null

	return (
		<AnimatePresence>
			{showModal && (
				// Dim background behind the modal
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: "spring", damping: 18 }}
					style={GlobalStyles.dimBackground}
				>
					{/* Modal Container */}
					{modalData.type === ModalType.CHOICE ? (
						<MotiView
							from={{ translateY: 512 }}
							animate={{ translateY: 0 }}
							exit={{ translateY: 512 }}
							transition={{ type: "spring", damping: 18 }}
							style={GlobalStyles.choiceModalContainer}
						>
							{/* Modal components */}
							<Handle close={closeModal} />
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>
							<View style={GlobalStyles.modalChoices}>
								{modalData.choices?.map((m, i) => (
									<Pressable
										key={i}
										onPress={() => handleSubmit(i)}
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
										<MaterialC
											name={m.selected ? "radiobox-marked" : "radiobox-blank"}
											size={12}
											color={theme.colors.textPrimary}
										/>
										<Text style={[GlobalStyles.paragraph, { textAlign: "left" }]}>{m.label}</Text>
									</Pressable>
								))}
							</View>
						</MotiView>
					) : (
						<MotiView
							from={{ translateY: 256, opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: 128, opacity: 0 }}
							transition={{ type: "spring", damping: 18 }}
							style={GlobalStyles.modalContainer}
						>
							{/* Modal components */}
							<Text style={[GlobalStyles.paragraph, { fontWeight: "bold" }]}>
								{modalData.title}
							</Text>
							<Text style={[GlobalStyles.paragraph, { fontWeight: "400" }]}>
								{modalData.description}
							</Text>
							{modalData.type === ModalType.INPUT && (
								<TextInput
									value={input}
									onChangeText={setInput}
									placeholder={modalData.placeholder}
									placeholderTextColor={theme.colors.placeholder}
									style={GlobalStyles.input}
								/>
							)}
							<View
								style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}
							>
								{/* Close modal button */}
								<CustomPressable
									title='Close'
									onPress={closeModal}
									style={GlobalStyles.secondaryButton}
								/>
								{/* Confirm button */}
								<CustomPressable
									type={modalData.type === ModalType.CONFIRM ? "delete" : "primary"}
									title={modalData.buttonText || "ERROR LOL"}
									onPress={handleSubmit}
									style={GlobalStyles.button}
								/>
							</View>
						</MotiView>
					)}
				</MotiView>
			)}
		</AnimatePresence>
	)
}
