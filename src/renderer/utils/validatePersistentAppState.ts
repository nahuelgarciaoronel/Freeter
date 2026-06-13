/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { PersistentAppState } from '@/base/state/app';

/**
 * Performs a shallow structural validation on imported data to prevent
 * corruption from malformed JSON files.
 */
export function validatePersistentAppState(data: unknown): data is PersistentAppState {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.entities !== 'object' || obj.entities === null) {
    return false;
  }
  if (typeof obj.ui !== 'object' || obj.ui === null) {
    return false;
  }
  const ui = obj.ui as Record<string, unknown>;
  if (typeof ui.appConfig !== 'object' || ui.appConfig === null) {
    return false;
  }
  return true;
}
