/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { execCommandSvg } from '@/widgets/commander/icons';
import styles from './widget.module.scss';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const { terminal } = widgetApi;
  const { cwd, customIconDataUrl } = settings;
  const cmds = settings.cmds.filter(cmd=>cmd!=='');

  if (cmds.length === 0) {
    return <div className={styles['not-configured']}>
      Command-lines not specified.
    </div>;
  }

  if (customIconDataUrl) {
    return <button
      className={styles['shortcut-button']}
      onClick={_ => terminal.execCmdLines(cmds, cwd !== '' ? cwd : undefined)}
      title={`Execute Command-line${cmds.length>1 ? 's' : ''}`}
    >
      <img
        src={customIconDataUrl}
        alt="Custom icon"
        className={styles['shortcut-icon']}
      />
    </button>;
  }

  return <Button
    onClick={_ => terminal.execCmdLines(cmds, cwd !== '' ? cwd : undefined )}
    iconSvg={execCommandSvg}
    title={`Execute Command-line${cmds.length>1 ? 's' : ''}`}
    size='Fill'
  />;
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
