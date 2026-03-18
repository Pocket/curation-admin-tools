---
name: review-loop
description: Iteratively review the codebase and apply worthwhile fixes. Runs parallel reviews (Plan agent + Codex), merges findings, applies high-impact changes, and repeats up to 5 times.
argument-hint: [optional context or goals]
disable-model-invocation: true
---

# Iterative Review & Fix

You are an expert code reviewer and fixer. You will iteratively review the codebase and apply worthwhile changes through multiple review-fix cycles.

User-stated goals/context (if any): $ARGUMENTS

## Step 0 — Pre-flight: detect in-progress work that is not checked in yet

1. **Check for local work in progress**

   * Run `git status --porcelain=v1` and `git stash list`.
   * Treat as "in-progress work" only if:

     * `git status` reports any **tracked** changes (any line not starting with `??`), or
     * `git stash list` is non-empty.
   * If `git status` shows only `??` untracked files, do not block and continue.
   * **Why:** Only tracked changes or existing stashes indicate real in-progress work that can get mixed with review fixes; untracked-only dirtiness is usually unrelated.

2. **If in-progress work exists, pause for confirmation**

   * Ask the user whether to:

     * **Commit first**, then continue, or
     * **Proceed anyway** (warn that fixes will mix with their local work)
   * Continue only after the user explicitly chooses.
   * **Why:** This prevents surprising diffs and keeps the user in control of how their active work is handled.

## Step 1 — Parallel review

Each iteration uses a **review lens** chosen by you (the coordinating agent). Pick the lens that is most likely to surface real issues given what you know so far.

### Review lenses

**Iteration 1 → General** (always). Role: "You are an expert code reviewer." Focus: correctness, logic errors, project conventions (check CLAUDE.md, existing patterns), performance, test coverage gaps, security (OWASP top 10), dead code / unused imports / stale dependencies.

**Iteration 2 → Architectural** (always — a different perspective catches what a general pass misses). Role: "You are a principal software architect reviewing this codebase." Focus on these principles:
- **Principle of least surprise** — APIs, naming, control flow, and error handling should behave the way a reader would expect; flag inconsistent patterns, surprising defaults, and clever-but-confusing code.
- **Separation of concerns** — each module/function/class should have one clear responsibility; flag god objects, mixed layers, and leaky abstractions.
- **Keep it simple** — flag unnecessary abstractions, premature generalization, and over-engineering.

**Iteration 3+ → you decide.** Do not repeat a previous lens — it is unlikely to generate new results. Direct the review at the areas of the code change with the most complexity or the largest surface area of change. State the chosen role and focus explicitly in the review prompt.

Run these two reviews **in parallel** using the Agent tool:

### 1a. Plan agent review

Launch an Agent with `subagent_type: "Plan"`. Compose the prompt yourself by inserting the role and focus areas for the current iteration's lens. The prompt must follow this structure:

> [Role]. Analyze the codebase in the current working directory.
>
> Focus on:
> [Focus areas as bullet points]
>
> User-stated goals: $ARGUMENTS
>
> Return a structured list of issues. For each issue include:
> 1. **File and line(s)** affected
> 2. **Severity**: critical / high / medium / low
> 3. **Category**: correctness, performance, security, convention, testing, cleanup, architecture
> 4. **Description**: what is wrong and why it matters
> 5. **Suggested fix**: concrete change to make

### 1b. Codex review

Compose a single-paragraph version of the same prompt (same role, focus areas, and output format) and pass it to `codex exec`. Escape any shell-special characters (quotes, backticks, dollar signs, etc.) in the prompt string. Run in the background with a **15-minute timeout**:

```
codex exec "[Composed prompt — role, focus areas, user goals, output format]"
```

Use `run_in_background: true` and `timeout: 900000` on the Bash tool call.

**If `codex` is not available:** Inform the user that the core value of `/review-loop` is running **multiple independent AI reviewers** in parallel so their blind spots cancel out. Recommend installing Codex, then **Abort** so they can install Codex first and re-run:

```
npm i -g @openai/codex
```

## Step 2 — Merge, prioritize, and triage

