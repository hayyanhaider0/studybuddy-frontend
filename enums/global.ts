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

export enum Occupation {
	STUDENT = "STUDENT",
	PROFESSOR = "PROFESSOR",
	INSTRUCTOR = "INSTRUCTOR",
	EDUCATOR = "EDUCATOR",
	TEACHING_ASSISTANT = "TEACHING_ASSISTANT",
	RESEARCHER = "RESEARCHER",
	PARENT = "PARENT",
	ALUMNI = "ALUMNI",
	PROFESSIONAL = "PROFESSIONAL",
	OTHER = "OTHER",
}

export enum EducationLevel {
	HIGH_SCHOOL = "HIGH_SCHOOL",
	UNDERGRAD_YEAR_ONE = "UNDERGRAD_YEAR_ONE",
	UNDERGRAD_YEAR_TWO = "UNDERGRAD_YEAR_TWO",
	UNDERGRAD_YEAR_THREE = "UNDERGRAD_YEAR_THREE",
	UNDERGRAD_YEAR_FOUR = "UNDERGRAD_YEAR_FOUR",
	GRADUATE = "GRADUATE",
}

// Brush type enum
export enum BrushType {
	PEN = "pen",
	PENCIL = "pencil",
	HIGHLIGHTER = "highlighter",
	ERASER = "eraser",
	TEXT = "text",
	POINTER = "pointer",
}
