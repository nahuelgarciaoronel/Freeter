## This is a modified version of the [Freeter app](https://github.com/FreeterApp/Freeter) by [alexk111](https://github.com/alexk111).

 **With the following added features:**
 1. **Keyboard Shortcuts** – editable shortcut overrides in Application Settings, synced to the app menu.
2. **Hide Widget Titles** – per-widget toggle to hide the title bar in normal mode while keeping it visible in edit mode.
3. **Export / Import Local Settings** – backup and restore of the local application state (projects, workflows, apps, widgets, settings) via JSON files.
4. **Custom Widget Icons (Commander, Link Opener, Web Query)**
5. **System Themes** – support for loading themes from JSON files, with built-in dark and light themes and support for custom themes.
<br>
<br>

A full list of changes can be found in the [CHANGELOG.md](CHANGELOG.md) file.
____________________________________________________________
Acknowledgment: I didn't send a pull request to the original repository because I'm not sure if the author would want to merge these changes made largely lavereging Opus 4.8 (Don't want to saturate the original repo with so many changes to review), but I'm happy to do so if you think it would be a good idea.
____________________________________________________________
<br>



<p align="center"><img src="https://raw.githubusercontent.com/FreeterApp/Freeter/master/resources/linux/freeter-icons/256x256.png" style="margin-right: 16px; width: 128px; height: 128px"/></p>

**Freeter** is a free and open-source organizer for people who work on their computer.

It lets you gather everything you need for work — in one place, organized by projects and workflows. Quickly access your setup via `Ctrl or Cmd`+`Shift`+`F` or from the tray icon.
Switch effortlessly between workflows, stay focused on what matters now, and reduce context-switching.

Curious about what the app does and how to get started? [**Read the full post here**][post-intro].

---

[**Homepage**][home] | [**Download**][download] | [**Community**][community] | [**Donate**][donate] | [**Roadmap**][roadmap] | [**Feature Requests**][featurerequests] | [**Bug Reports**][bugreports]

## Supported Operating Systems

- Linux; most distros; Intel 64-bit.
- Windows 10 and later; Intel 64-bit.
- Mac OS 10.15 and later; Intel and Apple Silicon.

## Installers

Check out the [download page][download] for the latest ready-to-use installers for all supported operating systems.

## Run From Source Code

Prerequisites (for building the app, not needed for running):
- [NodeJS](https://nodejs.org/en)

Steps:
1. Download the source code from the [download page][download] or [GitHub releases page](https://github.com/FreeterApp/Freeter/releases).
2. Unpack the downloaded file.
3. Execute commands:
    1. `npm install` (install dependencies)
    2. `npm run prod` (compile the code)
    3. `npm run package` (package the app)

Done. The built package comes into the `./dist` folder.

## License

Freeter is free software and may be redistributed under the terms specified in the [license].

[home]: https://freeter.io/
[download]: https://freeter.io/download
[community]: https://community.freeter.io/
[donate]: https://freeter.io/sponsor
[roadmap]: https://community.freeter.io/topic/2/planned-features
[featurerequests]: https://community.freeter.io/category/6/feature-requests
[bugreports]: https://community.freeter.io/category/7/bug-reports
[post-intro]: https://freeter.io/blog/boost-your-productivity-while-managing-multiple-projects/
[license]: https://github.com/FreeterApp/Freeter/blob/master/COPYING
