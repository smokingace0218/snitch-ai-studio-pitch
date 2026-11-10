# SNITCH technical research update

Researched: 2026-11-10

These are proposed implementation choices informed by official documentation and the 5 November project audit. Documentation verifies a capability, not a completed SNITCH integration.

## Shared platform

### Review surface

React UI + FastAPI. Phone-friendly approval, review and inspection; long-running media work goes to a worker.

### State and library

Postgres; SQLite for a single-user start. Store job state, versions, rights, approvals, platform IDs and raw metric snapshots.

### Media

Read-only originals + checksums; R2/S3 derivatives. Keep raw footage on NAS/local storage; expose only selected approved assets through expiring links.

### Execution

Durable job table first; Celery + broker when needed. Separate render, publish and ingest queues; retries need idempotent tasks and outcome reconciliation.

### Agent runtime

Typed tools, model routing and bounded steps. Model proposes tool arguments; application code executes and validates actions. No agent gets unrestricted publishing or shell access.

### Control

Approval records, source logs and evaluation sets. Version a decision with its content hash; log model/recipe version, source IDs, latency and usage without exposing secrets.

## Agent contract

- Each agent receives a typed task with job ID, input IDs, recipe/prompt version and budget.
- It returns a typed result: output IDs, source references, checks and either success, needs-review or failed.
- Use deterministic code for stock, prices, time windows, permissions, approvals, rendering and scheduling.
- Give read tools and write tools separate permissions; inbound descriptions, DMs and retrieved text never become trusted instructions.
- Persist state between steps; retry only with a known effect boundary and reconcile ambiguous external side effects.

The project audit’s ₹20–80k/month hosted or ₹11–34k/month workstation-route figures are historical planning estimates, not vendor quotes. Include platform subscriptions, usage, failed generations, storage, backups, electricity and maintenance. Validate the bill with one measured pilot before scaling.

The original source documents remain historical evidence. Meta’s primary developer pages were not retrievable in this research session; the Meta-owned API collection and Manychat’s official help were used for the available channel information. Confirm the chosen login flow, scopes, review tier and live limits in the actual connected account.

## Hotline content engine

A supervised weekly production pipeline. Language models propose; deterministic code validates; a person authorizes the exact post version.

### Stack

- **React approval page + FastAPI** — Weekly plan, previews, edits and recorded decisions. A normal web application is sufficient; no autonomous browser agent is needed. Deployment: Small always-on host; review on a phone.
- **aive/vedit + FFmpeg + Earshot** — Render from existing recipes; mix and inspect media. Reuse the audited edit capabilities and preserve originals. Deployment: Mac initially; dedicated worker when the team shares it.
- **Claude tool calls + local Ollama** — Grounded caption drafts and structured planning. Schema validation checks shape; feed lookups and application rules check truth. Deployment: Cloud text service; local planning option.
- **Postgres + object storage + job worker** — Versioned plans, approvals, media delivery and scheduled jobs. One source of truth; media URLs created near dispatch rather than weeks ahead. Deployment: Hosted database and R2/S3; render files remain local.

### Agent execution / checks / failure handling

- **1** Query the brief, rights-cleared library and available results; produce seven typed proposal records. Check: Reject missing asset IDs and unsupported SKUs; flag recent reuse. Failure: Return an incomplete-plan report rather than fabricate assets.
- **2** Compile a proposal into a recipe and render a preview with QA. Check: Check source fingerprints, frame geometry and render manifest. Failure: Keep failed previews out of the approval queue; preserve the job for retry.
- **3** Call product lookup before drafting names, prices, captions and alt text. Check: Every product assertion must resolve to a returned catalogue record. Failure: Omit unknown prices and ask for review when facts conflict.
- **4** Assemble approved voice/music stems and run loudness and peak checks. Check: Track music usage rights; distinguish measured loudness from aesthetic judgement. Failure: Hold if clearance or mix checks are unresolved.
- **5** Store approver, timestamp, post version and content hash. Check: Any subsequent media or caption change invalidates that approval. Failure: Return to review rather than reuse stale approval.
- **6** Recheck approval, current stock and account eligibility at dispatch; save the platform result. Check: Use an application-level key for account + approved version + release slot. Failure: On an ambiguous timeout reconcile the recorded platform object before retrying.
- **7** Join published IDs to available metrics and human edits; propose next-week adjustments. Check: Keep the source posts and measurement dates attached. Failure: Record unknown results and leave strategy changes for approval.

### Records

