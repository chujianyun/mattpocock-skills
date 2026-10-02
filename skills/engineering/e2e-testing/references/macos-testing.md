# macOS acceptance

Distinguish web, Electron and native apps before choosing a runner. Reuse working XCTest UI tests or other suitable project tests. For new native automation, use project-local WebdriverIO with Appium Mac2. Electron renderer tests use the browser reference; native OS behavior remains separate.

## Readiness

1. Identify the actual `.app`, bundle ID, build revision, architecture and test launch configuration. For packaged-app acceptance, test the packaged build, not a browser development preview.
2. Check the active developer directory, Xcode/XCTest availability and macOS compatibility with the installed Mac2/Appium versions. Start with `xcode-select -p`, `xcodebuild -version` and the available driver's doctor command.
3. Check Mac2/WebDriverAgentMac setup, GUI session availability and required accessibility/automation permissions. Ask for the exact missing permission when needed; do not edit privacy databases or disable OS protections.
4. Give the test a dedicated app data location or synthetic account using an existing supported launch mechanism. Changing `HOME` or clearing the user's preferences is not test isolation.

A command path alone does not prove Xcode, a GUI session or a driver is usable. Missing permissions or runner prerequisites are blockers, not passing tests.

## Execute

- Configure `platformName: 'mac'`, `appium:automationName: 'mac2'`, and the test app's `appium:bundleId`. A local build outside an installed location may also need `appium:appPath`. For lifecycle execute methods, use the driver's `path` argument when the bundle ID alone cannot resolve that build. Verify capabilities and method arguments against the installed driver; they are not interchangeable.
- Prefer accessibility identifiers, roles and labels exposed by the app. When SwiftUI/AppKit controls are inaccessible, inspect the accessibility tree and add narrowly scoped identifiers when source is available.
- Drive the actual workflow and assert its result. For persistence, save, terminate the task's app instance, relaunch without clearing data, and verify the saved value through the UI.
- Exercise menus, secondary windows, file dialogs, permissions and deep links only when they belong to the acceptance criteria. A stubbed native dialog cannot prove that the real dialog works.
- Tauri and other embedded-web apps need checks against the packaged shell for native capabilities; a development web URL only proves browser behavior.
- Save real screenshots and relevant runner output. Restore task-owned test state and close task-owned sessions; leave unrelated apps and user data intact.

Report macOS version, architecture, build identity, runner/driver and actual native coverage. This checks functional behavior, not notarization, signing distribution or installer certification.

Primary references: [Mac2](https://github.com/appium/appium-mac2-driver), [WebdriverIO Appium setup](https://webdriver.io/docs/appium/).
