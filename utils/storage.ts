/**
 * storage Util
 *
 * Contains helper function to store and get items from async storage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Saves the item in storage as a JSON.
 *
 * @param key - Key to store the item with.
 * @param value - Value of the item.
 */
export const storeJSON = async (key: string, value: string) => {
	try {
		await AsyncStorage.setItem(key, value)
	} catch (e) {
		console.error("Failed to set item", e)
	}
}

/**
 * Gets the stored JSON from storage.
 *
 * @param key - Key of the item in storage.
 * @param fallback - Used if the key doesn't exist.
 * @returns JSON stored with the key or fallback if key is not available.
 */
export const getStoredJSON = async <T = any>(key: string, fallback: T): Promise<T> => {
	try {
		const value = await AsyncStorage.getItem(key)
		return value ? JSON.parse(value) : fallback
	} catch (e) {
		console.error(`Failed to load key ${key}`, e)
		return fallback
	}
}
