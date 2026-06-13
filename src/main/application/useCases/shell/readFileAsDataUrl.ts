/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { readFile } from 'node:original-fs';
import { extname } from 'node:path';

const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
};

export function createReadFileAsDataUrlUseCase() {
  return async function readFileAsDataUrlUseCase(path: string): Promise<string> {
    const ext = extname(path).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      readFile(path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    const base64 = buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
  }
}

export type ReadFileAsDataUrlUseCase = ReturnType<typeof createReadFileAsDataUrlUseCase>;
