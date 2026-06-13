/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { openLinkSvg } from '@/widgets/link-opener/icons';
import styles from './widget.module.scss';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const { shell } = widgetApi;
  const { customIconDataUrl } = settings;

  const urls = settings.urls.filter(url=>url!=='');

  if (urls.length === 0) {
    return <div className={styles['not-configured']}>
      {'URLs not specified'}
    </div>;
  }

  if (customIconDataUrl) {
    return <button
      className={styles['shortcut-button']}
      onClick={_ => urls.forEach(url => shell.openExternalUrl(url))}
      title={`Open Link${urls.length>1 ? 's' : ''}`}
    >
      <img
        src={customIconDataUrl}
        alt="Custom icon"
        className={styles['shortcut-icon']}
      />
    </button>;
  }

  return <Button
    onClick={_ => urls.forEach(url => shell.openExternalUrl(url))}
    iconSvg={openLinkSvg}
    title={`Open Link${urls.length>1 ? 's' : ''}`}
    size='Fill'
  />;
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