Combine both review outputs into a single deduplicated issue list. Sort by:

1. **Severity** (critical > high > medium > low)
2. **Confidence** that the issue is real (not a false positive)
3. **Impact** (how much harm if left unfixed)

For each issue, decide **objectively** whether to fix it now. Apply these criteria:

- **Impact**: Does this cause bugs, security holes, or user-facing problems?
- **Confidence**: Has the agent provided evidence that the issue is real? If not, ask the agents for evidence in the next round of review, without restricting the agents to issues that lack sufficient evidence; we want all reviews to be thorough.
- **Scope**: Is the fix contained, or does it cascade across many files that are unrelated to the change in this PR / branch?
- **Risk**: Could the fix introduce regressions?

Mark each issue as **FIX** or **SKIP** with a one-line rationale. Lean toward fixing when impact is clear and risk is low. Skip cosmetic or subjective changes unless they violate documented project conventions.

Present the merged list to the conversation as a numbered markdown table:

| # | Severity | Category | File:Line | Description | Worth fixing? |
|---|----------|----------|-----------|-------------|---------------|

## Step 3 — Apply fixes

Create an explicit TODO checklist of all items marked FIX:

- [ ] Issue #N: description (file:line)

Work through each item using the appropriate flow:

### Testable issues (correctness, performance, security)

For issues where the bug or gap can be demonstrated by a test:

1. Read the relevant file(s) to understand context.
2. **Write a failing test** that exposes the issue.
3. **Run the test and confirm it fails** for the expected reason.
4. **Implement the fix.**
5. **Run the test again and confirm it passes.**
6. Check off the item.

### Non-testable issues (convention, cleanup, style, architecture)

For issues like formatting, naming, dead code removal, or architectural refactors where a test is not meaningful:

1. Read the relevant file(s) to understand context.
2. Apply the fix using the Edit tool.
3. Check off the item.

After all items are complete, run `git diff --stat` to summarize what changed.

## Step 4 — Verify

Run the project's full test and lint steps to confirm the fixes don't break anything. Check CLAUDE.md or the Makefile for the correct commands (e.g. `make test`, `make lint`). If any failures are caused by the fixes, address them before proceeding.

## Step 5 — Decide whether to iterate

After iteration 1, assess the **complexity of the code change** to determine how many total iterations to run. Complexity is about the nature of the change, not its size — a 20-line change can be high complexity and a 500-line mechanical refactor can be low.

Ask these questions (each "yes" pushes toward higher complexity):
- Does the change introduce **new failure modes** or error cases (e.g., network failures, race conditions, cache invalidation, partial writes)?
- Does it **cross system boundaries** (e.g., new external dependencies, new IPC, new infrastructure like caches/queues/databases)?
- Does it involve **state or concurrency** (e.g., shared mutable state, distributed state, eventual consistency)?
- Does it **change security or trust boundaries** (e.g., new auth flows, new input surfaces, changed access control)?
- Are the **edge cases hard to enumerate** — could a reviewer plausibly miss a subtle interaction?
- Does the change touch **many files** (>10 non-generated files)?
- Is the change **large** (>300 non-generated lines)?

Score:
- **Low** (0–1 yes): **2 iterations** total. Mechanical changes, simple bug fixes, straightforward feature additions with well-understood patterns.
- **Medium** (2–3 yes): **3 iterations** total.
- **High** (4+ yes): up to **5 iterations**.

**Iteration 1 → always continue** to iteration 2 (architectural review).

**Iterations 2–4 → conditionally continue.** If the current round found issues worth fixing, always continue (fixes may introduce new issues). Otherwise, stop if you have reached the target iteration count for the assessed complexity. Choose the next lens (see Step 1) and state your rationale briefly before returning to Step 1.

**Hard maximum: 5 iterations.** Stop and report regardless.

## Final output

After the last iteration, provide:

1. **Summary of all changes** made across all iterations, ranked by severity (critical first).
2. **Issues intentionally skipped** and why.
3. **Remaining concerns** that need human judgment.
4. A `git diff --stat` of the total changes.

Do NOT commit the changes — leave them unstaged for the user to review.
