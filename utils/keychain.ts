/**
 * Keychain Util
 *
 * Contains helper functions related to safe storage of secret tokens.
 */

import * as Keychain from "react-native-keychain"

export async function saveToken(token: string) {
	await Keychain.setGenericPassword("auth", token, {
		service: "studybuddy-token",
		accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
	})
}

export async function saveRefreshToken(token: string) {
	await Keychain.setGenericPassword("auth", token, {
		service: "studybuddy-refreshToken",
		accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
	})
}

export async function getToken(): Promise<string | null> {
	const creds = await Keychain.getGenericPassword({ service: "studybuddy-token" })
	return creds ? creds.password : null
}

export async function getRefreshToken(): Promise<string | null> {
	const creds = await Keychain.getGenericPassword({ service: "studybuddy-refreshToken" })
	return creds ? creds.password : null
}

export async function removeToken() {
	await Keychain.resetGenericPassword({ service: "studybuddy-token" })
}

export async function removeRefreshToken() {
	await Keychain.resetGenericPassword({ service: "studybuddy-refreshToken" })
}
