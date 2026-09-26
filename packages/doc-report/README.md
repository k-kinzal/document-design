# doc-report

GitHub Actions that explain a code change as a paper: one self-contained HTML
page, typeset with doc-ui, that says what changed in intent, behaviour and
structure, what it means for users, and what could not be verified. The text
is written by GitHub Copilot CLI under the caller's own `GITHUB_TOKEN`; the
page, its links, its stylesheet and its provenance are assembled by
deterministic code and validated before upload.

Three entry points share one generator:

| Action | `uses:` | Job |
|---|---|---|
| Root | `k-kinzal/document-design@report-v1` | Push, pull request or explicit range: generate, validate, upload |
| Release | `k-kinzal/document-design/actions/release@report-v1` | Resolve a tag range (explicit base or the previous stable `vX.Y.Z`) and generate |
| Publish | `k-kinzal/document-design/actions/publish@report-v1` | No model: upsert one pull request comment, or attach the HTML to a release |

Pin `uses:` to the full commit SHA of a `report-vX.Y.Z` tag in production.
`report-v1` is the compatible-major alias; `vX.Y.Z` tags are the product
stylesheet and are unrelated.

## What you get

- **A report, not a changelog.** The page leads with a before/after claim,
  then sections for intent, behaviour, structure, impact and verification,
  each citing the files and commits it rests on. Findings are marked
  verified, inferred or unverified. Test results that were not supplied are
  reported as unverified, never assumed.
- **One HTML file.** The doc-ui stylesheet is embedded; no CSS, fonts,
  scripts or network are needed. It opens from `file://`, prints, follows
  the reader's light or dark theme, and carries `lang="en"` or `lang="ja"`.
- **Evidence you can check.** An evidence section lists the commits and
  files compared, with links into the repository, and a caveat naming
  anything the model did not read. A provenance section records the
  comparison rule, the generator revision, the model requested and used, the
  prompt version, the CLI version and the run.
- **A manifest.** A JSON record of the same facts, uploaded beside the HTML.
  It is a record, not a signed attestation.

## Requirements

- A GitHub-hosted or self-hosted runner with Node.js 22 or newer on `PATH`
  (`actions/setup-node` with `node-version: 24` is the tested setup) and
  `git`. The action installs the pinned Copilot CLI into the runner's temp
  directory; it does not install anything into your repository.
- `permissions: copilot-requests: write` on the generating job, and a token
  Copilot accepts. With `${{ github.token }}` on a personal repository the
  owner's Copilot seat is used; in an organization the policy "Allow use of
  Copilot CLI billed to the organization" must be on. The action does not
  fall back to any other provider, and it does not promise free or unlimited
  generation: Copilot usage is metered by GitHub.
- A checkout with full history (`fetch-depth: 0`) and, for release ranges,
  tags.

## Reading the report

The HTML artifact is uploaded without zipping (`archive: false`), so the
link in the Job Summary or pull request comment opens the page in the
browser. Viewing needs a GitHub sign-in and read access to the repository,
and the link stops working when the artifact expires (`retention-days`,
default 30) or is deleted. A release asset is the long-term copy: it is a
download, and the browser preview is not promised for it.

## Modes and how the range is chosen

| Mode | Base → head | Notes |
|---|---|---|
| `push` | `github.event.before` → `after` | All commits in the push. A created ref starts from the empty tree and the page says so. A deleted ref is skipped. A force push compares the old tip with the new tip and notes the rewritten history; if the old tip is unavailable the action fails rather than guessing a parent. |
| `pr` | merge-base(target base, head) → `pull_request.head.sha` | The whole pull request, not the last push. The merge SHA is never used. An ambiguous merge base needs an explicit `base`. Description, comments and referenced issues are collected as evidence, with caps. Fork pull requests are skipped. |
| `range` | `base` → `head` | Two trees compared directly. Annotated and lightweight tags peel to commits; non-ancestors are compared anyway and the note says so. |
| release | explicit `base`, else previous stable → `head` | `head` comes from the input, the release event or the pushed tag. The previous stable release is the highest `vMAJOR.MINOR.PATCH` tag below the head whose commit is an ancestor of it; `v1`, `v1.2`, `report-*` and pre-releases are never candidates. With no earlier stable tag the release is described from the empty tree (`initial-release: full`) or refused (`error`). A stable tag that exists only on other history is not an initial release: give `base` explicitly. |

