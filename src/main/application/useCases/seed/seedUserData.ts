/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:original-fs';
import { join } from 'node:path';

export interface SeedDir {
  srcDir: string;
  destDir: string;
}

export function createSeedUserDataUseCase(seeds: SeedDir[]) {
  return function seedUserDataUseCase(): void {
    for (const { srcDir, destDir } of seeds) {
      try {
        if (!existsSync(srcDir) || !statSync(srcDir).isDirectory()) {
          continue;
        }

        mkdirSync(destDir, { recursive: true });

        for (const entry of readdirSync(srcDir)) {
          if (entry === 'README.md') {
            continue;
          }
          const destPath = join(destDir, entry);
          if (existsSync(destPath)) {
            continue;
          }
          cpSync(join(srcDir, entry), destPath, { recursive: true });
        }
      } catch {
        // Fail silently: seeding must never block app startup
      }
    }
  }
}

export type SeedUserDataUseCase = ReturnType<typeof createSeedUserDataUseCase>;
