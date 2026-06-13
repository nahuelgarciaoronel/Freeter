import { getThemeTokens } from '@/ui/components/app/uiTheme/themeRegistry';

export { getThemeTokens, getAvailableThemes, registerCustomThemes, isValidThemeId } from '@/ui/components/app/uiTheme/themeRegistry';

// Re-export for backward compatibility
export function getThemeById(id: string): Record<string, string> {
  return getThemeTokens(id) || getThemeTokens('light')!;
}
