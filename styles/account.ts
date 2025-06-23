/**
 * account Styles
 *
 * Contains styles for the Account screen.
 */

import { StyleSheet } from "react-native"
import { ThemeColors } from "../types/global"

export const getAccountStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		detailViewContainer: {
			backgroundColor: colors.primary,
			paddingVertical: 16,
			paddingHorizontal: 24,
			marginBottom: 8,
			borderRadius: 32,
			gap: 8,
		},
	})
