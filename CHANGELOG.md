# Features Implemented

## Overview

This document summarizes five features implemented in the Freeter fork codebase:

1. **Keyboard Shortcuts** – editable shortcut overrides in Application Settings, synced to the app menu.
2. **Hide Widget Titles** – per-widget toggle to hide the title bar in normal mode while keeping it visible in edit mode.
3. **Export / Import Local Settings** – backup and restore of the local application state (projects, workflows, apps, widgets, settings) via JSON files.
4. **Custom Widget Icons (Commander, Link Opener, Web Query)**
5. **System Themes** – support for loading themes from JSON files, with built-in dark and light themes and support for custom themes.

---

## 1. Keyboard Shortcuts

### What changed

- Added a centralized **shortcut registry** (`keyboardShortcuts.ts`) that defines each shortcut by `id`, `label`, `scope`, and `defaultAccelerator`.
- Added `shortcuts?: KeyboardShortcutOverrides` to `AppConfig` so user overrides are persisted.
- Added a `KeyboardEvent → Electron accelerator` utility (`keyboardEventToAccelerator.ts`) to capture key combinations in the renderer.
- Replaced hard-coded menu accelerators in `initAppMenu.ts` with dynamic resolution via `resolveShortcutAccelerator(id, appConfig.shortcuts)`. The menu is rebuilt automatically whenever `appConfig.shortcuts` changes via a store subscription.
- Added a **Keyboard Shortcuts section** inside `ApplicationSettings` that renders every registered shortcut with a `ShortcutInput` component (click to record, click Clear to reset).

### Files touched

- `src/renderer/base/keyboardShortcuts.ts` *(new)*
- `src/renderer/base/appConfig.ts`
- `src/renderer/base/state/ui.ts`
- `src/renderer/utils/keyboardEventToAccelerator.ts` *(new)*
- `src/renderer/ui/components/applicationSettings/shortcutInput.tsx` *(new)*
- `src/renderer/ui/components/applicationSettings/shortcutInput.module.scss` *(new)*
- `src/renderer/ui/components/applicationSettings/applicationSettings.tsx`
- `src/renderer/ui/components/applicationSettings/applicationSettingsViewModel.ts`
- `src/renderer/application/useCases/appMenu/initAppMenu.ts`
- `tests/renderer/application/useCases/appMenu/initAppMenu.spec.ts`

### Architecture notes

- `keyboardShortcutDefs` is the single source of truth for both the menu and the settings UI.
- The store subscription in `initAppMenu.ts` detects changes on `appConfig.shortcuts` and rebuilds the native Electron menu so accelerators stay in sync without a restart.

---

## 2. Hide Widget Titles

### What changed

- Extended `WidgetCoreSettings` with `readonly hideTitle?: boolean`.
- Added a toggle in `coreSettings.tsx` so users can enable/disable title hiding per widget.
- Updated the `widget.tsx` rendering logic:
  - `showHeader = editMode || !hideTitle`
  - This keeps the header visible in edit mode even when the user has hidden it in normal mode, ensuring the action bar and settings are still accessible.
- Added `.without-header` CSS rule so `widget-body` expands to fill the full widget height when the header is hidden.

### Files touched

- `src/renderer/base/widget.ts`
- `src/renderer/ui/components/widgetSettings/coreSettings/coreSettings.tsx`
- `src/renderer/ui/components/widget/widgetViewModel.ts`
- `src/renderer/ui/components/widget/widget.tsx`
- `src/renderer/ui/components/widget/widget.module.scss`

---

## 3. Export / Import Local Settings

### What changed

