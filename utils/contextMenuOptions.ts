/**
 * contextMenuOptions Util
 *
 * Contains options used within all context menus.
 */

import { useSort } from "../contexts/SortContext"
import { ContextMenuOptionType, SortMap } from "../types/global"

export const getSortOptions = (section: keyof SortMap): ContextMenuOptionType[] => {
	const { sorts, setSorts } = useSort()

	return [
		{ label: "Sort By Name", onPress: () => setSorts(section, "name", sorts[section].ascending) },
		{
			label: "Sort By Date Updated",
			onPress: () => setSorts(section, "updated", sorts[section].ascending),
		},
		{
			label: "Sort By Date Created",
			onPress: () => setSorts(section, "created", sorts[section].ascending),
		},
	]
}
