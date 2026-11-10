# SNITCH eight-system blueprint: technical feasibility and implementation audit

2026-11-05. Evidence-based. Six roles debated it (Principal Engineer, AI/ML, Backend, Automation Architect, Creative Technologist, Senior Product Designer); where they disagreed, the disagreement is recorded. The hands-on test of the video editor was run today on the real project, nothing overwritten; full evidence with commands and outputs in `audit-evidence-video-editor.md` (same folder). Every claim below cites a run, a file or official documentation; where it doesn't, it says "estimate".

**Readiness vocabulary used throughout:** *Code written* → *Functionality tested* (it runs) → *Quality validated* (output judged good against a bar) → *Production ready* (runs unattended for others, with monitoring, recovery and a runbook). Most of what we have sits at "functionality tested" with "quality validated" on specific outputs; nothing is "production ready" yet, including the editor.

---

## 1. The AI video editor: hands-on audit

**Environment (verified).** macOS 26.6 on an M5 Pro with 24 GB; Python 3.12 venv; ffmpeg 8.1.2; vedit 0.4.2; 33 modules, ~11,000 lines of Python, 6 test files, 66 pinned packages, an MCP server exposing 11 tools, a 21-subcommand CLI, 17 brand rules in the knowledge file, 172 lines of LEARNINGS, 138 renders across seven projects. **No cloud keys present, planner and vision run on local Ollama (qwen3-vl:8b).** **The project is not under version control** (no git repo anywhere in the handover folder; versioning is by filenames and tar backups).

