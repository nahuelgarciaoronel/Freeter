/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { isValidThemeId, getAvailableThemes } from '@/ui/components/app/uiTheme/themes';

export const defaultUiThemeId = 'light';

export { getAvailableThemes as getUiThemeOptions };

export function sanitizeUiThemeId(id: string): string {
  if (isValidThemeId(id)) {
    return id;
  }
  return defaultUiThemeId;
}
