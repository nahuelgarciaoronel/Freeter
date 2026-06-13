/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, CreateSettingsState, List, ReactComponent, SettingsEditorReactComponentProps, addItemToList, browse14Svg, delete14Svg, removeItemFromList, SettingBlock, SettingRow, SettingActions } from '@/widgets/appModules';
import { useLayoutEffect, useRef } from 'react';

export interface Settings {
  urls: List<string>,
  customIconDataUrl: string;
}

export const createSettingsState: CreateSettingsState<Settings> = (settings) => ({
  urls: Array.isArray(settings.urls) ? settings.urls.map(path=>typeof path==='string'?path:'') : [''],
  customIconDataUrl: typeof settings.customIconDataUrl === 'string' ? settings.customIconDataUrl : ''
})

function SettingsEditorComp({settings, settingsApi}: SettingsEditorReactComponentProps<Settings>) {
  const urlRefs = useRef<Array<HTMLInputElement|null>>([]);
  const {updateSettings, dialog} = settingsApi;
  const shouldFocusLastUrlRef = useRef(false);

  const triggerLastUrlFocus = () => {
    shouldFocusLastUrlRef.current = true;
  };

  useLayoutEffect(() => {
    if (shouldFocusLastUrlRef.current) {
      urlRefs.current[settings.urls.length-1]?.focus();
      shouldFocusLastUrlRef.current = false;
    }
  }, [settings.urls.length]);

  const updateUrlsSetting = (urls: List<string>) => updateSettings({...settings, urls})

  const updUrl = (i: number, url: string) =>
    updateUrlsSetting(settings.urls.map((_path, _i) => i!==_i ? _path : url))
  const addPath = () =>
    updateUrlsSetting(addItemToList(settings.urls, ''))
  const deletePath = (i: number) =>
    updateUrlsSetting(removeItemFromList(settings.urls, i))

  return (
    <>
      <SettingBlock
        titleForId='url0'
        title='URLs'
        moreInfo='Specify the URLs to open with Web Browser.'
      >
        {settings.urls.map((url, i) => (
          <SettingRow key={i}>
            <input
              ref={(el) => {urlRefs.current[i] = el}}
              id={'url'+i}
              type="text"
              value={url}
              placeholder={'Enter a URL'}
              onChange={e => updUrl(i, e.target.value)}
            />
            <SettingActions
              actions={[{
                id: 'DELETE',
                icon: delete14Svg,
                title: 'Delete URL',
                doAction: async () => deletePath(i)
              }]}
            />
          </SettingRow>
        ))}
        <div>
          <Button
            onClick={_ => {
              addPath();
              triggerLastUrlFocus();
            }}
            caption={'Add a URL'}
            primary={true}
          ></Button>
        </div>
      </SettingBlock>

      <SettingBlock
        titleForId='link-opener-icon'
        title='Custom Icon'
        moreInfo='Select an image (PNG, SVG, ICO) to use as the widget icon.'
      >
        <SettingRow>
          <Button
            onClick={async () => {
              const { canceled, filePaths } = await dialog.showOpenFileDialog({
                title: 'Select Icon Image',
                filters: [{ name: 'Images', extensions: ['png', 'svg', 'ico', 'jpg', 'jpeg', 'webp'] }],
                multiSelect: false
              });
              if (!canceled && filePaths[0]) {
                const dataUrl = await dialog.readFileAsDataUrl(filePaths[0]);
                updateSettings({ ...settings, customIconDataUrl: dataUrl });
              }
            }}
            caption={settings.customIconDataUrl ? 'Change Icon' : 'Select Icon'}
            iconSvg={browse14Svg}
          />
          {settings.customIconDataUrl && (
            <Button
              onClick={() => updateSettings({ ...settings, customIconDataUrl: '' })}
              caption='Remove'
              iconSvg={delete14Svg}
            />
          )}
        </SettingRow>
        {settings.customIconDataUrl && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <img
              src={settings.customIconDataUrl}
              alt="Custom icon preview"
              style={{ maxWidth: '48px', maxHeight: '48px', objectFit: 'contain' }}
            />
          </div>
        )}
      </SettingBlock>
    </>
  )
}

export const settingsEditorComp: ReactComponent<SettingsEditorReactComponentProps<Settings>> = {
  type: 'react',
  Comp: SettingsEditorComp
}
