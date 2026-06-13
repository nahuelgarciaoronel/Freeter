/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CoreSettingsProps, useCoreSettingsViewModel } from '@/ui/components/widgetSettings/coreSettings/coreSettingsViewModel';
import { SettingBlock } from '@/widgets/appModules';
import { convertBoolToStr, convertStrToBool } from '@/base/convTypes';

export function CoreSettings(props: CoreSettingsProps) {
  const {
    coreSettings,
    updateCoreSettings,
  } = useCoreSettingsViewModel(props);

  return (<>
    <SettingBlock
      titleForId='name'
      title='Name'
    >
      <input id="name" type="text" value={coreSettings.name} onChange={e => updateCoreSettings({
        ...coreSettings,
        name: e.target.value
      })}/>
    </SettingBlock>
    <SettingBlock
      titleForId='hide-title'
      title='Hide Title'
      moreInfo='When turned on, the widget title bar is hidden to maximize screen space.
                It remains accessible in Edit Mode so you can still open the widget settings.'
    >
      <select id="hide-title" value={convertBoolToStr(!!coreSettings.hideTitle)} onChange={e => updateCoreSettings({
        ...coreSettings,
        hideTitle: convertStrToBool(e.target.value)
      })}>
        <option value={convertBoolToStr(false)}>No</option>
        <option value={convertBoolToStr(true)}>Yes</option>
      </select>
    </SettingBlock>
  </>)
}
