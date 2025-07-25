import { EducationLevelType, OccupationType } from "../types/auth"

const occupationLabels: Record<OccupationType, string> = {
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

export const formatOccupation = (occ: OccupationType | null) => {
	if (!occ) return "Unknown"
	return occupationLabels[occ]
}

const educationLabels: Record<EducationLevelType, string> = {
	HIGH_SCHOOL: "High School",
	UNDERGRAD_YEAR_ONE: "University 1st Year",
	UNDERGRAD_YEAR_TWO: "University 2nd Year",
	UNDERGRAD_YEAR_THREE: "University 3rd Year",
	UNDERGRAD_YEAR_FOUR: "University 4th Year",
	GRADUATE: "Graduate Student",
}

export const formatEducation = (edu: EducationLevelType | null) => {
	if (!edu) return "Unknown"
	return educationLabels[edu]
}
