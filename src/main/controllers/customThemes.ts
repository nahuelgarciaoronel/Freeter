/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcLoadCustomThemesArgs, ipcLoadCustomThemesChannel, IpcLoadCustomThemesRes } from '@common/ipc/channels';
import { LoadCustomThemesUseCase } from '@/application/useCases/customThemes/loadCustomThemes';

type Deps = {
  loadCustomThemesUseCase: LoadCustomThemesUseCase;
}

export function createCustomThemesControllers({ loadCustomThemesUseCase }: Deps): [
  Controller<IpcLoadCustomThemesArgs, IpcLoadCustomThemesRes>,
] {
  return [{
    channel: ipcLoadCustomThemesChannel,
    handle: async () => loadCustomThemesUseCase()
  }]
}
