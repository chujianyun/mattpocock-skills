---
name: e2e-testing
description: Verify implemented features through HTTP APIs, web browsers, and macOS, iOS or Android apps, fix in-scope defects, and deliver one Markdown acceptance report. Use when asked to test a feature end to end, validate a user journey, or produce a cross-platform functional test report. Pure test advice and test-first feature development do not start an acceptance run.
---

# E2E Testing

**Acceptance** means an observed business outcome on the declared targets. A working API does not prove the UI exists; a browser preview does not prove the packaged app works. Deliver repeatable tests and one evidence-backed report, including when execution is blocked.

## 1. Declare the acceptance boundary

Read the feature requirements, relevant implementation and existing tests. Read `GLOSSARY.md` and relevant ADRs when present. Identify the actual user entry point, expected outcomes and build under test.

Write down the acceptance criteria, public interfaces under test, required platforms and device classes. Reuse scope agreed in the task or spec; ask only for missing decisions that change what counts as correct. Do not invent requirements from the current implementation.

Map each criterion to a case ID and target. Cover the critical success journey and meaningful failure paths. Use API cases for detailed HTTP behavior and UI cases for what the user must accomplish. A platform the product does not support is not applicable; a required platform you cannot run is blocked.

**Done when:** every required outcome has a planned check at an observable boundary, and required targets are explicit.

## 2. Select tools and check readiness

Reuse the project's suitable test framework, commands and fixtures. This includes XCTest/XCUITest, Espresso, Maestro, Detox and Flutter integration tests. Add only missing infrastructure; do not migrate working suites to standardize tools.

When no suitable infrastructure exists, use these defaults. Load only the relevant references:

| Target | Default | Read |
| --- | --- | --- |
| HTTP backend | Supertest with the existing Node test runner | [API testing](references/api-testing.md) |
| Desktop web or mobile web emulation | Playwright Test | [Browser testing](references/browser-testing.md) |
| Electron on macOS | Playwright Electron (experimental) | Browser testing and [macOS testing](references/macos-testing.md) |
| Native macOS | WebdriverIO + Appium Mac2 | macOS testing |
| Native iOS or real-device Safari | WebdriverIO + Appium XCUITest | [iOS testing](references/ios-testing.md) |
| Native Android or real-device Chrome | WebdriverIO + Appium UiAutomator2 | [Android testing](references/android-testing.md) |

Supertest checks HTTP, not a native client. Skip it when the feature has no HTTP boundary. React Native, Flutter and Tauri follow their actual runtime platform and accessible controls, not their development preview. Browser emulation, native simulators/emulators and physical devices are distinct targets.

Check the build, startup command, test credentials, isolated data, backend reachability and selected toolchain. For Appium, check compatible server/driver/client versions and the driver's doctor command before creating a session; use a project-local WebdriverIO setup, not a new universal runner. Install only the needed driver. Keep environment-specific paths and device identifiers in local config or environment variables.

Use a dedicated simulator/emulator or test device. Existing permission to run local tests does not authorize erasing personal app data, changing signing credentials, granting system permissions or using production accounts. Explain the specific prerequisite when user action is necessary. Continue independent checks while a target is blocked.

At this point, read [the report template](references/test-report-template.md), select the report path and start collecting evidence. A readiness failure still gets a report.

**Done when:** each target has an executable command and known test environment, or a recorded blocker.

## 3. Exercise real behavior

Write and run one case at a time. Use existing package-manager and runner conventions. Keep tests in the target project, not this skill's directory.

- Assert business outcomes through public interfaces. Expected values come from requirements or independent examples, not a copy of the implementation.
- Exercise the real user route or installed app. Where persistence matters, read back through the public API, reload the page or relaunch the app without resetting its data.
- Use real internal services and storage for the declared end-to-end journey. External services may use a sandbox or boundary substitute; document that boundary. Tests intercepting the application's own API are isolated UI checks, not full-stack evidence.
- Isolate users and data per case or worker. Clean only task-owned data and stop only processes or sessions started by the task, including after failures. Avoid shared-state parallelism until isolation is established.
- Preserve actual commands, exit codes, outputs and relevant UI captures. Screenshots supplement assertions. Never substitute a mockup or generated terminal image for execution evidence.

Add permission denial/recovery, deep links, background/foreground transitions, keyboard interaction, offline recovery or restart persistence only where the feature requires them. Missing UI semantics call for accessibility identifiers or suitable platform tooling, not blind coordinate clicks reported as a reliable test.

**Done when:** each attempted case has observed output, and every required unexecuted case has a status and reason.

## 4. Repair and retest

Classify a failure before editing: test defect, environment blocker or product defect. Preserve the failing scenario and evidence first. Repair test setup against the original acceptance criterion, not against whatever the product currently returns.

For product defects, if available, **call the Skill tool with "diagnosing-bugs"**. Pass the existing report path, its format and evidence directories, task/case IDs, acceptance scope, tested build and original failing output. Ask it to append repair findings to that report and return for acceptance retesting. Existing failure evidence can establish its feedback loop; it need not manufacture another failure. Do not invoke `e2e-testing` recursively.

If that skill is unavailable, keep the same minimum discipline: reproduce the exact failure, form a falsifiable cause, test it, make the smallest in-scope repair, and rerun both the failing case and the original journey. Preserve a regression check at the correct public boundary.

Fix one cause at a time. Do not remove assertions, skip required cases, broaden mocks or change requirements to obtain green output. Stop dependent repair work when requirements conflict, access is missing, the fix exceeds the agreed scope, or repeated attempts produce no new evidence. Record the blocker and the next concrete action; continue unaffected checks.

Distinguish an unchanged test passing on retry (flaky) from a new run after an actual repair. Investigate flakes with a focused reproduction, not an unlimited retry loop. Rerun affected existing suites after fixes; broaden testing only for changed behavior or remaining concerns.

**Done when:** defects are verified fixed or explicitly unresolved, and retest evidence identifies the version it tested.

## 5. Deliver the acceptance report

Finish the single report according to its template. Report per-platform outcomes before the aggregate conclusion. A required failed, blocked, skipped, unexecuted or unresolved flaky check prevents an unqualified pass. A completed report may describe an incomplete acceptance run.

Verify that counts describe cases rather than retry attempts, links resolve from the report directory, images decode and display legibly, and retained evidence contains no secrets. Exclude auth state files and unsafe raw traces. If preview or runtime verification is unavailable, state the exact limit.

Link the report in the final response, state what actually ran and name remaining blockers. This skill does not publish artifacts, deploy code, perform store submission, certify signing/notarization or launch a performance/security audit. Those require their own task scope.