**What works, with evidence (today's run on project video-1):**
- Fast tests: **42 passed, 0 failed** in 6.6 s (`pytest tests/test_craft.py tests/test_core.py tests/test_reference.py`). The e2e and InVideo suites were not run (slow / cloud).
- Health check: `aive doctor` **10/10 ok** (ffmpeg, ffprobe, vedit, OpenCV, scenedetect, faster-whisper, Ollama model, Whisper cache). Hardware acceleration absent: software x264 only.
- Variations: `aive plan` → plan v040 (6 shots, 14.1 s, 1 s); `aive plan --no-reference` → v041 (8 shots, 15.0 s, 6 s); `aive revise "hard cuts only"` → v042 (transitions hardened correctly). **There are no seed/style/duration flags on `plan`;** "three variations" today means reference vs no-reference plus revise notes, or editing the brief in project.yaml.
- Render: preview 540×960 in 50 s; final 1080×1920 @ 25 fps H.264 in 27 s; sound designed (17 effects, 3 stems), −11.0 LUFS, peak −2.5 dBFS.
- QA: `aive qa` 29 checks, **27 pass** (no black/empty/frozen frames, loudness and peak in range, no rig edges, source fingerprints unchanged), **2 warnings** (subject touches the frame edge in shot 5; rhythm variety 0.43 vs the human median 0.80).
- Versioning and safety: every artefact versioned (v040–v043), nothing overwritten, raw footage untouched (mtimes and fingerprints verified), zero network calls.
- Contact sheet (checked by eye, Shruti can view `scratchpad/audit/contact_sheet.jpg`): clean cyclorama, no rigs, no empty frames, no cut-off heads.

**What fails or is weak, with evidence:**
- **Plain-English timing corrections do not work.** "Make the second shot start later so the ball pass is fully visible" → plan v043 with the in-point unchanged (0.740); the local planner reinterpreted it as "move shot 2 to position 3". There is **no in/out trim operation** in `app/revise.py`. Exit code 0, no warning.
- **"Remove shot N" is a silent no-op** (bug: the `move` regex branch matches "remove" first; it logs "moved shot 5 to position 5"). Exit code 0. The help text claims removal is supported.
- Reference-mode framing still clips the two outer models in the opening line-up (1.3× group crop; Ravi's note from October is unresolved in reference mode). Shot 5 is the heads-down huddle the status file already calls weak, with the lockup over the models' chests.
- Rhythm variety is below the human benchmark (0.43 vs 0.80).
- Friction: a numpy warning on every render; `project.yaml` points at a file outside the handover folder (breaks on another machine); no git.

**Debate and verdict on the editor.** *Principal Engineer:* "End to end it runs in about two minutes on an analysed project; that is real. But a revise that exits 0 on a misapplied note is a production blocker: a team member would render the wrong cut and never know." *AI/ML:* "The planner is a local 8B model doing interpretation; it is good at structure (reorder, transitions) and bad at timing. Fix: a proper trim operation plus a diff of the shot table shown before render; later, Claude for interpretation if the owner approves the spend." *Senior Product Designer:* "The review screen must show the before/after shot table on every revise; the diff is the product." *Verdict:* **code written, functionality tested, quality validated on specific outputs (six films, frame checks, Earshot), not production ready.** Two bugs (remove, timing) and one missing feature (trim) stand between "works for me" and "works for the team", plus git and a machine-independent config.

---

## 2. Challenging the earlier estimates

| Earlier claim | Audit finding |
|---|---|
| "Creative Producer 90% now" | Pipeline yes; **revise 50%** (structure works, timing and removal don't); review screen 0% (not built); library 30% (tags computed, not stored or searchable). Honest: **~60% of the vision exists as working code; the rest is 4–6 weeks of build plus the two fixes.** |
| "Hotline content engine 80% now" | Cuts, graphics, music and QA exist (evidence above). Captions, plan page, approvals, scheduler and publishing API: **0% built**. Honest: **engine 70%, product 0%**; 2–3 weeks to a manual-publish version. |
| "YouTube 95%" | `publish_video` exists in vedit (verified by its schema and `social_accounts` call: not connected). Shorts recipe not built. Honest: **40% built, 90% low-risk**. |
| "Dashboard 90% now" | Nothing built; the claim meant "mature bought parts". Honest: **0% built, low risk, 2–6 weeks.** |
| "QC + indicator 70%" | QC exists (29 checks, verified). The "brain" (hook/pacing/payoff scoring) **0% built**; benchmark set not yet labelled. Honest: **QC 80%, indicator 0% built, experimental by nature.** |
| "Store adaptation 85%" | Slots, grading, per-shot effects and batch rendering exist as capabilities in the editor; the registry, adaptation recipe, diff check and scheduler are **0% built**. Honest: **capabilities 70%, product 0%.** |
| "DM stylist 70%" | Nothing built; API rules verified in Meta docs; ManyChat verified by reviews only. Honest: **0% built; medium risk (policy, quality, security); 6–8 weeks to a soft launch.** |
| "Photoshoot studio 60%" | One local Kontext test (scene swap on a real frame, judged by eye, good). No intake, themes, casting, critic, finish. Honest: **5% built; the garment-faithful route is demonstrated once, not validated across SKUs.** |
| "Zero running costs with the box" | Compute yes; **Claude usage, platform fees, a licensed model for published imagery, electricity, backups and the person-hours to maintain are not zero.** Realistic floor ≈ ₹10k/month plus maintenance time. |
| "Production ready" anywhere | **Nothing is.** Production means unattended, monitored, recoverable, documented, for other people. The editor is the closest and still needs the fixes above, git, hosting and a runbook for teammates. |

---

## 3. Technical readiness matrix

Legend: Evidence = what ran. CC = Claude Code can build it. Shruti = can design/test/operate/maintain as a non-coder. Needs = engineer / company access / subscription / hardware. Stage = code written → tested → quality validated → production ready.

| System | Works today (evidence) | CC can build | Shruti owns | Needs | Stage today | Risk |
|---|---|---|---|---|---|---|
| 1 Hotline content engine | cuts, graphics, music choice, QA (42 tests, renders, Earshot) | plan page, captions, scheduler + API publishing, learner | voice guide, plan page design, approvals, weekly run | Hotline admin; Meta app (review 2–6 wks); storage; scheduler sub | engine: quality validated; product: not started | low–medium (API review timing; caption facts) |
| 2 DM stylist | nothing; API rules verified (Instagram Login, 24-h window, human_agent, escalation) | webhook service, tools, eval harness, ManyChat flows | conversation design, eval set, weekly thread review, hand-off ops | Hotline admin; ManyChat sub; hosting; **one security review** | not started | medium (policy, tone, safety) |
| 3 Creative Producer + library | plan→revise(structural)→render→QA→versioned, 2 min; analysis tags exist | review screen, shot-table diff, trim op + remove fix, library DB + search, recipes, variants board | screens, recipes, approvals, library curation | none for one Mac; hosting for team use; shot lists from shoot team | tested; quality validated on 6 films; **not production** | low (two known bugs to fix first) |
| 4 QC + indicator | QA 29 checks pass/warn; motion/cut/sound analysis exists | feature extractor, rubric, report, trial-reel flow, calibration | label 30 reels, define "worked", judge reports monthly | insights access; Hotline for trials | QC: tested; indicator: not started | QC low; indicator **experimental** |
| 5 Dashboard | nothing | collector/transforms/narration or a bought connector | views, Monday summary, handle registry | read-only insights permission (review 1–3 wks); Google account; DB host | not started | low |
| 6 YouTube | uploader exists in vedit (schema verified; not connected) | Shorts recipe, metadata, thumbnails, scheduling | OAuth login with me, approvals, thumbnail template | Google Cloud project + channel access | partial code; not tested end to end | low |
| 7 Store adaptation | grading, per-shot effects, slots, batch rendering as editor capabilities | registry + intake QC, adaptation recipe with diff check, batcher, stagger scheduler, auditor | rules, shooting guide, registry, spot checks | facade footage from stores; handle access; publishing API; box for 150 overnight | capabilities tested; product not started | medium (footage quality; spam signals at scale) |
| 8 Photoshoot studio | one local scene-swap test on a real frame (good, 7.5 min) | intake/cleanup, archivist, casting boards, shot director, dresser, critic, finisher, 5 screens | themes, casting plan, contact-sheet judgement, publish-grade decision | archive; product photos; licensed model; **GPU box or rented GPU**; disclosure policy | demonstrated once; not validated | **experimental for try-on; medium for garment-faithful** |

---

## 4. Recommended architecture and build-vs-buy

**One platform, eight products.** A single local/edge "studio" (the editor engine + library + brand grammar + analysis) that every system calls, and a small cloud layer only for things that must be always-on or public-facing.

- **Compute**: Shruti's Mac for design and review; an office **NVIDIA 32 GB workstation** as the shared render/generation/analysis server (debated: *Creative Technologist* wants it immediately for systems 7 and 8; *Principal Engineer* says systems 1–6 do not need it and the first month can run hosted; verdict: order it, don't wait for it).
- **Data**: Postgres (Supabase or on the box) for library, plans, approvals, insights; object storage (R2/S3) with signed URLs for anything Instagram must fetch; originals on NAS, read-only, checksummed.
- **Queues**: a simple job table + worker (RQ/Celery-lite) on the box; one queue per system; jobs idempotent and resumable.
- **Models**: local Ollama for cheap interpretation; **Claude for anything a human reads** (captions, stylist, narration, director's notes) with budgets and logging; local analysis (OpenCV, Whisper, CLIP, Earshot); image editors: local Kontext for tests, hosted multi-reference editors (Nano Banana Pro / Seedream, verified on our connector) or a licensed open base on the box for production.
- **Permissions**: one Meta app under Business Manager with a read-only system user for insights, publishing and messaging scopes; Instagram Login for the Hotline account; secrets in a vault; dashboard and tools behind login; store managers see only their handle.
- **Error recovery**: every job logs start/end/outcome; failed jobs retry with backoff then park in "needs attention"; publishing re-checks stock and approval at send time; nothing auto-publishes without a recorded approval; a daily "what ran" message.
- **Human oversight**: approval pages on phone (plan page, contact sheet, spot-check grid); the shot-table diff on every revise; monthly calibration reviews; hand-off to humans in DMs.

**Build vs buy (decided):**
| Need | Decision | Why |
|---|---|---|
| Edit engine, library, recipes, QC | **Build** (exists) | nothing on the market encodes SNITCH's rules |
| Scheduler for the first weeks | **Buy** (Later/Buffer/Metricool) | avoids waiting on Meta review |
| Publishing/insights/messaging | **Platform** (Meta APIs) | official, free |
| DM triggers and hand-off | **Buy** ManyChat; **build** the stylist brain | ManyChat's AI is FAQ-level |
| Insights connector | **Buy** (Windsor.ai/Airbyte) or small build | mature, cheap |
| Dashboard | **Buy** Looker Studio/Metabase | free |
| Hosting | **Buy** Railway/Render (or the box) | no sysadmin |
| Image generation | **Hybrid**: local tests, hosted licensed production, box later | licence + quality |
| Try-on | **Buy/host** specialised models, trial first | experimental |
| Identity consistency | **Build** reference sets; train LoRAs on box/rented GPU | brand-owned |

---

## 5. How to achieve genuinely good results

- **Prompting vs training**: prompt and reference-condition everything first; train only two things, identity LoRAs (consistency) and possibly a style LoRA from the archive (house look). The planner's weak spot (timing) is fixed by code (a trim operation), not by a bigger model.
- **Reference datasets**: the 33 human SNITCH reels (sound benchmark, exists), the Winter edit-grammar study (exists), the 30 labelled reels for the indicator (to collect), the past-shoot archive for the house look (to collect), the 200 real DM questions (to collect). Without these, systems 4 and 8 are guesses.
- **Benchmarks and checks**: for video, the 29-check QA plus the rhythm and framing warnings, scored against human medians (exists); for images, garment colour delta, logo/print similarity, edge continuity, hands, face match, and a house-look score (to build); for the stylist, a 200-question eval with a pass bar you set and a weekly read of 20 threads.
- **Feedback loops**: Ravi-style notes → rules (exists in LEARNINGS); approvals and edits on the plan page → planner defaults; trial-reel results → indicator calibration; contact-sheet rejects → theme presets and critic thresholds.
- **Limitations to state plainly**: timing-level edits need the trim fix; reference-mode framing still clips groups; virality is not predictable, lift is; try-on drifts on prints; Instagram trial-reel metrics may need manual entry; Meta reviews gate publishing and insights.

---

## 6. Scaling: prototype → pilot → production

- **Prototype** (on Shruti's Mac, one user): what exists for the editor; what the first 2–4 weeks produce for 1, 3, 5, 6.
- **Team pilot** (3–5 users, one shared machine or small host): needs git, a machine-independent config, the two revise fixes, the review screen with the diff, job queue, login, a runbook. 4–8 weeks per system.
- **Production** (unattended, others depend on it): monitoring and alerts, backups, token hygiene, security review for the stylist, documented recovery, an owner on the SNITCH side for each system. 2–3 months after the pilot for the first systems.
- **Throughput**: one Mac renders a 15 s film in ~30 s and analyses a shoot in hours; 150 store versions overnight needs the box or cloud render; image boards at library scale need the box.

---

## 7. Phased roadmap (shared infrastructure first)

| Phase | Weeks | Deliverables |
|---|---|---|
| 0 Foundations | 1 | git repo (local), machine-independent config, the two revise fixes + trim op + shot-table diff, runbook refresh; request Meta app, insights permission, Hotline admin, Google project; order the workstation |
| 1 Studio core | 2–4 | System 3: review screen + library + recipes; System 5: first handle pulling daily; System 6: Shorts pipeline (private uploads); System 1: voice guide + Planner + plan page, manual publish |
| 2 Hotline live | 5–8 | System 1 scheduled posting (API when approved); System 2 stylist on a test account → eval → security review → bio-link soft launch; System 4 rubric + report + first trial cycles; System 5 all handles |
| 3 Scale and imagery | 9–12 | System 7 rules → 20 stores → scheduler; System 8 archive profile → themes → identities → contact sheets → try-on trial with pass rates; calibration everywhere; runbooks and hand-over |

---

## 8. Timeframes and costs (realistic)

- **Setup**: 1 week (git, config, access requests, hosting accounts). Meta reviews run in parallel (2–6 weeks).
- **Development**: ~12 weeks for the eight systems to pilot stage, one or two in parallel at a time; Shruti designs ahead of each build.
- **Testing**: continuous; every system has an eval or QA before it is called done; the 30-reel label set and the 200-question set are Shruti's work (days, not weeks).
- **Maintenance**: budget **4–8 hours a week** of Shruti's time plus Claude sessions for fixes; Meta and platform changes are the main source of breakage.
- **Costs**: build ~₹0 beyond Claude usage; run **₹20–80k/month hosted or ₹11–34k/month with the workstation** (blueprint table); one-time workstation ₹4–6 lakh; identities ₹500–2,000 each if trained hosted; a licensed image model for published imagery (per image or per plan). Estimates at public prices.

---

## 9. The strongest demonstrations for Chetan

1. **The editor, live, in two minutes.** Open project video-1, run `aive plan`, show the shot table, apply "hard cuts only", render the preview, run `aive qa` and show 27 of 29 checks passing, then play the film beside the human reference. It is real, local, and already produced six films. Say out loud what it doesn't do yet (timing notes, removal): that honesty is the credibility of the whole pitch.
2. **The photo scene swap, before and after.** The Spring Shoot frame with the studio replaced by a dusk street, all four people and garments intact, made on this Mac. One image, no words needed; then the plan for the studio and the honest line about prints and try-on.

(Optional third, if access arrives in time: the DM stylist answering "style me for a wedding under ₹3,000" with three in-stock looks on a test account.)

---

## 10. Commit vs experimental

**I can confidently commit to delivering (with the stated access):** System 3 to team-pilot (with the two fixes); System 1 to manual-publish in 3 weeks and API publishing when Meta approves; System 5 dashboard; System 6 Shorts pipeline; System 7 template/graded adaptation for a 20-store pilot; System 4's QC half; System 8's garment-faithful route for social and teaser imagery with a human contact-sheet gate; System 2 to a soft launch on one entry point after a security review.

**Remains experimental (promise the method, not the result):** the performance indicator's predictive value; try-on for prints, logos and sheer fabrics; generated facades for photo-only stores; fully autonomous DM styling for unusual asks; automatic "best of three cuts" judgement.

**Day-one fixes before anything else:** a git repository; the `remove`/`move` bug; a trim operation; the shot-table diff on every revise; a config that runs on any machine.