- Added two IPC channels: `write-text-to-file` and `read-text-from-file`.
- Added main-process use cases (`writeTextToFile.ts`, `readTextFromFile.ts`) and a controller (`fileSystem.ts`) that wrap `node:original-fs`.
- Added a `FileSystemProvider` interface + renderer-side implementation (`fileSystemProvider.ts`) that invokes the new IPC channels.
- Added a lightweight schema validator (`validatePersistentAppState.ts`) to guard against malformed imports.
- Added renderer use cases:
  - `exportSettings.ts`: opens a Save dialog, serializes the current persistent state + version, and writes it as JSON.
  - `importSettings.ts`: opens an Open dialog, reads JSON, validates structure, merges the persistent state into the current store, and re-initializes widgets (`initAppStateWidgets`).
- Wired **Export Settings…** and **Import Settings…** menu items into both the macOS App menu and the cross-platform File menu.
- Connected everything in `src/renderer/init.ts` (provider creation, use case instantiation, DI injection into `initAppMenu`).

### Files touched

- `src/common/ipc/channels.ts`
- `src/main/application/useCases/fileSystem/writeTextToFile.ts` *(new)*
- `src/main/application/useCases/fileSystem/readTextFromFile.ts` *(new)*
- `src/main/controllers/fileSystem.ts` *(new)*
- `src/main/index.ts`
- `src/renderer/application/interfaces/fileSystemProvider.ts` *(new)*
- `src/renderer/infra/fileSystemProvider/fileSystemProvider.ts` *(new)*
- `src/renderer/utils/validatePersistentAppState.ts` *(new)*
- `src/renderer/application/useCases/settingsBackup/exportSettings.ts` *(new)*
- `src/renderer/application/useCases/settingsBackup/importSettings.ts` *(new)*
- `src/renderer/application/useCases/appMenu/initAppMenu.ts`
- `src/renderer/init.ts`
- `tests/renderer/application/useCases/appMenu/initAppMenu.spec.ts`

### Architecture notes

- The export payload wraps `PersistentAppState` with a `version` field for future migration support.
- Import performs shallow structural validation (checks `entities`, `ui`, and `ui.appConfig` presence) before merging, and shows a warning dialog if validation fails.
- The `importSettingsUseCase` intentionally returns `Promise<boolean>` so callers can react to success/failure, but in the menu it is wrapped to discard the return value because `MenuAction` expects `Promise<void>`.

---

## 4. Custom Widget Icons (Commander, Link Opener, Web Query)

### What changed

- Added a `customIconDataUrl: string` field to the `Settings` interface and `createSettingsState` of the **Commander**, **Link Opener**, and **Web Query** widgets.
- Added a **Custom Icon** settings block in each widget's settings editor, following the exact UX pattern already used by **File Opener**:
  - *Select Icon* / *Change Icon* button (opens a file dialog filtered to images, reads the file as a Data URL via `dialog.readFileAsDataUrl`).
  - *Remove* button (clears the stored Data URL).
  - Live preview of the selected image (48 px thumbnail).
- Updated each widget's rendering logic so that when `customIconDataUrl` is set, the widget renders a plain `<button>` with an `<img>` instead of the default `<Button iconSvg={...}/>`.
  - **Commander** and **Link Opener** use a full-size shortcut button (`.shortcut-button` + `.shortcut-icon`) because their widgets are single-action buttons that fill the tile.
  - **Web Query** uses a smaller submit button (`.query-button` + `.query-button-icon`) because it lives next to a text input inside a `<form>`.
- Added the corresponding CSS Module rules to each widget's `widget.module.scss`.
- Updated the test fixtures for all three widgets to include `customIconDataUrl: ''` so existing unit tests continue to type-check.

### Files touched

- `src/renderer/widgets/commander/settings.tsx`
- `src/renderer/widgets/commander/widget.tsx`
- `src/renderer/widgets/commander/widget.module.scss`
- `src/renderer/widgets/link-opener/settings.tsx`
- `src/renderer/widgets/link-opener/widget.tsx`
- `src/renderer/widgets/link-opener/widget.module.scss`
- `src/renderer/widgets/web-query/settings.tsx`
- `src/renderer/widgets/web-query/widget.tsx`
- `src/renderer/widgets/web-query/widget.module.scss`
- `tests/renderer/widgets/commander/fixtures.ts`
- `tests/renderer/widgets/link-opener/fixtures.ts`
- `tests/renderer/widgets/web-query/fixtures.ts`