Refs are resolved to commit SHAs once at the start and fixed for the run.
The action's own code is resolved from where it was checked out; the analysed
repository is `repository-path`. They can be different checkouts, which is
how tags older than the action are compared.

## Inputs

| Input | Default | Meaning |
|---|---|---|
| `github-token` | `${{ github.token }}` | API and Copilot authentication. Never written to logs, HTML or the manifest. |
| `repository-path` | `.` | The checked-out repository to analyse. |
| `mode` | `auto` | Root only. `auto` recognises branch pushes and `pull_request` events; anything else must say `push`, `pr` or `range`. |
| `base`, `head` | | Explicit refs. `range` needs both. |
| `pr-number` | | Root only; needed for `pr` outside a pull request event. |
| `language` | `en` | `en` or `ja`. The page and its summaries follow it. |
| `title` | built from the repository and revisions | Page title. |
| `instructions` | | Extra guidance for the model. Safety, grounding and output rules cannot be overridden by it. |
| `model` | `auto` | Copilot model name. The models actually used are read back from the CLI and recorded. |
| `report-id` | `default` (`release` for the release action) | Namespace for several reports on one pull request or run; letters, digits, `-`, `_`. |
| `retention-days` | `30` | Artifact retention, 1–90. |
| `timeout-seconds` | `600` | Total time for generation, including retries; child processes are stopped. |
| `max-input-bytes` | `200000` | UTF-8 budget for everything the model reads. |
| `max-attempts` | `2` | Generation attempts including the first. Authentication, access and quota errors are not retried. |
| `on-empty` | `report` | `report` renders a page saying nothing changed; `skip` uploads nothing. |
| `base-strategy` | `previous-stable` | Release action. |
| `initial-release` | `full` | Release action: `full` or `error`. |

Values are checked at the start: unknown enums, out-of-range numbers, unsafe
refs and report ids stop the action before anything runs.

## Outputs

```text
status                 complete | partial | empty | skipped | failed
has-changes            true | false
report-path            HTML path inside the generating job
manifest-path          manifest path inside the generating job
artifact-id            HTML artifact id
artifact-url           HTML artifact URL from upload-artifact
manifest-artifact-id   manifest artifact id
base-ref / head-ref    the refs as given or resolved for display
base-sha / head-sha    resolved commits; base-sha is empty for the empty tree
base-tree              the tree the comparison starts from
run-url                this workflow run
reason                 why the report was skipped or failed
```

`complete` means everything the evidence rules admit was read. `partial`
means diffs or hunks were dropped for the byte budget, size or count caps;
the page lists what was left out. Binary files, lockfiles and generated
outputs are always listed by name and never read; that does not make a
report partial, and the evidence section says which ones they were.
`failed` is a generation or validation failure: the action exits non-zero,
records its outputs and summary, and uploads nothing. `skipped` uploads
nothing and shows no artifact link.

## What the model can and cannot do

Evidence is collected by trusted code before the model runs: commits,
changed files with counts, unified diffs split by hunk, and for pull
requests the description, comments and referenced issues. It is passed to
Copilot CLI as data between delimiters; the analysed repository's
`AGENTS.md`, Copilot instructions, hooks, plugins and MCP servers are never
loaded. The CLI runs in an empty directory of its own with a private home,
an allowlisted environment, `--no-custom-instructions`, built-in MCP servers
off, and shell, write and URL tools denied. Prompts over 100 KB are written
to that directory and read from there.

