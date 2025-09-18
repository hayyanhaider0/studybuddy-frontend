/**
 * SecureStore Util
 *
 * Contains helper functions related to safe storage of secret tokens.
 */

import * as SecureStore from "expo-secure-store"

export async function saveToken(token: string) {
	await SecureStore.setItemAsync("studybuddy-token", token, {
		keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
	})
}

export async function saveRefreshToken(token: string) {
	await SecureStore.setItemAsync("studybuddy-refreshToken", token, {
		keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
	})
}

export async function getToken(): Promise<string | null> {
	return await SecureStore.getItemAsync("studybuddy-token")
}

export async function getRefreshToken(): Promise<string | null> {
	return await SecureStore.getItemAsync("studybuddy-refreshToken")
}

export async function removeToken() {
	await SecureStore.deleteItemAsync("studybuddy-token")
}

export async function removeRefreshToken() {
	await SecureStore.deleteItemAsync("studybuddy-refreshToken")
}
