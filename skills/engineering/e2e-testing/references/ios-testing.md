# iOS acceptance

Reuse the project's XCTest/XCUITest, Maestro, Detox or Flutter integration tests where suitable. With no suitable setup, use WebdriverIO + Appium XCUITest for native UI and physical-device Safari. Playwright's mobile Safari profile is web emulation, not an iOS run.

## Readiness

- Check Xcode, the selected developer directory, installed simulator runtimes and available devices. Use `xcodebuild -version` and targeted `xcrun simctl` queries; avoid dumping unrelated personal device information into reports.
- Select an explicit dedicated simulator or authorized physical device. Record device class, OS and model; keep raw device identifiers in local config, not shared reports.
- Identify bundle ID and a compatible build. Simulator `.app` builds and signed device builds are not interchangeable. Reuse the project's scheme, build command and test configuration.
- Check compatible Appium/XCUITest versions and WebDriverAgent readiness. Local Apple automation requires a macOS host with Xcode. An existing remote runner is usable only with authorized access; do not upload builds to a device cloud without permission.
- Physical devices may require trust, Developer Mode, signing and provisioning. Reuse existing authorized setup. Missing credentials or permissions are concrete blockers, not a reason to modify accounts or security settings automatically.

## Session and scenarios

For new Appium sessions, set `platformName: 'iOS'`, `appium:automationName: 'XCUITest'`, and select the device explicitly with `appium:udid`. Use the installed app's bundle ID or compatible app artifact. For Safari, use the appropriate browser capability instead of a native application capability. Verify exact options against the installed driver.

Use accessibility identifiers or meaningful native labels. React Native/Flutter controls must actually expose the identifiers to this driver; if they do not, inspect the accessibility tree or reuse framework-specific integration tests. Do not equate a screenshot with a native assertion.

Verify business outcomes and relevant lifecycle behavior: background/foreground, cold launch without data reset, deep links, keyboard interaction and permission refusal/recovery. Do not automatically grant all permissions if the permission flow is what the case tests. Simulated push, biometrics or network events must be labeled as simulated, not claimed as hardware/service coverage.

For networked apps, verify the backend URL from the selected simulator/device. A physical device's `localhost` points to itself. Use the project's reachable test endpoint; do not silently weaken transport security to reach a development server.

Capture runner results and real simulator/device screenshots. Shut down only a simulator started for this task and release only task-owned sessions. Never erase a personal device or clear unrelated app data. Report simulator and physical-device results separately; unavailable true-device coverage stays explicit.

Primary references: [XCUITest driver](https://github.com/appium/appium-xcuitest-driver), [Appium driver matrix](https://appium.io/docs/en/latest/ecosystem/drivers/).
