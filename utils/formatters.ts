/**
 * formatters Util
 *
 * Holds formatting functions for Study Buddy.
 */

import { Occupation, EducationLevel } from "../features/auth/contexts/AuthContext"
import { CanvasPattern } from "../features/notebook/components/CanvasBackground"

export const occupationLabels: Record<Occupation, string> = {
	STUDENT: "Student",
	TEACHER: "Teacher / Professor",
	INSTRUCTOR: "Instructor / Coach / Mentor",
	RESEARCHER: "Researcher / Scientist",
	PARENT_CAREGIVER: "Parent / Caregiver",
	PROFESSIONAL: "Professional / Worker",
	UNEMPLOYED: "Unemployed / Seeking work",
	RETIRED: "Retired",
	OTHER: "Other",
	NA: "Prefer not to say",
}

export const formatOccupation = (occ: Occupation | null) => {
	if (!occ) return "Unknown"
	return occupationLabels[occ] ?? "Unknown"
}

export const educationLevelLabels: Record<EducationLevel, string> = {
	NONE: "No formal education",
	PRIMARY: "Primary / Elementary School",
	MIDDLE: "Middle School",
	HIGH_SCHOOL: "High School",
	VOCATIONAL: "Vocational / Technical Training",
	UNDERGRAD: "Undergraduate / College",
	GRADUATE: "Graduate / Master’s",
	POSTGRAD: "Postgraduate / PhD",
	OTHER: "Other",
	NA: "Prefer not to say",
}

export const formatEducationLevel = (edu: EducationLevel | null) => {
	if (!edu) return "Unknown"
	return educationLevelLabels[edu] ?? "Unknown"
}

export const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
