/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { readFileSync } from 'node:original-fs';

export function createReadTextFromFileUseCase() {
  return function readTextFromFileUseCase(filePath: string): string {
    return readFileSync(filePath, 'utf-8');
  }
}

export type ReadTextFromFileUseCase = ReturnType<typeof createReadTextFromFileUseCase>;
