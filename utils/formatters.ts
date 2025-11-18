/**
 * formatters Util
 *
 * Holds formatting functions for Study Buddy.
 */

import { Occupation, EducationLevel } from "../features/auth/contexts/AuthContext"

export const occupationLabels: Record<Occupation, string> = {
	STUDENT: "Student",
	PROFESSOR: "Professor",
	INSTRUCTOR: "Instructor",
	EDUCATOR: "Educator",
	TEACHING_ASSISTANT: "Teaching Assistant",
	RESEARCHER: "Researcher",
	PARENT: "Parent",
	ALUMNI: "Alumni",
	PROFESSIONAL: "Professional",
	OTHER: "Other",
}

export const formatOccupation = (occ: Occupation | null) => {
	if (!occ) return "Unknown"
	return occupationLabels[occ] ?? "Unknown"
}

export const educationLevelLabels: Record<EducationLevel, string> = {
	HIGH_SCHOOL: "High School",
	UNDERGRAD_YEAR_ONE: "University 1st Year",
	UNDERGRAD_YEAR_TWO: "University 2nd Year",
	UNDERGRAD_YEAR_THREE: "University 3rd Year",
	UNDERGRAD_YEAR_FOUR: "University 4th Year",
	GRADUATE: "Graduate Student",
}

export const formatEducationLevel = (edu: EducationLevel | null) => {
	if (!edu) return "Unknown"
	return educationLevelLabels[edu] ?? "Unknown"
}

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
