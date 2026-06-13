/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { UiThemeJson } from '@common/base/uiTheme';
import darkThemeJson from '@/ui/components/app/uiTheme/themes/dark.json';
import lightThemeJson from '@/ui/components/app/uiTheme/themes/light.json';

const builtInThemes: UiThemeJson[] = [
  darkThemeJson as UiThemeJson,
  lightThemeJson as UiThemeJson,
];

const themes: Map<string, UiThemeJson> = new Map();

builtInThemes.forEach(theme => themes.set(theme.id, theme));

export function registerCustomThemes(customThemes: UiThemeJson[]): void {
  customThemes.forEach(theme => {
    if (theme.id && theme.name && theme.tokens) {
      themes.set(theme.id, theme);
    }
  });
}

export function getThemeTokens(id: string): Record<string, string> | undefined {
  return themes.get(id)?.tokens;
}

export function getAvailableThemes(): { id: string; name: string }[] {
  return Array.from(themes.values()).map(t => ({ id: t.id, name: t.name }));
}

export function isValidThemeId(id: string): boolean {
  return themes.has(id);
}
