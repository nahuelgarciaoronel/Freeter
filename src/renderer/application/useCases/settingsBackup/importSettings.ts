/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { FileSystemProvider } from '@/application/interfaces/fileSystemProvider';
import { initAppStateWidgets, mergeAppStateWithPersistentAppState, PersistentAppState } from '@/base/state/app';
import { validatePersistentAppState } from '@/utils/validatePersistentAppState';

type Deps = {
  appStore: AppStore;
  dialog: DialogProvider;
  fileSystem: FileSystemProvider;
}

export function createImportSettingsUseCase({
  appStore,
  dialog,
  fileSystem,
}: Deps) {
  const useCase = async () => {
    const result = await dialog.showOpenFileDialog({
      title: 'Import Freeter Settings',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return false;
    }

    const text = await fileSystem.readTextFromFile(result.filePaths[0]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      await dialog.showMessageBox({
        type: 'warning',
        message: 'The selected file is not a valid JSON file.'
      });
      return false;
    }

    const data = (parsed as Record<string, unknown> | undefined)?.data;
    if (!validatePersistentAppState(data)) {
      await dialog.showMessageBox({
        type: 'warning',
        message: 'The selected file does not contain a valid Freeter settings backup.'
      });
      return false;
    }

    const persistentState = data as PersistentAppState;
    let state = appStore.get();
    state = mergeAppStateWithPersistentAppState(state, persistentState);
    state = initAppStateWidgets(state);
    appStore.set(state);

    return true;
  }

  return useCase;
}

export type ImportSettingsUseCase = ReturnType<typeof createImportSettingsUseCase>;
