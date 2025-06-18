/**
 * SortContext
 *
 * Provides shared values for sorting methods.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { SortMap, SortState, SortType } from "../types/global"

type SortContextType = {
	// Current sort type.
	sorts: SortMap
	// Set the sort for a section.
	setSorts: (section: keyof SortMap, type: SortType, ascending: boolean) => void
	// Toggle ascending or descending order.
	toggleOrder: (section: keyof SortMap) => void
}

// Default sorting state to be updated newest.
const defaultSortState: SortState = { type: "updated", ascending: true }

// All the different sortable sections
const sectionKeys: (keyof SortMap)[] = ["notebooks", "aiNotes", "flashcards", "quizzes", "exams"]

const initialSortMap = Object.fromEntries(
	sectionKeys.map((key) => [key, defaultSortState])
) as SortMap

// React context for sorting.
export const SortContext = createContext<SortContextType | null>(null)

/**
 * SortProvider Component
 *
 * Wraps children components, providing sorting state values via context.
 *
 * @param children - JSX Components that require SortProvider shared values.
 */
export const SortProvider = ({ children }: { children: ReactNode }) => {
	// Allows amending the sort map and provides current value.
	const [sorts, setSortMap] = useState<SortMap>(initialSortMap)

	/**
	 * Sets the sort map according to the section and value provided.
	 *
	 * @param section - Section of the app to be sorted.
	 * @param value - Value that the section needs to be sorted with.
	 */
	const setSorts = (section: keyof SortMap, type: SortType, ascending: boolean) => {
		setSortMap((prev) => ({ ...prev, [section]: { type, ascending } }))
	}

	// Toggles the sorting method between ascending and descending orders.
	const toggleOrder = (section: keyof SortMap) => {
		setSortMap((prev) => ({
			...prev,
			[section]: { ...prev[section], ascending: !prev[section].ascending },
		}))
	}

	return (
		<SortContext.Provider value={{ sorts, setSorts, toggleOrder }}>{children}</SortContext.Provider>
	)
}

/**
 * useSort Hook
 *
 * Custom hook to provide shared sort context values.
 *
 * @throws Error if used outside SortProvider.
 * @returns SortContext shared values.
 */
export const useSort = () => {
	const ctx = useContext(SortContext)
	if (!ctx) throw new Error("useSort must be used within a SortProvider")
	return ctx
}
