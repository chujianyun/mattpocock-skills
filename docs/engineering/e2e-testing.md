## What it does

`e2e-testing` verifies an implemented feature through its HTTP interfaces and actual web or native UI, repairs defects within the agreed scope, and writes one Markdown acceptance report. An overall pass requires observed business outcomes on every required target; a passing API, desktop browser or simulator cannot stand in for another target.

The skill preserves existing test infrastructure. When none exists, it uses Supertest for HTTP, Playwright for web, and WebdriverIO with the appropriate Appium driver for native macOS, iOS and Android. Platform details load only when needed.

## When to reach for it

Type `/e2e-testing`, or the agent reaches for it automatically when a task fits. Use it when a feature has runnable behavior and you want to verify what a user can actually accomplish.

| Your situation | Where to go |
| --- | --- |
| Validate a feature's API and user journey | This skill |
| Check the same feature on web, macOS, iOS or Android | This skill, with required platforms stated |
| Build a new behavior test-first | [tdd](https://aihero.dev/skills-tdd) |
| Diagnose a specific known defect | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |
| Review a diff against standards and a spec | [code-review](https://aihero.dev/skills-code-review) |

## Prerequisites

Execution needs the target application or build, suitable test tooling, test identities/data and a writable project directory. Native Apple testing needs an appropriate macOS/Xcode runner; Android needs its SDK and a usable emulator or device. Real devices may require signing, trust or permissions already configured by their owner.

Missing prerequisites produce a blocked target in the report. They do not prevent independent targets from running. The skill needs neither an issue tracker nor a particular browser MCP server.

## Acceptance follows the target

| Target | Default when the project has no suitable tests |
| --- | --- |
| HTTP backend | Supertest with an existing Node test runner |
| Desktop web and mobile web emulation | Playwright Test |
| Electron on macOS | Playwright Electron, whose support is experimental |
| Native macOS | WebdriverIO + Appium Mac2 |
| Native iOS and physical-device Safari | WebdriverIO + Appium XCUITest |
| Native Android and physical-device Chrome | WebdriverIO + Appium UiAutomator2 |

XCTest, Espresso, Maestro, Detox and Flutter integration tests can remain in place. React Native, Flutter and Tauri are tested according to the actual app runtime and available native controls. An application with no HTTP backend needs no Supertest setup.

Mobile web emulation, native simulators/emulators and physical devices are separate evidence categories. A browser preview does not validate a packaged app's native shell. Functional acceptance also does not certify store submission, signing, notarization, performance or every possible device.

## One report, including repairs

The report lives in the tested project's `docs/test-reports/`, with local, relative links to screenshots and sanitized evidence. It maps acceptance criteria to cases and platforms, records the tested build, shows actual commands and outcomes, and names unverified work. Counts distinguish cases from retry attempts and repairs from unchanged retries.

Product defects enter the `diagnosing-bugs` repair loop when that skill is available. The caller's report is reused, so reproduction, repair and acceptance retesting stay together. When an implementation workflow calls this skill, it supplies the agreed criteria and required targets; review-triggered retests continue that report on the changed build. The caller owns commits, review and task close-out. A standalone bug-fix task still uses its own bugfix report. If the repair skill is unavailable, a small reproduction, diagnosis, repair and retest loop remains available here.

## Common questions

**The API tests pass. Why is the feature still incomplete?**

A service can work while its UI remains a stub. Acceptance must drive the real route or installed app and assert the business result, including persistence when relevant. An isolated development page or a skipped browser case does not establish that a user can complete the journey. This is the failure described in [issue #397](https://github.com/mattpocock/skills/issues/397).

**Does an iPhone profile in Playwright prove the iOS app works?**

No. It emulates aspects of a mobile browser. Native iOS needs a native app run, and simulator success does not establish physical-device behavior. The report keeps those results separate and names the untested targets.

**Will it fix failures or only list them?**

It fixes defects within the agreed acceptance scope, preserving failure evidence and rerunning affected checks. Missing access, ambiguous expected behavior and out-of-scope repairs remain explicit blockers. Required skipped, blocked, unexecuted or unresolved flaky cases prevent an unqualified pass; a finished report can still describe incomplete acceptance.

## It's working if

- Tests drive the real user entry point and check the resulting business state.
- The report names the exact platforms and device classes exercised.
- A repaired defect has both original failure evidence and a later passing run.
- A blocked device or flaky case stays visible instead of disappearing into a green total.
- You receive one report whose commands and local attachments let you inspect what actually happened.

## Where it fits

`e2e-testing` works independently and as a conditional acceptance step in [implement](https://aihero.dev/skills-implement) and [implement-spec](https://aihero.dev/skills-implement-spec). Changed HTTP, web or native behavior and user-visible fixes trigger it; documentation and behavior-preserving refactoring use appropriate existing checks unless the agreed criteria require E2E. Whole-spec implementation accepts the integrated feature once the tickets have landed, then retests affected cases after review fixes. [tdd](https://aihero.dev/skills-tdd) supplies the development feedback loop; [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) supplies deeper repair discipline when acceptance exposes a defect. [ask-matt](https://aihero.dev/skills-ask-matt) routes feature-verification requests here.
