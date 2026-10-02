# Android acceptance

Reuse suitable Espresso/UI Automator, Maestro, Detox or Flutter integration tests. With no suitable setup, use WebdriverIO + Appium UiAutomator2 for native, hybrid and physical-device Chrome testing. Playwright Android automation is experimental and is not the default native-app runner.

## Readiness

- Discover the project's JDK/Gradle and Android SDK requirements, ADB, available emulator images and selected device. Confirm authorization and boot readiness, not just presence in a device listing.
- Select a dedicated emulator or authorized physical device explicitly. Record OS/API level and model; keep raw device identifiers out of shared reports.
- Identify a compatible test APK, application ID and launch activity from the project/build. An Android App Bundle is not directly equivalent to an installable APK; use the project's supported installation workflow.
- Check compatible Appium/UiAutomator2 versions and the driver's doctor output. For browser/WebView tests, check Chrome/WebView and Chromedriver compatibility and whether the test build exposes the required web context.
- Missing SDK, image, device authorization or driver readiness blocks that target. Do not report a browser-only run as Android-native coverage or silently download a large new SDK as a routine test command.

## Session and scenarios

Set `platformName: 'Android'`, `appium:automationName: 'UiAutomator2'`, and an explicit `appium:udid`. Use the APK or installed app's `appium:appPackage` and `appium:appActivity` as appropriate. A real Chrome session uses browser capabilities. Keep device-specific values in local config; verify exact options against the installed driver.

Prefer resource IDs and accessibility descriptions. For hybrid apps, select the correct native/WebView context; a passing web-context test does not cover the native shell. If framework-rendered controls are inaccessible, inspect their semantics and reuse suitable framework tests instead of claiming blind coordinate automation as reliable coverage.

Exercise relevant permission allow/deny paths, back navigation, deep links, background/foreground transitions, keyboard behavior, offline recovery and relaunch persistence. Reinstall/reset behavior must not erase the very persistence state a case is meant to verify.

Verify the backend route from the device. On the standard Android Emulator, the host loopback alias is commonly `10.0.2.2`; it is not a physical-device address. Use an existing reachable endpoint or a task-owned ADB reverse mapping where appropriate, and remove only that mapping afterward. Do not weaken release network security to make a test pass.

Preserve actual assertions, screenshots and relevant log excerpts, excluding unrelated logcat data and secrets. Stop only task-owned emulators/sessions and clean only owned test data. Distinguish emulator from physical-device coverage and simulated events from real system/service behavior.

Primary references: [UiAutomator2](https://github.com/appium/appium-uiautomator2-driver), [Android Emulator networking](https://developer.android.com/studio/run/emulator-networking), [Playwright Android limits](https://playwright.dev/docs/api/class-android).
