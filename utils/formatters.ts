/**
 * formatters Util
 *
 * Holds formatting functions for Study Buddy.
 */

import { Occupation, EducationLevel } from "../enums/global"

export const occupationLabels: Record<Occupation, string> = {
	[Occupation.STUDENT]: "Student",
	[Occupation.PROFESSOR]: "Professor",
	[Occupation.INSTRUCTOR]: "Instructor",
	[Occupation.EDUCATOR]: "Educator",
	[Occupation.TEACHING_ASSISTANT]: "Teaching Assistant",
	[Occupation.RESEARCHER]: "Researcher",
	[Occupation.PARENT]: "Parent",
	[Occupation.ALUMNI]: "Alumni",
	[Occupation.PROFESSIONAL]: "Professional",
	[Occupation.OTHER]: "Other",
}

export const formatOccupation = (occ: Occupation | null | undefined) => {
	if (!occ) return "Unknown"
	return occupationLabels[occ] ?? "Unknown"
}

export const educationLevelLabels: Record<EducationLevel, string> = {
	[EducationLevel.HIGH_SCHOOL]: "High School",
	[EducationLevel.UNDERGRAD_YEAR_ONE]: "University 1st Year",
	[EducationLevel.UNDERGRAD_YEAR_TWO]: "University 2nd Year",
	[EducationLevel.UNDERGRAD_YEAR_THREE]: "University 3rd Year",
	[EducationLevel.UNDERGRAD_YEAR_FOUR]: "University 4th Year",
	[EducationLevel.GRADUATE]: "Graduate Student",
}

export const formatEducationLevel = (edu: EducationLevel | null | undefined) => {
	if (!edu) return "Unknown"
	return educationLevelLabels[edu] ?? "Unknown"
}

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