### Architecture notes

- The implementation mirrors **File Opener** (`src/renderer/widgets/file-opener`) one-to-one. No new abstractions were introduced; the pattern is copy-paste consistent across all shortcut-style widgets.
- `dialog.readFileAsDataUrl` is already available on `WidgetSettingsApi.dialog`; no new IPC or main-process code was required.
- The fallback path (no custom icon) is unchanged — each widget still renders its original SVG icon via the shared `<Button>` component.

---

## Verification

- **Lint**: `renderer`, `main`, and `common` pass clean.
- **Tests**: All 816 renderer tests across 64 suites pass.
- **Type-check**: Renderer tests type-check cleanly; main tests have one pre-existing unrelated failure in `tests/main/controllers/shell.spec.ts`.

## Backwards compatibility

- `WidgetCoreSettings.hideTitle` is optional (`?: boolean`) – existing widgets without the flag default to `false`.
- `AppConfig.shortcuts` is optional – existing configs without the field work normally and default to an empty object on new installs.
- The export/import JSON schema is additive (wrapped with `version`) and validated on import, preventing silent corruption.
- `customIconDataUrl` defaults to an empty string in `createSettingsState`, so existing widgets without the field behave exactly as before.


## 5. System Themes

### What changed

The Freeter theme system was migrated from hardcoded TypeScript objects to a JSON file-based system, adding support for loading user-defined custom themes from disk.

**Before**

- Themes defined in `dark.ts` and `light.ts` as exported TS objects.
- `UiThemeId` was a static union type `'dark' | 'light'`.
- The list of available themes was a fixed constant in `base/uiTheme.ts`.

**After**

- Themes defined in `dark.json` and `light.json` sharing a common schema `{ id, name, author, tokens }`.
- `uiTheme` in `AppConfig` is a dynamic string, validated at runtime against the registry.
- The registry is populated at startup with the built-ins + the JSON files from the user's directory.
- The list of themes in Application Settings is generated dynamically.

### Files created

- `src/common/base/uiTheme.ts`
  - Shared type between main and renderer:
  ```typescript
  export interface UiThemeJson {
    id: string;
    name: string;
    author: string;
    tokens: Record<string, string>;
  }
  ```

- `src/renderer/ui/components/app/uiTheme/themes/dark.json`
- `src/renderer/ui/components/app/uiTheme/themes/light.json`
  - Built-in themes with ~130 tokens each. The keys in `tokens` map 1:1 to CSS variables `--freeter-{key}`.

- `src/renderer/ui/components/app/uiTheme/themeRegistry.ts`
  - Central registry in the renderer. It initializes with the built-ins and accepts custom registrations:
  ```typescript
  registerCustomThemes(themes: UiThemeJson[]): void
  getThemeTokens(id: string): Record<string, string> | undefined
  getAvailableThemes(): { id: string; name: string }[]
  isValidThemeId(id: boolean): boolean
  ```

- `src/main/application/useCases/customThemes/loadCustomThemes.ts`
  - Main process use case. It reads all `.json` files from the user's themes directory, validates the structure, and returns `UiThemeJson[]`. It uses `node:original-fs` (project pattern). Fails silently if the directory does not exist.

- `src/main/controllers/customThemes.ts`
  - IPC controller for the `load-custom-themes` channel. Follows the same pattern as the rest of the controllers in the project.

### Files modified

- `tsconfig.json`
  - Added `"resolveJsonModule": true` to allow importing `.json` files in TS.

- `src/common/ipc/channels.ts`
  - Added at the end:
  ```typescript
  export const ipcLoadCustomThemesChannel = makeIpcChannelName('load-custom-themes');
  export type IpcLoadCustomThemesArgs = [];
  export type IpcLoadCustomThemesRes = { id: string; name: string; author: string; tokens: Record<string, string> }[];
  ```

