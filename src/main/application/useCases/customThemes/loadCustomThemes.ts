/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { readdirSync, readFileSync, statSync } from 'node:original-fs';
import { join } from 'node:path';

interface UiThemeJson {
  id: string;
  name: string;
  author: string;
  tokens: Record<string, string>;
}

function isValidThemeJson(data: unknown): data is UiThemeJson {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.tokens === 'object' &&
    obj.tokens !== null
  );
}

export function createLoadCustomThemesUseCase(themesDir: string) {
  return function loadCustomThemesUseCase(): UiThemeJson[] {
    const themes: UiThemeJson[] = [];

    try {
      const stat = statSync(themesDir);
      if (!stat.isDirectory()) {
        return themes;
      }
    } catch {
      return themes;
    }

    try {
      const files = readdirSync(themesDir);
      for (const file of files) {
        if (!file.endsWith('.json')) {
          continue;
        }
        try {
          const content = readFileSync(join(themesDir, file), 'utf-8');
          const parsed = JSON.parse(content);
          if (isValidThemeJson(parsed)) {
            themes.push(parsed);
          }
        } catch {
          // Skip invalid JSON files
        }
      }
    } catch {
      // Return empty themes if directory can't be read
    }

    return themes;
  }
}

export type LoadCustomThemesUseCase = ReturnType<typeof createLoadCustomThemesUseCase>;
