/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useEffect } from 'react';
import { getThemeById } from '@/ui/components/app/uiTheme/themes';

export interface UIThemeProps {
  themeId: string;
}

export const UITheme = ({
  themeId
}: UIThemeProps) => {
  useEffect(() => {
    const tokens = getThemeById(themeId);
    Object.keys(tokens).forEach((key) => {
      document.documentElement.style.setProperty(`--freeter-${key}`, tokens[key]);
    });
  }, [themeId])
  return <></>;
}