The model returns JSON: a title, a before/after claim, sections, findings and
migration steps. Every string is capped and must be plain text; every
citation must be a changed file path or a listed commit, or the answer is
rejected and asked for again with the validator's reasons. The renderer
builds all links itself. The finished page is parsed with parse5 and checked
against an allowlist (no scripts, handlers, frames, forms, external
resources, non-`https:` links or free-form styles) and carries a
Content-Security-Policy meta tag. A page that fails is not uploaded.

## Pull request comments

`actions/publish` with `target: pr` posts one comment per report id, marked
`<!-- document-design:report:<id> -->`, and updates it on later runs. It
only edits comments posted by `comment-author` (default
`github-actions[bot]`); a comment by anyone else carrying the same marker is
left alone. Before writing it re-reads the pull request: a report for a head
the pull request has moved past is not posted, and a re-run of an older run
never overwrites a newer report for the same head. When generation failed,
the comment says so for that head, links the workflow run, and keeps the
previous successful link with its head SHA (marked expired or deleted when
the API says so). It never invents a success link.

The publisher reads the source run, its artifacts and the manifest through
the API and checks them against each other; the manifest alone never
decides where to post. It accepts runs from the same repository only. The
example workflow serialises publishing per pull request and report id with
a `concurrency` group; the head check narrows, but does not remove, the
window between check and write.

## Releases

`actions/release` generates; it does not create, publish or edit releases.
`actions/publish` with `target: release` attaches the HTML as
`document-design-<report-id>-<tag>.html` to the release for `release-tag`.
By default a release must exist; `create-draft: true` creates a draft for
an existing tag. Tags are never created and drafts are never published.
The notes get one marked block with the asset link, the artifact preview
link, the compared SHAs and the status; the rest of the body is preserved.

Attaching is idempotent: the same digest is reused, a different one under
the same name is a conflict unless `replace-assets: true` on a draft or
mutable release. Published immutable releases cannot take assets; the
publish step fails with that message and the artifact link in the run
remains. The safe order is: tag → generate → attach to the draft → publish.
See `examples/release-pipeline-step.yml`.

## Examples

Complete workflows are in [`examples/`](examples/):

- `main-push-report.yml` — every push to the default branch, plus manual ranges.
- `pr-report.yml` — pull request report with an updatable comment, fork and draft skips explained.
- `manual-range-report.yml` — compare any two tags or commits by hand.
- `tag-push-report.yml` — report only, on product tag pushes.
- `prepare-release-report.yml` — compare a tag with its previous stable release and attach to a draft.
- `release-published-report.yml` — report only, on `release: published`.
- `release-pipeline-step.yml` — the report inside an existing release pipeline.

This repository's own [`report-main.yml`](../../.github/workflows/report-main.yml)
runs the unreleased action from each main commit, and
[`report-release.yml`](../../.github/workflows/report-release.yml) compares
product tags with the action code checked out from main.

## Permissions

| Job | Permissions |
|---|---|
| push, range, release generation | `contents: read`, `copilot-requests: write` |
| pull request generation | plus `pull-requests: read` |
| pull request comment | `actions: read`, `pull-requests: write` (and `contents: read` when needed) |
| release asset | `actions: read`, `contents: write` |

The generating job never has write access to comments or releases; the
publishing job never runs a model or the repository's code.

## Develop

```sh
npm run build:report            # doc-ui dist + this package's dist/
npm run check --workspace doc-report   # unit and contract tests, no Copilot needed
npm test --workspace doc-report        # browser checks (file://, no JS, en/ja, widths, themes, print)
node packages/doc-report/tests/fixtures/dry-run.mjs --base=v1.0.0 --head=HEAD --language=ja
```

`dist/` is committed so a `uses:` checkout runs without an install step.
A test compares it with a fresh build; it never rewrites it. The Copilot CLI
version is pinned in `src/version.mjs`; updating it means running the unit
tests, then a real main push, and noting the version in the release notes.
Unit tests use a fake CLI; their output says nothing about real generation
quality, which is only checked by real runs.

The dry run uses the same fake CLI. To exercise the real CLI locally you
need a Copilot-enabled fine-grained token or `gh auth` session; the action
itself is designed for `GITHUB_TOKEN` inside Actions.
