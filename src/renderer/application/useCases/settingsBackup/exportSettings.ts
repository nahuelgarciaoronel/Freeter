/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { FileSystemProvider } from '@/application/interfaces/fileSystemProvider';
import { createPersistentAppState, currentAppStateVersion } from '@/base/state/app';

type Deps = {
  appStore: AppStore;
  dialog: DialogProvider;
  fileSystem: FileSystemProvider;
}

export function createExportSettingsUseCase({
  appStore,
  dialog,
  fileSystem,
}: Deps) {
  const useCase = async () => {
    const result = await dialog.showSaveFileDialog({
      title: 'Export Freeter Settings',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      defaultPath: 'freeter-settings.json'
    });

    if (result.canceled || !result.filePath) {
      return;
    }

    const persistentState = createPersistentAppState(appStore.get());
    const exportData = {
      version: currentAppStateVersion,
      data: persistentState
    };

    await fileSystem.writeTextToFile(result.filePath, JSON.stringify(exportData, null, 2));
  }

  return useCase;
}

export type ExportSettingsUseCase = ReturnType<typeof createExportSettingsUseCase>;
