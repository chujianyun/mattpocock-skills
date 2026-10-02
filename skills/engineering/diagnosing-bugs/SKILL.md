---
name: diagnosing-bugs
description: Diagnose bugs and performance regressions; deliver Markdown reports for repair tasks. Use for requests to debug or fix a specific failure, not general code explanations or proactive audits.
---

# Diagnosing Bugs

A discipline for bugs, especially hard ones. Skip phases only when explicitly justified; a small fix does not waive the report requirement.

When exploring the codebase, read `GLOSSARY.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Redact

This skill has you show commands, outputs and captured artifacts. **Redact every secret first**: write `<REDACTED>` in its place. Build loops against env vars, so the credential stays in the environment rather than in what you show. Captured artifacts carry auth headers: quote only the lines that carry the signal.

If the redacted output is not enough to diagnose the bug, say so and ask the user.

Apply the same redaction to report text, screenshots, and retained evidence files before saving them. Hide credentials and private data without hiding the failure signal; never retain an unredacted copy alongside the report.

## Required repair deliverable

Every bug-fix task handled by this skill delivers **one Markdown test report**, including small fixes, failed verification, and blocked repair attempts. Multiple bugs in one task share a report with separate bug IDs. Pure consultation without a repair task needs no report; this rule does not impose reporting on other skills.

At the start of a repair task, choose a unique report name and collect evidence throughout the loop. Save the report in the **project being repaired**, at `docs/bugfix-reports/<YYYYMMDD-HHmmss>-<task-slug>-测试报告.md`, in Chinese unless the user requests another language. Store any screenshots in `docs/bugfix-reports/assets/images/<report-stem>/`, where `report-stem` is the report filename without `.md`, and embed them with Markdown paths relative to the report. Do not create an empty image directory or overwrite another task's report. Read [the report template](references/test-report-template.md) when first writing the report, including when stopping early. Small fixes can use brief entries under its six headings; do not expand the work just to fill the template.

The report records actual execution, not planned success. Distinguish passed, failed, blocked, and not-run checks, separate new regression checks from existing suites, and derive counts and timings only from observed output. Screenshots supplement assertions; they do not prove a test passed. If work stops early, save the evidence and blocker in the report before handing back to the user. An inaccessible output directory is a delivery blocker to disclose, not permission to claim completion.

## Phase 1: Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug (one that goes red on _this_ bug), you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one, in roughly this order

1. **Failing test** at whatever seam reaches the bug: unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) that drives the UI and asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop is still structured. Captured output feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight, a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not, so keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a redacted captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

For a repair task, save a blocked report with the attempts and missing prerequisites before stopping. Do not label an unexecuted check as passed.

### Completion criterion: a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** (a script path, a test invocation, a curl) that you have **already run at least once** (show the invocation and its output, redacted), and that is:

- [ ] **Red-capable**: it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring"; it must be able to _catch this specific bug_.
- [ ] **Deterministic**: same verdict every run (flaky bugs: a pinned, high reproduction rate, per above).
- [ ] **Fast**: seconds, not minutes.
- [ ] **Agent-runnable**: you can run it unattended; a human in the loop only via `scripts/hitl-loop.template.sh`.

If you catch yourself reading code to build a theory before this command exists, **stop: jumping straight to a hypothesis is the exact failure this skill prevents.** No red-capable command, no Phase 2.

## Phase 2: Reproduce + minimise

Run the loop. Watch it go red as the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described, not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Capture before evidence

Before editing the code, preserve the original failing command and its actual output. For a visible UI bug, capture the failing state when the application is accessible and screenshot tooling is available. Note the steps, test data, role, viewport, and tested revision or working-tree state so the same scenario can be repeated after the fix. Use an available browser or native-app capture tool appropriate to the application.

For API, CLI, or performance bugs without a meaningful visual state, retain real responses, output, or measurements instead. If a screenshot is inapplicable, tooling is unavailable, or the before state was already lost, explain that in the report. Never fabricate a screenshot or revert user work to recreate one.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut, and keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 (fewer moving parts left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing**: removing any one of them makes the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3: Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe: discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it; proceed with your ranking if the user is AFK.

## Phase 4: Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5: Fix + regression test

Write the regression test **before the fix**, but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

Record the actual after results, including failures. For UI bugs with capture access, take an after screenshot using the same scenario, data, role, and viewport where possible; disclose material differences. Pair it with the before evidence under the same bug ID. A missing before screenshot does not prevent collecting useful after evidence.

## Phase 6: Cleanup

For repair tasks, distinguish a verified fix from a report documenting a failed or blocked attempt. Before declaring the repair successful:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted (or moved to a clearly-marked debug location), with report evidence preserved
- [ ] The hypothesis that turned out correct is stated in the commit / PR message, so the next debugger learns

Before handing back any repair task, including a failed or blocked attempt:

- [ ] The task's Markdown report is saved, its conclusion matches the observed results, and missing screenshots or regression coverage are explained
- [ ] Every embedded image resolves relative to the report and decodes successfully; if a Markdown preview is available, its display has also been checked for legibility
- [ ] Report text, images, and retained evidence have been checked for secrets and private data

Do not declare report delivery complete without the report or with broken image links. If preview tooling is unavailable, deliver the path- and decode-checked report with an explicit visual-verification limitation; do not claim its rendering was verified. In the final response, link the report and state the repair result and any remaining blockers. Pure consultation does not enter this repair-delivery checklist. Report files and evidence are local deliverables; this skill does not authorize publishing them.
