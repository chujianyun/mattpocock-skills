---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented and accepted on a single **integration branch**, with tickets resolved the way the issue tracker closes work only after required verification passes.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

**Implementer subagents** should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec and tickets to understand the task graph, acceptance criteria and required platforms/device classes. Record the integration starting commit as the review base unless the user supplies another fixed point.

2. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use **implementer subagents** to implement each ticket, each in its own worktree on its own branch. Each implementer subagent:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket;
   - runs its focused checks and reports skipped or blocked verification explicitly; ticket implementation being ready to merge does not mean feature acceptance passed;
   - leaves the combined feature acceptance and its report to the orchestrator, rather than launching a whole-spec E2E run per ticket;
   - merges the integration branch tip into its own branch before reporting done

5. Once an **implementer subagent** completes, merge its work to the integration branch with a **merger subagent**.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all ticket implementations have landed, run the applicable typechecks and full test suite on the integration branch. If the combined change adds or changes HTTP behavior, web interaction or native app functionality, or fixes a user-visible defect, call the Skill tool with "e2e-testing" on that branch. Pass the spec, acceptance criteria, affected interfaces, required targets and tested revision with any uncommitted changes. Let it repair in-scope defects and keep one report in the target project's `docs/test-reports/`. Reuse the task's existing report if present. Documentation, formatting and internal refactoring without observable behavior changes need appropriate existing checks, not a new E2E run, unless agreed criteria require one. Do not expand acceptance to unrelated platforms.

8. Commit integration changes from acceptance so they are included in review. Call the Skill tool with "code-review" once on the integration branch, passing the recorded base and spec. Address its in-scope findings in a single **implementer subagent**, then merge the fixes back. Rerun affected checks on the integrated result. If the fixes change observable behavior or invalidate acceptance evidence, call the Skill tool with "e2e-testing" again with the same report path and affected cases. Preserve earlier failures and identify the tested revision and later changes. Verify resolved findings with focused checks rather than automatically restarting a broad review loop. Commit the remaining task changes.

9. Required failed, blocked, skipped, unexecuted or unresolved flaky checks, or unresolved review findings, prevent close-out. A missing E2E skill, tool, device or credential blocks required acceptance; record the criteria and blocker in the shared report yourself if the skill cannot run. Continue independent checks and save work, but leave the PR draft and affected tickets unresolved. Report the branch, report path and remaining work. Only after required verification and review findings are resolved, mark an existing draft PR ready, or resolve tickets the way the issue tracker closes work. If no E2E run was applicable, explain why and report the checks that ran.

10. Preserve all needed changes and report evidence before cleaning up **implementer subagent** worktrees, including when acceptance is blocked.
