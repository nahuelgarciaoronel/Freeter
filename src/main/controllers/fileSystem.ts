/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { ipcReadTextFromFileChannel, IpcReadTextFromFileArgs, IpcReadTextFromFileRes, ipcWriteTextToFileChannel, IpcWriteTextToFileArgs, IpcWriteTextToFileRes } from '@common/ipc/channels';
import { WriteTextToFileUseCase } from '@/application/useCases/fileSystem/writeTextToFile';
import { ReadTextFromFileUseCase } from '@/application/useCases/fileSystem/readTextFromFile';

type Deps = {
  writeTextToFileUseCase: WriteTextToFileUseCase;
  readTextFromFileUseCase: ReadTextFromFileUseCase;
}

export function createFileSystemControllers({
  writeTextToFileUseCase,
  readTextFromFileUseCase,
}: Deps): [
    Controller<IpcWriteTextToFileArgs, IpcWriteTextToFileRes>,
    Controller<IpcReadTextFromFileArgs, IpcReadTextFromFileRes>,
  ] {
  return [{
    channel: ipcWriteTextToFileChannel,
    handle: async (_event, filePath, text) => writeTextToFileUseCase(filePath, text)
  }, {
    channel: ipcReadTextFromFileChannel,
    handle: async (_event, filePath) => readTextFromFileUseCase(filePath)
  }]
}
