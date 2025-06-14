/**
 * SortContext
 *
 * Provides shared values for sorting methods.
 */

import { createContext, ReactNode, useContext, useState } from "react"

// All different sorting types.
type SortType =
	| "name-asc"
	| "name-desc"
	| "updated-newest"
	| "updated-oldest"
	| "created-newest"
	| "created-oldest"

// Map that allows sorting each section differently.
type SortMap = {
	notebooks: SortType
}

type SortContextType = {
	// Current sort type.
	sorts: SortMap
	// Set the sort for a section.
	setSorts: (section: keyof SortMap, value: SortType) => void
	// Toggle ascending or descending order.
	toggleSort: (section: keyof SortMap) => void
}

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
	const [sorts, setSortMap] = useState<SortMap>({ notebooks: "updated-newest" })

	/**
	 * Sets the sort map according to the section and value provided.
	 *
	 * @param section - Section of the app to be sorted.
	 * @param value - Value that the section needs to be sorted with.
	 */
	const setSorts = (section: keyof SortMap, value: SortType) => {
		setSortMap((prev) => ({ ...prev, [section]: value }))
	}

	/**
	 * Toggles the sorting method between ascending and descending orders.
	 *
	 * @param section - Section of the app to be sorted.
	 */
	const toggleSort = (section: keyof SortMap) => {
		setSortMap((prev) => {
			const curr = prev[section] // Get the current sort setting of the section.
			let next: SortType

			// Toggle between ascending and descending orders.
			if (curr.startsWith("name")) {
				next = curr === "name-asc" ? "name-desc" : "name-asc"
			} else if (curr.startsWith("updated")) {
				next = curr === "updated-newest" ? "updated-oldest" : "updated-newest"
			} else {
				next = curr === "created-newest" ? "created-oldest" : "created-newest"
			}

			return { ...prev, [section]: next }
		})
	}

	return (
		<SortContext.Provider value={{ sorts, setSorts, toggleSort }}>{children}</SortContext.Provider>
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
