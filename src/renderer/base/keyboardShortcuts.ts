/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export type KeyboardShortcutScope = 'global' | 'local';

export interface KeyboardShortcutDef {
  readonly id: string;
  readonly label: string;
  readonly scope: KeyboardShortcutScope;
  readonly defaultAccelerator: string;
}

export const shortcutIdToggleEditMode = 'toggle-edit-mode';
export const shortcutIdOpenSettings = 'open-settings';

/**
 * Registry of locally-editable keyboard shortcuts. This is the single source of
 * truth shared between the application menu (where the accelerators are applied)
 * and the Application Settings UI (where they are visualized and edited).
 *
 * The global "bring to front" hotkey is handled separately through
 * AppConfig.mainHotkey, as it must be a valid Electron global accelerator.
 */
export const keyboardShortcutDefs: ReadonlyArray<KeyboardShortcutDef> = [
  {
    id: shortcutIdToggleEditMode,
    label: 'Toggle Edit Mode',
    scope: 'local',
    defaultAccelerator: 'CmdOrCtrl+E'
  },
  {
    id: shortcutIdOpenSettings,
    label: 'Open Settings',
    scope: 'local',
    defaultAccelerator: 'CmdOrCtrl+,'
  }
];

export type KeyboardShortcutOverrides = Record<string, string>;

/**
 * Resolves the effective accelerator for a shortcut id, falling back to the
 * registered default when there is no user override.
 */
export function resolveShortcutAccelerator(id: string, overrides?: KeyboardShortcutOverrides): string {
  if (overrides && typeof overrides[id] === 'string') {
    return overrides[id];
  }
  const def = keyboardShortcutDefs.find(item => item.id === id);
  return def ? def.defaultAccelerator : '';
}
