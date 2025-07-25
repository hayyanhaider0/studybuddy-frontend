// Auth
export type LoginRequest = {
	login: string
	password: string
}

export type SignUpRequest = {
	email: string
	username: string
	password: string
	confirmPassword: string
}

// Other types
export type OccupationType =
	| "STUDENT"
	| "PROFESSOR"
	| "INSTRUCTOR"
	| "EDUCATOR"
	| "TEACHING_ASSISTANT"
	| "RESEARCHER"
	| "PARENT"
	| "ALUMNI"
	| "PROFESSIONAL"
	| "OTHER"

export type EducationLevelType =
	| "HIGH_SCHOOL"
	| "UNDERGRAD_YEAR_ONE"
	| "UNDERGRAD_YEAR_TWO"
	| "UNDERGRAD_YEAR_THREE"
	| "UNDERGRAD_YEAR_FOUR"
	| "GRADUATE"
