## What it does

`implement-spec` takes a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) and its [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) and lands the whole thing in one run. The orchestrating [agent](https://www.aihero.dev/ai-coding-dictionary/agent) hands each ticket to an implementer [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) working in its own git worktree, merges each finished branch into a single **integration branch**, verifies affected journeys with [e2e-testing](https://aihero.dev/skills-e2e-testing), and runs [code-review](https://aihero.dev/skills-code-review) over the result. Tickets close only after required verification and review findings are resolved.

It reads the tickets as a **task graph**, not a list. Blocking edges decide what can start, so at any moment there is a **frontier** of tickets whose blockers have all landed, and every ticket on the frontier runs at once. That is the difference from working the tickets one by one: the graph's shape, not its order on the tracker, sets the pace.

## When to reach for it

You invoke this by typing `/implement-spec`, and the agent won't reach for it on its own.

| Your situation | Reach for |
| --- | --- |
| A spec, split into tickets with blocking edges, that you want landed in one run | `/implement-spec` |
| One ticket at a time, in your own [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) between tickets | [implement](https://aihero.dev/skills-implement) |
| A spec that isn't split into tickets yet | [to-tickets](https://aihero.dev/skills-to-tickets) first |
| A small piece of work with no real graph to it | [implement](https://aihero.dev/skills-implement) directly |

## Prerequisites

- **An issue tracker.** The skill reads the tickets from, and resolves them on, the tracker [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) configured. If none has been configured, it stops and tells you to run that first rather than guessing.
- **Tickets with blocking edges**, as [to-tickets](https://aihero.dev/skills-to-tickets) writes them. Without edges the graph is flat and every ticket starts at once.
- **A [harness](https://www.aihero.dev/ai-coding-dictionary/harness) that runs subagents in the background and gives each one a git worktree.** The concurrency is the point; a harness that runs subagents one at a time gets a slower `implement`.

## The integration branch

Everything lands on one branch. Each implementer:

1. confirms its worktree is based on the integration branch before it starts,
2. builds its ticket with [tdd](https://aihero.dev/skills-tdd), red-green one slice at a time,
3. merges the integration branch tip into its own branch before reporting done, so landing it is a fast-forward.

Whether a pull request exists at all is the tracker's call. If your tracker closes work through PRs, or you ask for one, a draft PR opens after the first merge and is marked ready after required acceptance and review pass. Otherwise a successful run stops on the integration branch with every ticket resolved the way your tracker closes work, which works fully offline against a local markdown tracker.

Implementers talk to the orchestrator through [context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer) (the spec, the ticket, shared exploration notes, earlier commits) rather than pasted summaries, which keeps each subagent's prompt small and the orchestrator's window free for the graph.

## Acceptance belongs to the integrated feature

Each implementer runs its focused checks and reports missing verification. The orchestrator runs the applicable full suite and accepts the combined feature after all ticket implementations land. It owns one report under `docs/test-reports/`, so separate tickets do not each start a whole-spec E2E run.

| Combined change | What runs |
| --- | --- |
| HTTP behavior, web interaction, native functionality or a user-visible fix | E2E for affected journeys and the spec's required targets |
| Documentation, formatting or internal refactoring without observable behavior changes | Appropriate existing checks; new E2E only if agreed criteria require it |
| Required skill, device, account or tooling missing | A blocked report; the draft PR and affected tickets stay unresolved |

Acceptance fixes are committed before review. Review fixes are merged back and checked on the integration branch; changes affecting behavior trigger focused E2E retests in the same report. The report retains earlier failures and identifies which revision was tested. A saved branch or completed report is not proof that acceptance passed.

## Common questions

**How is this different from running `/implement` on each ticket myself?**

This is the question the skill exists to answer. Before it shipped, people kept building their own versions, and one user described the itch exactly: they wanted "subagents implement the tickets" instead of having "to individually create new session and tell them to implement a ticket one by one, when a spec may contain over 5 tickets." With `implement` you are the dispatcher: one [session](https://www.aihero.dev/ai-coding-dictionary/session) per ticket, clearing in between, and keeping track yourself of which tickets are unblocked. `implement-spec` hands that job to one orchestrating session. The price is that you no longer read each ticket's work as it lands; you review the integration branch at the end. To start a run, clear the context and type `/implement-spec` with a pointer to the spec (an issue number or a file path). For a small change with no real graph, skip it and use `implement` directly.

**Does it need GitHub? I want it to stop at the branch.**

No, not any more. One user who liked the in-progress version had exactly this complaint: "it creates a PR at the end, which requires an online repository like GitHub. I wish it could do the same work offline and stop at the branch where all the work is merged." The goal is now the integration branch. A PR opens only when the configured tracker closes work through PRs or you ask for one, so on a local markdown tracker a successful run ends with tickets resolved and work merged on the branch. Required verification blockers leave affected tickets unresolved.

**Its review and fix loop ran for hours, or kept "fixing" tickets that hadn't been built yet.**

Both come from `code-review` running outside the one slot the skill gives it. It compares the code against the whole spec, so it only makes sense once every ticket has landed; run it mid-run and every unbuilt ticket reads as a failure, the agent sets about building it, and that triggers another review. At the end, the skill runs `code-review` once and sends its in-scope findings to one fix subagent. It then verifies those findings with focused checks and reruns affected acceptance cases in the existing report, rather than automatically starting another broad review. Unresolved findings or failed required checks prevent close-out.

**Does it drive tdd like implement does?**

It does now, though it didn't at first. Users running the in-progress version noticed that "the implementer subagents don't inherit the /tdd directive", so red-green dropped out the moment they scaled up from one ticket to a whole spec. Each implementer now builds its ticket with `tdd`. There is still no step where seams get agreed interactively, as there is in an `implement` session, so name the seams in the spec or the tickets if you want them pinned.

**Two implementers running in parallel collided on the same file, or picked different names for the same thing.**

Worktrees don't remove collisions; they postpone them to merge time. A blocking edge written from ticket text is a guess about which files each ticket will touch, and two tickets on "different parts of the codebase" still share a message catalogue, a config registry, or a type. Each implementer sees only its own ticket and the shared notes, never the other's work in progress, so one user's web and mobile tickets added the same string as `blockedSince` and `blockedOn`. When two frontier tickets touch one shared surface, either add a blocking edge between them so they run one after the other, or have the exploration notes fix the exact names each ticket adds.

**Blocked tickets never start, even after their blocker has merged.**

A known rough edge on GitHub. The tracker's blocked-by count only drops when a blocker *closes*, and tickets typically close when the PR merges, which is the end of the run. The tracker is the right source for the starting graph but a stale one mid-run. Tell the orchestrator to track which tickets have merged into the integration branch itself and compute the frontier from that.

**Does this replace Sandcastle or an AFK script?**

No. People ask because the skills now reach into implementation: "is Sandcastle still relevant? Your skills now seem to be able to handle implementation as well." `implement-spec` puts an agent in charge of orchestration inside one harness session, which needs no infrastructure and lets you watch and steer. For work that is truly [AFK](https://www.aihero.dev/ai-coding-dictionary/afk), a deterministic loop ([Sandcastle](https://github.com/mattpocock/sandcastle), a shell script, a CI job) is faster, cheaper, and more reliable, because no part of the orchestration can wander off.

**A ticket's key test was skipped inside its worktree, and it reported green.**

A worktree holds only what git tracks. Tests that read gitignored fixtures, local databases, or credentials can skip themselves there silently. Report missing prerequisites explicitly and arrange the required fixtures or credentials in the authorized integration test environment. A skipped required case cannot count as acceptance passed, and the workflow must not switch to an unrelated checkout and validate a different build.

## It's working if

- Several implementers are running at once whenever the graph allows, not one after another.
- A ticket starts as soon as its last blocker lands on the integration branch, not when the whole run ends.
- Every ticket's trace shows `tdd` running, with a failing test before the code.
- Merges into the integration branch are fast-forwards, not conflict resolutions.
- When E2E is required, one integration report shows the journeys, targets and review-triggered retests.
- Required skipped or blocked checks keep the PR draft and affected tickets open.
- A successful run ends on one branch with tickets resolved, and a PR only if your tracker wanted one.

## Where it fits

`implement-spec` is the build step of the main chain, as the parallel alternative to running [implement](https://aihero.dev/skills-implement) once per ticket:

```txt
grill-with-docs → to-spec → to-tickets → implement-spec → retro
```

Its neighbours are [to-tickets](https://aihero.dev/skills-to-tickets), which declares the blocking edges it reads as a task graph; [e2e-testing](https://aihero.dev/skills-e2e-testing), which accepts the integrated feature; and [code-review](https://aihero.dev/skills-code-review), which reviews the committed result before close-out. [ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set when you are not sure which flow you are in.
