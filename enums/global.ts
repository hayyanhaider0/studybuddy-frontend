/**
 * global Enums
 *
 * Holds enumerations for Study Buddy.
 */

// Theming
export enum FontScale {
	SMALL = 1,
	MEDIUM = 1.1,
	LARGE = 1.2,
	XLARGE = 1.3,
}

export enum ThemeName {
	LIGHT = "light",
	DARK = "dark",
}

export type ThemeNameWithSystem = ThemeName | "SYSTEM"

// User preferences
export enum Role {
	USER = "user",
	ADMIN = "admin",
}