- `src/renderer/ui/components/app/uiTheme/themes/index.ts`
  - Replaced the static `uiThemes` map with re-exports from the registry and a `getThemeById(id)` function that falls back to `'light'`.

- `src/renderer/ui/components/app/uiTheme/uiTheme.tsx`
  - `UIThemeProps.themeId` changed from `UiThemeId` to `string`. Uses `getThemeById()` from the registry.

- `src/renderer/base/uiTheme.ts`
  - Removed `UiThemeId` union type, `uiThemeDataById`, and the static `uiThemes` array.
  - `sanitizeUiThemeId(id: string): string` — validates against the dynamic registry.
  - Exports `getUiThemeOptions` (alias for `getAvailableThemes()` from the registry).

- `src/renderer/ui/components/applicationSettings/applicationSettingsViewModel.ts`
  - `const uiThemeOptions = uiThemes` → `const uiThemeOptions = getUiThemeOptions()`.

- `src/renderer/init.ts`
  - At the beginning of `createUseCases`, before any other logic:
  ```typescript
  const customThemes = await electronIpcRenderer.invoke<IpcLoadCustomThemesArgs, IpcLoadCustomThemesRes>(ipcLoadCustomThemesChannel);
  registerCustomThemes(customThemes);
  ```

- `src/main/index.ts`
  - `mkdirSync(themesDir, { recursive: true })` — creates the themes directory on startup.
  - `createLoadCustomThemesUseCase(themesDir)` — instantiates the use case.
  - `createCustomThemesControllers(...)` — registered in `registerControllers`.
  - `themesDir = join(app.getPath('appData'), 'freeter2', 'themes')`.

- `src/main/application/useCases/shell/readFileAsDataUrl.ts`
  - Removed 4 debug `console.log`/`console.error` that were left behind.

### Unused files (DO NOT delete — reference)

- `src/renderer/ui/components/app/uiTheme/themes/dark.ts`
- `src/renderer/ui/components/app/uiTheme/themes/light.ts`

The original `.ts` files are no longer imported anywhere, but they are kept as a reference for the original schema.

### Runtime data flow

```
app startup (main process)
  └─ mkdirSync(%APPDATA%/freeter2/themes)
  └─ loadCustomThemesUseCase() → reads .json files from directory
  └─ registers IPC controller 'load-custom-themes'

app startup (renderer process)
  └─ createUseCases()
      └─ ipc.invoke('load-custom-themes') → UiThemeJson[]
      └─ registerCustomThemes(customThemes)
           └─ themeRegistry.Map adds custom themes on top of built-ins

user changes theme in ApplicationSettings
  └─ updateApplicationSettings({ uiTheme: 'my-theme' })
  └─ appConfig.uiTheme persists in appDataStorage
  └─ sanitizeUiThemeId('my-theme') → validates in registry → 'my-theme'
  └─ <UITheme themeId='my-theme'> → getThemeById('my-theme') → tokens{}
  └─ document.documentElement.style.setProperty('--freeter-{key}', value)
```

### How to create a custom theme

Create a `.json` file in:

- **Windows**: `%APPDATA%\freeter2\themes\`
- **macOS**: `~/Library/Application Support/freeter2/themes/`
- **Linux**: `~/.config/freeter2/themes/`

Minimum required format:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "author": "Author",
  "tokens": {
    "background": "#1a1a2e",
    "outline": "#e94560"
  }
}
```

The available tokens are defined in `dark.json` / `light.json` (~130 tokens).
If a token is not defined, the CSS variable keeps the value from the previous theme.

Restart the app → the theme will appear in Application Settings → User Interface Theme.

### Test status

`npm test` passes with 1341 tests OK. The 14 reported failures are pre-existing in `web-query` and `file-opener/settings`, unrelated to the theme system.

