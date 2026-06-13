/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { writeFileSync } from 'node:original-fs';

export function createWriteTextToFileUseCase() {
  return function writeTextToFileUseCase(filePath: string, text: string): void {
    writeFileSync(filePath, text, 'utf-8');
  }
}

export type WriteTextToFileUseCase = ReturnType<typeof createWriteTextToFileUseCase>;
