/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta', 'AltGraph'];

const namedKeyMap: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  Escape: 'Esc',
  Delete: 'Delete',
  Backspace: 'Backspace',
  Enter: 'Return',
  Tab: 'Tab'
};

/**
 * Converts a browser KeyboardEvent into an Electron-compatible accelerator
 * string (e.g. "CmdOrCtrl+Shift+F"). Returns null when only modifier keys are
 * pressed, so callers can keep waiting for a complete combination.
 */
export function keyboardEventToAccelerator(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>): string | null {
  if (modifierKeys.includes(event.key)) {
    return null;
  }

  const parts: string[] = [];
  if (event.ctrlKey || event.metaKey) {
    parts.push('CmdOrCtrl');
  }
  if (event.altKey) {
    parts.push('Alt');
  }
  if (event.shiftKey) {
    parts.push('Shift');
  }

  let mainKey: string;
  if (namedKeyMap[event.key]) {
    mainKey = namedKeyMap[event.key];
  } else if (event.key.length === 1) {
    mainKey = event.key.toUpperCase();
  } else {
    mainKey = event.key;
  }

  parts.push(mainKey);
  return parts.join('+');
}
