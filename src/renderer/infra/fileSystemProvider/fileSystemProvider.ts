/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcReadTextFromFileArgs, IpcReadTextFromFileRes, ipcReadTextFromFileChannel, IpcWriteTextToFileArgs, IpcWriteTextToFileRes, ipcWriteTextToFileChannel } from '@common/ipc/channels';
import { FileSystemProvider } from '@/application/interfaces/fileSystemProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

export function createFileSystemProvider(): FileSystemProvider {
  return {
    writeTextToFile: async (filePath, text) => electronIpcRenderer.invoke<IpcWriteTextToFileArgs, IpcWriteTextToFileRes>(
      ipcWriteTextToFileChannel,
      filePath,
      text
    ),
    readTextFromFile: async (filePath) => electronIpcRenderer.invoke<IpcReadTextFromFileArgs, IpcReadTextFromFileRes>(
      ipcReadTextFromFileChannel,
      filePath
    ),
  }
}
