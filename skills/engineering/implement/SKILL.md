---
name: implement
description: "Implement agreed work, verify affected user journeys, and review the changes."
disable-model-invocation: true
---

Implement the work described by the user in the spec, tickets or agreed conversation plan. Preserve that scope and its acceptance criteria. Record the starting commit as the review base unless the user supplied another fixed point; keep unrelated work out of task commits.

Call the Skill tool with "tdd" where possible, at pre-agreed seams. Run typechecking and focused tests regularly, then the full applicable test suite once the implementation is ready.

## Accept the affected behavior

Decide from the agreed requirements and the actual diff:

| Change | Acceptance |
| --- | --- |
| Added or changed HTTP behavior, web interaction or native app functionality | Call the Skill tool with "e2e-testing" for the affected journeys |
| A user-visible bug fix | Call the Skill tool with "e2e-testing" for the original symptom and related regression |
| Documentation, formatting or internal refactoring without observable behavior changes | Run appropriate existing checks; no new E2E run unless the agreed criteria require one |

Pass the spec/ticket, acceptance criteria, affected interfaces, required platforms/device classes and tested revision with any uncommitted changes. Reuse this task's report path if one exists. Do not expand to every supported platform or repeat already verified cases on an unchanged build. Let the skill repair in-scope defects and return its evidence; keep one report in the target project's `docs/test-reports/` across repairs and retests.

A missing E2E skill, tool, device or credential is a verification blocker when acceptance is required, not a reason to silently skip it. Record the blocker and continue independent checks. If the skill cannot run at all, record the known criteria and blocked checks in the same report yourself.

## Review and finish

Create a local checkpoint commit of the task changes so review can see them. Call the Skill tool with "code-review", passing the recorded base and spec/ticket or agreed plan; its committed diff must include the implementation and acceptance fixes.

Address in-scope findings, rerun affected checks, and call the Skill tool with "e2e-testing" again if review changes observable behavior or invalidates acceptance evidence. Pass the same report path and affected cases; keep prior failure evidence. Do focused verification of resolved findings rather than automatically restarting a full review loop. Commit remaining task changes.

Report the final revision, review status and report path, or why E2E was not applicable. Identify the tested revision and any later changes; do not imply an older passing run validates changed behavior. Required failed, blocked, skipped, unexecuted or unresolved flaky checks, or unresolved review findings, prevent a completion claim. Work may be saved in commits while acceptance remains incomplete. This flow does not automatically close tickets, push, publish reports or deploy.