- Brief → proposal IDs
- Preview + QA → version hash
- Human approval → release record
- Platform post ID → next review

### Recovery

- Separate render and publish queues so a slow film does not block a scheduled post.
- Retry transient reads with bounded backoff; route expired access or missing approval to a visible hold.
- Reconcile uncertain publish outcomes before retrying; retries alone do not guarantee exactly-once posting.

### Acceptance tests

- Duplicate dispatch and webhook replay
- Stock changes after approval
- Changed caption invalidates approval
- Expired media URL or access token
- Caption facts missing from feed

### Research notes

- Publishing is an account-specific integration; do not assume one scope set or fixed daily limit for every Instagram login path.
- The eight-system audit demonstrates editing capabilities, not an already operating weekly publishing product.

Access: Hotline professional account, the selected Meta login path and required permissions, brand voice guide, catalogue and licensed music. A scheduler can bridge initial API setup; access and review timing must be confirmed.

Measures: Approved posts per week, human minutes per post, edit rate, publish failures and source-linked engagement. These are pilot measures, not demonstrated gains.

Costs: Original planning estimate: ₹3–10k/month hosted or ₹1–4k with the workstation for this system. Reprice using actual text volume, scheduler plan, storage, egress and operations; local compute is not free maintenance.

Sources: [Claude tool execution contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works), [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [Meta-owned Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-10bf8bf7-d9b7-4340-9c66-61d3ce683a87), [Cloudflare R2 signed object access](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [Celery task retries and idempotency](https://docs.celeryq.dev/en/stable/userguide/tasks.html), [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html)

## Hotline AI stylist in DMs

Use a conversation state machine around a grounded stylist. The model cannot choose to bypass the message gate, catalogue checks or human hand-off.

### Stack

- **Manychat + official Instagram integration** — Comment trigger, opening reply and human routing. Buy the channel plumbing; build the styling logic separately. Deployment: Manychat account connected to Hotline.
- **FastAPI webhook + Postgres session store** — Validate events, deduplicate and maintain conversation state. A repeated webhook must not create a second opening message or reset ownership. Deployment: Always-on HTTPS host.
- **Claude with catalogue and store tools** — Ask concise questions and assemble looks from returned facts. Product IDs and real destinations are authoritative; generated prose is not inventory. Deployment: Budgeted cloud calls.
- **SQL product filters + optional embeddings** — Filter size, budget and availability before similarity ranking. Vector similarity is a discovery aid, never a stock check. Deployment: Postgres; pgvector only when catalogue size justifies it.

### Agent execution / checks / failure handling

- **1** Deduplicate the comment event and send the supported opening private reply. Check: Persist comment ID, channel and delivery outcome. Failure: Do not repeat the opening reply after a retry; route unsupported events to review.
- **2** Require an eligible user interaction and check the message window before every send. Check: Keep last inbound interaction and HUMAN_HANDOFF as explicit state. Failure: Stop automated messages when the window closes or a human takes ownership.
- **3** Collect occasion, budget, size and preference into a schema-validated brief. Check: Distinguish a missing answer from a guessed preference. Failure: Ask one clarification or hand off; never infer sensitive body judgements.
- **4** Retrieve current product, variant, price, size, stock and store facts. Check: Apply hard availability filters before semantic retrieval. Failure: Return fewer options or an honest unavailable result when the feed fails.
- **5** Compose two or three coherent looks from confirmed product IDs. Check: Validate each card against tool results; do not promise fit or delivery. Failure: Remove unsupported claims and offer a person for unusual requests.
- **6** Build confirmed product/store destinations with attribution tags. Check: Check URL allowlists and stop the bot after hand-off. Failure: Offer a human queue when a destination is unavailable; do not invent a store.

### Records

- Comment ID → opening reply
- Inbound interaction → allowed session
- Brief → confirmed product IDs
- Look choice → verified destination

### Recovery

- Acknowledge and persist webhooks quickly; process longer styling work in a queue.
- Keep one conversation lock per thread so parallel replies cannot interleave.
- Treat inbound text and retrieved descriptions as untrusted content; tools enforce access independently of prompts.

### Acceptance tests

- A proposed 200-question evaluation set covering budget, size and unavailable stock
- No reply after the opening DM
- Window expires during generation
- Duplicate webhooks and out-of-order messages
- Human takeover blocks further automated sends
- Product/price hallucination and prompt-injection attempts

### Research notes

- A public comment and the opening private reply are not an unrestricted ongoing session.
- Manychat documents platform-specific window enforcement; validate the exact entry flow on the connected account before rollout.

Access: Hotline account access, the chosen Manychat/API connection, real catalogue/store feeds, named human responders and a security review. The ordinary automated messaging window is 24 hours; a human-agent exception is not permission for automated marketing.

Measures: Response time, factual-card pass rate, destination clicks, useful hand-offs, and assisted-order attribution where available. UTM clicks alone do not prove an incremental sale.

Costs: Original planning estimate: ₹8–22k/month at a few thousand conversations. Contact-based platform pricing, turns per conversation, model usage and hosting determine the actual bill; the office GPU does not remove cloud messaging fees.

Sources: [Manychat comment-to-DM trigger](https://help.manychat.com/en/articles/17741897-instagram-post-and-reel-comments-trigger), [Manychat messaging windows](https://help.manychat.com/en/articles/17742014-understanding-messaging-windows), [Claude tool execution contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works), [Claude: handling untrusted tool results](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls), [pgvector: exact and approximate search](https://github.com/pgvector/pgvector), [Supabase Postgres row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## AI Edit Studio · MVP

Keep the edit plan inspectable and the render deterministic. The MVP produces real films; extending it into a shared studio requires versioned assets, a review diff and reliable job execution.

### Stack

- **aive/vedit + FFmpeg/ffprobe** — Plan, revise, render and technical QA. Reuse the audited local pipeline; preserve frame-accurate source references. Deployment: Current Mac; render worker later.
- **faster-whisper + OpenCV + scene analysis** — Speech timestamps and shot observations. Useful indexing signals, not automatic creative approval. Deployment: Local worker; benchmark CPU/GPU modes on the actual machine.
- **Ollama / optional Claude interpretation** — Translate a brief into a validated edit operation. A valid JSON plan still needs legal trims, source IDs and a preview diff. Deployment: Local first; cloud interpretation only with a budget.
- **React review + Postgres/pgvector + object/NAS storage** — Shot-table diff, immutable versions and library search. Start with metadata and exact search; add approximate indexing only after recall tests. Deployment: Local originals; shared metadata and approved previews.

### Agent execution / checks / failure handling

- **1** Rank analysed takes against the brief and produce source IDs with proposed in/out points. Check: Verify time bounds and framing; show selects before rendering. Failure: Flag uncertain readiness or framing instead of silently substituting a shot.
- **2** Run craft checks and attach timecoded frames and measurements. Check: Separate pass, warning and failed checks; retain the full QA report. Failure: A failed technical check blocks delivery; a warning needs a human decision.
- **3** Build stems around the chosen cut and render a measured mix. Check: Record licensed sources, loudness and peak values alongside the version. Failure: Fall back to an approved track; do not hide a loudness or clearance failure.
- **4** Apply graphics and transitions from explicit brand recipes. Check: Preview text safe areas and rendered frame boundaries. Failure: Show unsupported requests as unresolved notes, not successful changes.
- **5** Propose grades against the reference look while protecting skin and garment colour. Check: Inspect representative frames; preserve a reversible grading recipe. Failure: Reject clipping or inconsistent shots and keep the previous approved version.
- **6** Store approved masters and derivatives with parent IDs, hashes and usage records. Check: No version overwrites; search results retain the original source and rights. Failure: Keep the master available if a derivative render fails.
- **7** Render against the confirmed display registry and format recipe. Check: Test actual canvas dimensions and safe areas, not assumed 16:9 geometry. Failure: Require a display specification when the screen format is unknown.

### Records

- Original checksum → analysis record
- Shot table → proposed diff
- Approved plan hash → render + QA
- Master ID → versioned derivatives

### Recovery

- Run long renders in workers, not an HTTP request or a fragile in-process task.
- Fingerprint the brief, recipe and sources to avoid accidentally duplicating a render.
- Add source control and machine-independent paths before teammates depend on the editor.

### Acceptance tests

- Keep the exact logged audit: 42 tests; doctor 10/10; QA 27/29 with 2 warnings.
- Regression-test the remove/move parser and actual trim operation.
- A timing note must either change the intended in-point or return an unresolved-note error.
- Interrupted render resumes or restarts safely without overwriting originals.
- Check source hashes and compare the shot table before/after every revise.

### Research notes

- Audited output: final 1080×1920, 25 fps, H.264; measured −11.0 LUFS and −2.5 dBFS peak in the logged run. These are that run’s measurements, not universal channel targets.
- Do not add seed/style/duration flags to the aive plan command in the explanation: the audit found they do not exist.

Access: The real footage, reference film, brief, brand grammar and rights records. The audit logged no Git repository and two revise bugs: remove as a silent no-op, and a timing note misread as a reorder. These are historical findings, not claims that they are now fixed.

Measures: Time to a reviewable first cut, accepted revisions, failed/flagged QA, time to find a shot and reuse of approved masters. Avoid promising a fixed speed-up on untested hardware.

Costs: The earlier ₹0–3k/month estimate excludes substantial team operations and possible inference costs. Local rendering still consumes machine time, electricity, backups and maintenance. Price storage and concurrent-worker demand separately.

Sources: [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html), [faster-whisper / CTranslate2](https://github.com/SYSTRAN/faster-whisper), [Ollama local structured outputs](https://docs.ollama.com/capabilities/structured-outputs), [CLIP image/text representations](https://github.com/openai/CLIP), [pgvector: exact and approximate search](https://github.com/pgvector/pgvector), [FastAPI: background tasks versus task workers](https://fastapi.tiangolo.com/tutorial/background-tasks/), [Celery task retries and idempotency](https://docs.celeryq.dev/en/stable/userguide/tasks.html)

## Performance dashboard, every handle

A data warehouse with provenance first, an AI summary second. SQL computes the comparisons; the model explains validated tables and links back to the source posts.

### Stack

- **Official Instagram/YouTube reads; optional bought connector** — Collect permitted account and post metrics. Buy extraction when it reduces maintenance; confirm field coverage and account permissions. Deployment: Scheduled cloud collector.
- **Postgres raw + curated tables** — Keep source payloads, transform reproducibly and preserve gaps. A NULL result with a reason is different from a measured zero. Deployment: Hosted database or managed office database.
- **Metabase / Looker Studio** — Human-readable reporting and filtered owner views. Dashboard permissions must be verified for the selected edition and embedding route. Deployment: Managed host or authenticated internal server.
- **Claude over precomputed tables** — Draft a source-linked Monday summary. The model has read-only tools and no ability to alter raw metrics. Deployment: Budgeted text generation.

### Agent execution / checks / failure handling

- **1** Record permitted public observations or a dated manual baseline. Check: Mark each source, observation time and missing field. Failure: Do not claim private reach, saves or sales from public observations.
- **2** Compare public campaigns only within available, compatible fields. Check: Keep differences in account size, format, period and paid status visible. Failure: Return “not comparable” when definitions or denominators differ.
- **3** Fetch authorized account metrics with pagination and a per-handle cursor. Check: Retain response dates, metric definitions and permissions used. Failure: Log a gap on revoked access or an unavailable metric; never backfill with zero.
- **4** Join post IDs to format, production effort and reused assets. Check: Require traceable asset and effort records, not model-estimated work hours. Failure: Flag unmatched posts for reconciliation.
- **5** Rank a proposed test priority from comparable creative/output and result tables. Check: Show denominators, paid/organic context and time windows. Failure: Do not turn correlation into a causal budget recommendation.
- **6** Explain validated SQL summaries with links to the underlying posts. Check: Every numeric statement must match a returned query and date range. Failure: Publish a partial report with visible gaps instead of fabricated certainty.

### Records

- Raw response → metric snapshot
- Metric definition + date → curated row
- Post ID → asset + effort join
- Validated query → cited summary

### Recovery

- Retain immutable raw snapshots so transformations can be rerun after a schema change.
- Use upserts keyed by platform, account, post, metric and observation period; distinguish updates from duplicates.
- Use service-side credentials only; enforce per-handle access in the query layer and test database policies.

### Acceptance tests

- Revoked token and a temporarily unavailable API
- Pagination and duplicate daily runs
- NULL versus measured zero
- Metric renamed or definition changed
- Paid versus organic comparability
- A store user must not read another store’s data

### Research notes

- Collection windows and metric availability differ by platform and media type; schedule frequent enough reads for the actual fields.
- Keep raw data and its definition version; do not silently combine unlike reach or view metrics.

Access: Read-only account access, handle/owner registry, production-effort records and a dashboard owner. Public competitor analysis is a separate dataset with fewer fields; it must not masquerade as private insights.

Measures: Collection completeness, freshness, report preparation time and decisions traceable to a source. Platform attribution is not automatically incremental business impact.

Costs: Original estimate: ₹2–20k/month hosted or ₹0–5k with an office database. Validate connector limits, database storage, dashboard edition and user/embedding permissions; do not assume every dashboard feature is free.

Sources: [Meta-owned Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-10bf8bf7-d9b7-4340-9c66-61d3ce683a87), [YouTube Analytics reports.query](https://developers.google.com/youtube/analytics/reference/reports/query), [Metabase permission model](https://www.metabase.com/docs/latest/permissions/introduction), [Supabase Postgres row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Claude tool execution contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

## Pre-publish QC + performance read

Separate technical QC from creative hypotheses. The first can check measurable defects; the second needs labelled examples and real trial response before it deserves predictive confidence.

### Stack

- **FFmpeg/ffprobe + OpenCV + existing QA** — Inspect framing, cuts, freezes, text areas and sound. Deterministic checks return a timestamp and measurement where possible. Deployment: Local analysis worker.
- **CLIP / optional attention model** — Retrieve benchmark examples and propose focal-area hypotheses. Similarity or saliency is not proof of where people looked or whether they will buy. Deployment: Local analysis, model choice validated on SNITCH footage.
- **Versioned rubric + later scikit-learn** — Describe opening, pacing, payoff and loop observations. Start interpretable; do not train a complex predictor on a tiny labelled set. Deployment: Small CPU analysis service.
- **React evidence report + dashboard link** — Show a re-cut note beside its exact frame and trial result. The editor accepts the change; the engine does not automatically release it. Deployment: Review page plus shared results database.

### Agent execution / checks / failure handling

- **1** Build a rights-cleared benchmark set with labels, source posts and observation dates. Check: Avoid train/test contamination between versions of the same campaign. Failure: Do not label an unobserved post a failure.
- **2** Produce a candidate attention map only as an experimental visual hypothesis. Check: Evaluate against an agreed reference; show uncertainty and model version. Failure: Hide the map when unsupported; do not call it measured eye-tracking.
- **3** Apply a documented rubric to opening, cut rhythm, visual change and payoff. Check: Keep feature measurements separate from editorial judgement. Failure: Return an observation and a question when the evidence is ambiguous.
- **4** Merge craft QA with practical, timecoded re-cut options. Check: Each note states what, where and why; the editor chooses. Failure: Block on clear technical failures; warnings require explicit review.
- **5** Record an approved trial, available response and share/re-cut/stop decision. Check: Use the same observation window and keep source screenshots if an API field is unavailable. Failure: Ask for manual results rather than invent trial metrics.

### Records

- Finished version → measured checks
- Evidence frame → proposed edit
- Approved revision → trial record
- Dated response → rubric review

### Recovery

- Keep the rubric version attached so a changed score can be explained.
- Use time-aware holdouts and group by campaign to reduce leakage.
- Refresh a stale benchmark deliberately; an automatically tuned weight cannot silently become house policy.

### Acceptance tests

- The logged QA remains 27/29 with the same two warnings.
- A proposed first rubric set: 30 human-labelled reels, with labels and dates retained.
- Opening changed but the predicted feature did not change: inspect the extractor.
- A trial metric is missing: report unknown.
- Hold out campaigns or future periods and compare against a simple baseline.

### Research notes

- An attention map, a creative rubric and a measured audience result are three different things.
- The proposed 30-reel benchmark is a starting evaluation dataset, not evidence of a trained or reliable predictor.

Access: Finished films, a human-labelled benchmark, a definition of success and authorized results. Trial-reel fields may require manual capture from the app. Attention and performance estimates remain experiments until validated.

Measures: False-negative craft defects, usefulness of re-cut notes, holdout performance versus a baseline, and whether trials actually informed a decision. No promise of virality or guaranteed lift.

Costs: Original estimate: ₹1–2k/month for generated notes, with local analysis. Labeling, trial review, compute and maintenance time are additional effort; accuracy cannot be purchased by increasing model size alone.

Sources: [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html), [CLIP image/text representations](https://github.com/openai/CLIP), [scikit-learn: time-aware validation](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html), [YouTube Analytics reports.query](https://developers.google.com/youtube/analytics/reference/reports/query)

## AI model + photoshoot studio

Use the real garment as the reference contract. Compare candidates beside the product and approve with a stylist; reference consistency and model marketing claims do not prove garment fidelity.

### Stack

- **Intake + OpenCV + approved reference storage** — Validate angles, colour references and must-keep garment details. Bad source references create errors no prompt reliably repairs. Deployment: Local intake; rights-cleared archive.
- **ComfyUI or a hosted multi-reference editor** — Orchestrate test workflows and candidate generation. Select an exact model/version with validated output and commercial-use terms. Deployment: Local evaluation; licensed hosted or licensed self-hosted production.
- **Casting/shot planning + optional identity training** — Choose identity, lens, light, setting and pose before generation. Reference-conditioning first; LoRA training only when measured consistency justifies it. Deployment: Budgeted text/image service and, when needed, rented/office GPU.
- **Automated checks + stylist review + versioned library** — Compare colour, prints, seams, faces and channel crops. Machine checks triage candidates; they cannot guarantee a publishable product image. Deployment: Local analysis and review page.

### Agent execution / checks / failure handling

- **1** Turn product angles, theme and must-keep details into a complete brief. Check: Retake blurred, colour-cast or incomplete product references. Failure: Ask for missing reference views rather than describe unseen garment construction.
- **2** Retrieve rights-cleared identity candidates separately from scene/style references. Check: Confirm consent/licence records and consistent identity IDs. Failure: Do not claim an embedding search proves a synthetic face cannot resemble a real person.
- **3** Record the selected identity, styling direction and approved references before generation. Check: Version selection changes so a new identity cannot silently replace the old one. Failure: Return to selection when identity is inconsistent.
- **4** Generate a per-shot plan with lens, light, pose, framing and protected garment regions. Check: Use the product photographs in the image route, not only a text garment description. Failure: Prefer a garment-preserving scene edit when try-on fails fidelity checks.
- **5** Triage candidates with product comparisons; let a stylist approve the survivors. Check: Review colour, logos, print geometry, seams, anatomy and identity at full size. Failure: Reject and retry a specific failure; keep approval, model and reference provenance with the export.

### Records

- Product + reference rights → shoot brief
- Identity selection → shot plan
- Model/version + inputs → candidates
- Stylist approval → library export

### Recovery

- Keep prompts, seed when supported, input hashes and model versions for reproducibility; do not promise deterministic hosted regeneration.
- Track rejected candidates and reasons rather than regenerating indiscriminately.
- Use an explicit commercial route; count unsuccessful generations, training and review in the cost.

### Acceptance tests

- Pilot on three SKUs and report the acceptance rate by garment category.
- Compare one identity across ten shots.
- Check logos/prints against the source at full size; reject fabric/detail drift.
- Test difficult silhouettes, hands, sheer fabric and accessories separately.
- Verify the exact model/weight licence before commercial deployment.

### Research notes

- BFL now recommends newer models for new projects; the single logged Kontext test remains evidence only for that historical test. Benchmark the chosen current model before changing routes.
- FLUX dev model-operation restrictions and rights in generated outputs are distinct. BFL’s licence permits certain commercial output use while restricting commercial model operation; use the appropriate licensed deployment route.
- CatVTON’s published terms are non-commercial. InsightFace code is MIT, but its supplied pretrained models are generally for non-commercial research. Neither is an automatically cleared production dependency.

Access: Product angles, rights-cleared archive and references, stylist time, approved image-use policy and a licensed model route. Catalogue/product-page imagery needs a stricter product-accuracy bar than mood exploration.

Measures: Stylist-approved images per attempted generation, category-specific reject rate, identity consistency, review time and total cost per accepted image. Do not substitute CLIP similarity for garment accuracy.

Costs: Existing planning ranges—₹5–40/image and identity training ₹500–2,000—remain estimates, not refreshed quotes. Budget per accepted output, including retries, resolution, identity preparation, GPU time, licensing and review.

Sources: [BFL Kontext and current model guidance](https://docs.bfl.ai/kontext/kontext_overview), [BFL FLUX dev licence: model use and outputs](https://bfl.ai/legal/non-commercial-license-terms), [CatVTON model and non-commercial terms](https://github.com/Zheng-Chong/CatVTON), [InsightFace: code versus pretrained-model licences](https://github.com/deepinsight/insightface), [BFL pricing: resolution and usage affect cost](https://docs.bfl.ai/quick_start/pricing), [CLIP image/text representations](https://github.com/openai/CLIP)

## Store handles, adapted automatically

Adapt declared slots in a protected master. Store identity, language and destination are structured data; the batch is approved against a concrete manifest, not a vague “approved campaign”.

### Stack

- **React registry + FastAPI + Postgres** — Validate store records, facade provenance and language. A registry is more reliable than interpreting an unstructured folder name. Deployment: Shared authenticated service.
- **aive/vedit recipes + FFmpeg** — Fill approved opening/closing, lockup and CTA slots. Preserve the existing master’s timing, sound and non-slot content. Deployment: Mac for pilot; queued render worker for batches.
- **Job queue + version manifest + diff report** — Render and inspect each store derivative independently. A failed store should not force the entire successful batch to rerender. Deployment: Durable workers with bounded concurrency.
- **Meta publishing or bought scheduler** — Stagger approved local releases. Track each handle and release separately; recheck approval at dispatch. Deployment: Always-on publish service.

### Agent execution / checks / failure handling

- **1** Validate store identity, location, language, facade date and media rights. Check: Check footage quality and confirm destinations/availability fields. Failure: Reject stale or missing records; never invent Quick availability.
- **2** Fill only the declared slots and apply the specified grade/effects. Check: Keep master ID, recipe version and local-field hashes in the output manifest. Failure: Return an unsupported-slot error rather than change the master structure.
- **3** Compare timing, picture and audio outside the editable regions. Check: Check rendered geometry and use tolerances for lossy re-encoding; file hashes alone cannot prove visual sameness. Failure: Flag changed protected regions for human inspection.
- **4** Approve the batch manifest and review sampled/flagged versions. Check: Sampling supplements per-version automated checks; changes invalidate affected approvals. Failure: Escalate failed variants; do not approve an unseen changed manifest.
- **5** Queue releases per confirmed handle and scheduled slot. Check: Check access, manifest approval and application-level duplicate keys. Failure: Reconcile uncertain outcomes; park inaccessible stores without reposting successful ones.

### Records

- Store registry → validated inputs
- Master + slot recipe → derivative manifest
- Diff + QA → approved batch
- Handle + slot → platform post ID

### Recovery

- Limit render concurrency to measured hardware capacity and keep render/publish queues separate.
- Record status per store; allow selective rerender and selective republish.
- Refresh signed media URLs near dispatch so a delayed scheduled job does not inherit an expired link.

### Acceptance tests

- Wrong store facade paired to a valid handle
- Protected shot/audio region unexpectedly changed
- Duplicate scheduler invocation
- One revoked store account in an otherwise valid batch
- Stale facade or missing language copy
- Lossy-render tolerances and actual display/channel dimensions

### Research notes

- Photo-to-moving-facade generation is an optional experiment and has a separate image licence/QA gate.
- The scene’s sampled approval example is not a guarantee: high-risk or failed variants require individual review.

Access: A confirmed store registry, usable facade footage, approved adaptation rules and account access. Start with one master and three stores, then a measured 20-store pilot; larger batches require observed throughput.

Measures: Human review time per batch, rejected variants, protected-region diffs, successful scheduled releases and local actions where the platform exposes them. No unmeasured overnight-throughput promise.

Costs: Original estimate: ₹2–6k/month plus generated facades, if used. Reprice scheduler account limits, storage, render time and operations. A workstation does not make licensing, electricity or maintenance zero.

Sources: [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html), [Celery task retries and idempotency](https://docs.celeryq.dev/en/stable/userguide/tasks.html), [Cloudflare R2 signed object access](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [Meta-owned Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-10bf8bf7-d9b7-4340-9c66-61d3ce683a87)

## YouTube from the same shoot

A supervised packaging and publishing pipeline: render the right package, upload privately by explicit choice, validate it, then schedule only the approved version.

### Stack

- **aive/vedit + FFmpeg channel recipes** — Prepare main-film and Shorts derivatives. Check current platform guidance and actual output; portrait shape alone is not a complete release specification. Deployment: Local render worker.
- **Claude with transcript/product tools + template graphics** — Draft metadata and render thumbnail candidates. Ground names and claims in the transcript and feed; keep rights attached. Deployment: Budgeted text service; deterministic graphics templates.
- **YouTube Data API + OAuth** — Resumable upload, metadata, privacy and scheduling. Use explicit privacy settings and record upload IDs before retries. Deployment: Small HTTPS service with secure refresh-token storage.
- **YouTube Analytics API → dashboard** — Read supported channel/video reports. Select valid metric/dimension combinations and preserve reporting dates. Deployment: Scheduled read-only collector.

### Agent execution / checks / failure handling

- **1** Prepare a release manifest from the approved film and chosen format recipe. Check: Validate picture, sound, dimensions, safe areas and duration against the current channel specification. Failure: Hold an invalid package rather than rely on platform processing to fix it.
- **2** Draft title, description and chapters from the real transcript and product facts. Check: Check names, claims, links and chapter timing; require human review. Failure: Omit unsupported claims or ask for corrected facts.
- **3** Produce thumbnail options from rights-cleared frames and brand templates. Check: Check readability at small size and the subject/model release. Failure: Use an approved fallback frame rather than invent a misleading promise.
- **4** Review the private package and approve its version and release time. Check: Record approver, content hash and schedule timezone. Failure: Any changed media/metadata returns to review.
- **5** Upload with explicit private status, inspect processing, then schedule the approved release. Check: Retain resumable-upload state and video ID; confirm the returned status and timestamp. Failure: On a timeout check the saved video before retrying; stop on revoked OAuth or insufficient quota.

### Records

- Approved master → release manifest
- Private upload → video ID
- Human approval → scheduled timestamp
- Analytics report → next package

### Recovery

- A network interruption should resume the upload session, not create another public video.
- Separate rendering, upload processing and analytics freshness in the UI.
- Keep an audit trail for changes to privacy and schedule; use an explicit timezone throughout.

### Acceptance tests

- Upload interrupted mid-file
- Explicit private default and no public release without approval
- Scheduling with private status and a future timestamp
- Revoked OAuth or project quota exhausted
- Duplicate job after a successful upload
- Analytics fields not yet available

### Research notes

- Current videos.insert documentation describes a separate upload quota bucket and 100 calls/day; the live project console is authoritative. Remove the old “about six uploads/day” assumption.
- For scheduled publication, the video status must be private and publishAt must satisfy the documented constraints. Explicit private upload remains our design choice, independent of project-verification behaviour.

Access: Google Cloud project, channel access, the appropriate OAuth scopes and approved release specifications. Check the project console and current API requirements rather than relying on a historical daily-upload estimate.

Measures: Accepted packages per shoot, packaging/review minutes, upload failures and source-linked watch/engagement measures. These are proposed pilot measures; no guaranteed audience growth.

Costs: The API pipeline may have little direct API cost, but quota is not money and hosting/rendering/text generation still cost time or usage. Re-estimate from actual upload volume and selected services.

Sources: [YouTube videos.insert: permissions and quota](https://developers.google.com/youtube/data/reference/rest/v3/videos/insert), [YouTube video status and scheduling](https://developers.google.com/youtube/data/reference/rest/v3/videos), [YouTube Analytics reports.query](https://developers.google.com/youtube/analytics/reference/reports/query), [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html), [Claude tool execution contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)

## Full source register

- [Claude tool execution contract](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)
- [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Claude: handling untrusted tool results](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)
- [Ollama local structured outputs](https://docs.ollama.com/capabilities/structured-outputs)
- [FFmpeg filters: crop, scale, loudnorm, ebur128](https://ffmpeg.org/ffmpeg-filters.html)
- [faster-whisper / CTranslate2](https://github.com/SYSTRAN/faster-whisper)
- [CLIP image/text representations](https://github.com/openai/CLIP)
- [pgvector: exact and approximate search](https://github.com/pgvector/pgvector)
- [Celery task retries and idempotency](https://docs.celeryq.dev/en/stable/userguide/tasks.html)
- [FastAPI: background tasks versus task workers](https://fastapi.tiangolo.com/tutorial/background-tasks/)
- [Supabase Postgres row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Cloudflare R2 signed object access](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Meta-owned Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-10bf8bf7-d9b7-4340-9c66-61d3ce683a87)
- [Manychat comment-to-DM trigger](https://help.manychat.com/en/articles/17741897-instagram-post-and-reel-comments-trigger)
- [Manychat messaging windows](https://help.manychat.com/en/articles/17742014-understanding-messaging-windows)
- [YouTube videos.insert: permissions and quota](https://developers.google.com/youtube/data/reference/rest/v3/videos/insert)
- [YouTube video status and scheduling](https://developers.google.com/youtube/data/reference/rest/v3/videos)
- [YouTube Analytics reports.query](https://developers.google.com/youtube/analytics/reference/reports/query)
- [Metabase permission model](https://www.metabase.com/docs/latest/permissions/introduction)
- [scikit-learn: time-aware validation](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html)
- [BFL Kontext and current model guidance](https://docs.bfl.ai/kontext/kontext_overview)
- [BFL FLUX dev licence: model use and outputs](https://bfl.ai/legal/non-commercial-license-terms)
- [CatVTON model and non-commercial terms](https://github.com/Zheng-Chong/CatVTON)
- [InsightFace: code versus pretrained-model licences](https://github.com/deepinsight/insightface)
- [BFL pricing: resolution and usage affect cost](https://docs.bfl.ai/quick_start/pricing)