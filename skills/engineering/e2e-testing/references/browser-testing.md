# Browser acceptance

Use Playwright Test for repeatable browser cases. Browser tools or MCP can help explore a page, but a manual interaction does not replace the saved automated case. A specific MCP server is not required.

## Setup and scope

Reuse Playwright config, fixtures, projects and package scripts. With no setup, add the smallest `@playwright/test` configuration and Chromium project. Extend the browser/device matrix only for required compatibility targets. Use the actual application route and matching backend build, not a test-only page that avoids the delivered UI.

Start a task-owned server through the project's lifecycle or Playwright `webServer`; check readiness and identity before reusing a running server. A stale server can make a fixed build look broken or a broken build look fixed.

Label Playwright device profiles as **mobile web emulation**. They do not execute iOS or Android native apps or certify physical-device browser behavior. Read the iOS/Android reference for required real-device web tests.

## Outcomes, locators and waiting

Prefer role and label locators; use a stable test ID when semantics do not identify the control. Narrow ambiguous matches using business context. Extract page objects only for existing conventions or meaningful repetition.

Use awaited web-first assertions for visible outcomes. Register event/response waits before the action that triggers them:

```typescript
const savedResponse = page.waitForResponse(response =>
  response.url().endsWith('/api/notes') &&
  response.request().method() === 'POST'
);
await page.getByRole('button', { name: 'Save' }).click();
expect((await savedResponse).status()).toBe(201);
await page.reload();
await expect(page.getByText('Acceptance note', { exact: true })).toBeVisible();
```

Assert the user-visible result even if a network assertion passes. Fixed sleeps and generic `networkidle` waits are not readiness checks. Use a specific state or bounded polling instead. Keep real application API calls in full-stack journeys; label mocked API cases as isolated UI coverage.

## Auth, data and evidence

- Reuse auth state for non-login cases, isolating roles and mutable accounts per worker. Exercise real login when it is an acceptance criterion. Keep state files out of version control and report attachments.
- Create fixtures through existing APIs where appropriate, but exercise the UI action under test through the UI. Clean task-owned data even on failure.
- Capture meaningful result states and UI failures when accessible. Configure failure screenshots and traces using the installed Playwright version. Use synthetic accounts; traces may contain credentials even when screenshots are masked. Retain only sanitized evidence, or explain why a raw trace is omitted.
- Preserve the first failure when a retry passes. Report it as flaky until investigated; skipping/quarantining a required case leaves an acceptance gap.
- Use runner JSON/JUnit output when already available and HTML reports as optional supporting artifacts. The Markdown acceptance report remains the deliverable.

## Electron

Playwright's `_electron` support is experimental. Use the actual Electron build/entry point and await the intended window. A renderer assertion does not verify a native menu, permission prompt, file dialog or OS integration. Record any native API stubs as a coverage boundary and use native tooling for required OS behavior. Close only the Electron instance launched by the test. Read the macOS reference for build identity and native testing prerequisites.

Primary references: [best practices](https://playwright.dev/docs/best-practices), [emulation](https://playwright.dev/docs/emulation), [authentication](https://playwright.dev/docs/auth), [retries](https://playwright.dev/docs/test-retries), [Electron](https://playwright.dev/docs/api/class-electron).
