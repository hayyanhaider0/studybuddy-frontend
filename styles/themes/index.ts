/**
 * index Theme
 *
 * Organizes all themes into a themes object.
 */

import { ThemeName } from "../../enums/global"
import { darkTheme } from "./dark"
import { lightTheme } from "./light"

export const themes = {
	[ThemeName.LIGHT]: lightTheme,
	[ThemeName.DARK]: darkTheme,
}
