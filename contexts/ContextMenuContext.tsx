/**
 * ContextMenuContext
 *
 * Provides a global context menu that can be opened from anywhere in the app.
 * Handles positioning, overflow detection, and menu sizing automatically.
 */

import { createContext, ReactNode, useContext, useState } from "react"
import { Dimensions } from "react-native"
import { ContextMenuOptionType } from "../types/global"

type OpenMenuParams = {
	options: ContextMenuOptionType[] | []
	position: { x: number; y: number }
	selectedOption?: string
}

type ContextMenuState = OpenMenuParams & {
	visible: boolean
	menuSize: { width: number; height: number }
	setMenuSize: (size: { width: number; height: number }) => void
}

type ContextMenuType = ContextMenuState & {
	openMenu: ({ options, position, selectedOption }: OpenMenuParams) => void
	closeMenu: () => void
}

const ContextMenuContext = createContext<ContextMenuType | null>(null)

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false)
	const [options, setOptions] = useState<ContextMenuOptionType[]>([])
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [selectedOption, setSelectedOption] = useState("")
	const [menuSize, setMenuSize] = useState({ width: 0, height: 0 })
	const [pendingMenuData, setPendingMenuData] = useState<OpenMenuParams | null>(null)

	const calculatePosition = (
		requestedPos: { x: number; y: number },
		size: { width: number; height: number }
	) => {
		const screen = Dimensions.get("window")
		const offset = 32

		let x = requestedPos.x + offset
		let y = requestedPos.y + offset

		// Flip left if menu would overflow right edge
		if (x + size.width > screen.width) {
			x = requestedPos.x - size.width
		}

		// Flip up if menu would overflow bottom edge
		if (y + size.height > screen.height) {
			y = requestedPos.y - size.height
		}

		return { x, y }
	}

	const openMenu = ({ options, position, selectedOption = "" }: OpenMenuParams) => {
		const hasMenuSize = menuSize.width > 0 && menuSize.height > 0

		setOptions(options)
		setSelectedOption(selectedOption)
		setVisible(true)

		if (hasMenuSize) {
			// We know the menu size, calculate position immediately
			setPosition(calculatePosition(position, menuSize))
			setPendingMenuData(null)
		} else {
			// Menu needs to be measured first
			setPendingMenuData({ options, position, selectedOption })
			setPosition({ x: 0, y: 0 }) // Hide initially
		}
	}

	const closeMenu = () => {
		setVisible(false)
		setOptions([])
		setSelectedOption("")
		setPendingMenuData(null)
	}

	const handleMenuSizeUpdate = (size: { width: number; height: number }) => {
		setMenuSize(size)

		// If we have pending data, calculate position now
		if (pendingMenuData) {
			setPosition(calculatePosition(pendingMenuData.position, size))
			setPendingMenuData(null)
		}
	}

	return (
		<ContextMenuContext.Provider
			value={{
				visible,
				options,
				position,
				selectedOption,
				menuSize,
				setMenuSize: handleMenuSizeUpdate,
				openMenu,
				closeMenu,
			}}
		>
			{children}
		</ContextMenuContext.Provider>
	)
}

export const useContextMenu = () => {
	const ctx = useContext(ContextMenuContext)
	if (!ctx) throw new Error("useContextMenu must be used within a ContextMenuProvider")
	return ctx
}
