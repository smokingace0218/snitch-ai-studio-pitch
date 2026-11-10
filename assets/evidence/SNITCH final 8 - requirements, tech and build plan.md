# SNITCH final eight: requirements, tech, and can we build it with just the two of us

2026-11-05. The eight items are final. This document answers three questions per item before any code: what we need (access, data, accounts), what technology it runs on, and whether Shruti (UI/UX, non-coder) and Claude can build and run it alone. Then the global setup checklist and how we will work.

**Short answer to "just you and me":** yes for 7 of 8 end to end, with three outside touches that are not engineering: SNITCH granting account access, a one-time security review before the DM stylist talks to the public, and licensed model spend for published AI imagery. The eighth (AI model generation) is buildable by us for social and teaser imagery; catalogue-grade imagery may still need a retoucher at the end.

**How "just you and me" works in practice:** you design (screens, flows, rules, voice, QA), Claude writes and runs all code, you look at every real output before it counts as done, and everything runs on your Mac first. When a tool must run while your laptop is closed (the stylist, the daily insights pull, scheduled posting), it moves to a small cloud host (Railway/Render, ₹500–2,000/month) that Claude sets up and you own the account for. No engineering department is on the critical path.

---

## 1. Hotline content engine

**Requirements**
- Access: admin on the Hotline Instagram professional account; a Meta Developer app under SNITCH's Business Manager with the publishing permission (`instagram_business_content_publish`) and insights.
- Data: the asset library (item 3), the Shopify product feed (public, verified), the Hotline voice guide (you write), past posts for best time slots (item 5).
- Accounts: a scheduler for the first weeks (Later/Buffer/Metricool, ₹1–3k/month) if the Meta app is not yet approved.
- A public file host for videos: Instagram's publishing API fetches media from a **public URL**, so approved videos must sit on S3/Cloudflare R2/Backblaze (₹100–500/month) with expiring links.

**Tech**: aive (our editor) for cuts and graphics; Earshot for music choice; Claude API for captions grounded in the feed; a small FastAPI service + a phone-friendly web page (React) for the weekly plan and approvals; Postgres or SQLite for the plan; Instagram Graph API for publishing (container → publish flow; Reels, carousels, stories); cron on the host.

**Just you and me?** **Yes.** SNITCH grants the account and the Meta app; everything else we build. Meta app review for publishing takes 2–6 weeks, so weeks 1–4 publish through the scheduler.

**Risks**: off-brand captions (fix: approval first, facts only from the feed); API review delays (fix: scheduler); Instagram's 50 posts/day cap is irrelevant at our volume.

**Build sequence**: voice guide + 20 captions you rate → proposal job (7 posts from the library) → plan page → scheduler → API publishing → learning from item 5.

---

## 2. Hotline AI stylist in DMs

**Requirements**
- Access: Hotline admin for **Instagram Login** (messaging on an account we manage: Standard Access, no app review); permissions `instagram_business_manage_messages`, `instagram_business_manage_comments`; a ManyChat seat (Pro, ~₹2.5–5k/month) for triggers, menus and hand-off.
- Data: the Shopify feed (products, prices, in-stock sizes, images); a **look library** (Hotline looks tagged with SKUs, occasion, vibe; we build from past posts and the asset library); size charts; 200 real questions from existing DMs/comments for evaluation.
- People: who takes human hand-offs and when (SNITCH answers).
- Hosting: the stylist service must be always-on (Railway/Render); a domain for the webhook; HTTPS.

**Tech**: ManyChat for comment-to-DM, Story-reply and bio-link entry, quick replies, routing and human hand-off; a FastAPI webhook service calling the Claude API with tools (product search over the feed, look lookup, size chart); an embeddings index of products and looks (local, small); Postgres for threads; Instagram Messaging API for replies within the 24-hour window and the `human_agent` tag for people; logging without personal data beyond the thread.

**Just you and me?** **Yes, with one outside touch**: a security review (a few days of an engineer's time) before it goes public, because it handles customer messages. Prototype on a test account needs nobody else.

**Risks**: Meta policy (no promotional pushes outside the window; always a human path; we comply by design); hallucinated products (fix: product facts only from feed lookups, never from the model); tone drift (fix: your script, eval set, a weekly read of 20 threads).

**Build sequence**: conversation script with 10 threads → brain prototype against the feed, 50 questions on screen → test Instagram account + ManyChat flows → eval to 200, pass rate → hosting + security review → Hotline.

---

## 3. Creative Producer with asset library (ad creative lab inside)

**Requirements**
- Access: footage (have); a shared drive or NAS for the library; later a shared Mac or small server if the team uses it directly.
- Data: this week's clip-to-setup mapping; shot lists with SKUs per setup (process ask to the shoot team); rights and music licences per asset.

**Tech**: aive + vedit (exists), ffmpeg, Whisper, local analysis; FastAPI + React review screen (three cuts side by side, per-shot notes, approve); SQLite/Postgres library with tags and CLIP-type embeddings for similarity search; recipes as editor styles (organic, Short, story, store version, ad variants); a variants board that takes the media buyer's numbers from a sheet or the Ads API read-only.

**Just you and me?** **Yes, fully.** The agent exists; this is a screen, a database and recipes. Hosting only when the team must use it without your Mac.

**Risks**: SKU tagging accuracy without shot lists (fix: the process ask; manual tag on approve); render queue on one Mac (fix: queue + off-hours batches).

**Build sequence**: review screen on one shoot → library from existing analysis → recipes → ad variants from one campaign → team access.

---

## 4. Pre-publish QC and performance indicator (with trial reels)

**Requirements**
- Access: Hotline (1,000+ followers, professional account) for trial reels; read-only insights for past-post performance (item 5).
- Data: 20 "worked" and 10 "didn't" past SNITCH reels with one line each (from you); per-post metrics history; our QA tools and the Winter benchmark of human edits.
- Note: trial-reel results may not be exposed by the API; first version reads them from the app (a weekly rhythm makes that fine).

**Tech**: our analysis stack for features (first-2-second motion, face/text presence, cuts-per-second curve, visual change at 3 s/7 s, music energy via Earshot, payoff timing, loop seam, safe zones, caption legibility); a rubric + weighted scorecard first, then a small learned model when 3–6 months of data exist; a one-page report (React); the trial-reel decision flow; monthly comparison of predicted vs trial results.

**Just you and me?** **Yes.** It is analysis code over our own tools plus a report you design. The limit is data, not people: the score is pattern-based until the dashboard has history, and it predicts relative lift, not virality.

**Risks**: overclaiming (fix: show confidence and the evidence behind each score); SNITCH's definition of "worked" (reach vs saves vs profile visits) must be chosen first.

**Build sequence**: rubric on the 30 reels → extractor + report, check it separates them → run on new cuts → four weekly trial-reel cycles → monthly calibration.

---

## 5. Content performance dashboard, all handles

**Requirements**
- Access: a Meta **system user** under Business Manager with read-only insights on every handle (main, Hotline, stores); YouTube Analytics read access; a Google account for Looker Studio or a Metabase host.
- Data: list of all handles and who administers them.

**Tech**: Airbyte Cloud or an n8n/cron job (Claude writes it) pulling Instagram Insights daily; Postgres (Supabase/Neon free tier, or on the host); Looker Studio (free) or Metabase; Claude for the Monday summary and per-post feature tags; token in a secrets store.

**Just you and me?** **Yes.** Mature, no custom logic beyond the summary and tags. Start first: Story metrics vanish after 24 hours.

**Risks**: permission review for insights (1–3 weeks); token hygiene (fix: system user, vault, read-only).

**Build sequence**: one handle to a sheet → dashboard → all handles → feature tags → Monday summary.

---

## 6. YouTube automation

**Requirements**
- Access: a Google Cloud project with YouTube Data API v3 enabled and an OAuth client (you create it with me, 30 minutes), channel manager access.
- Data: finished films, the graphics templates for thumbnails.

**Tech**: aive renders Shorts (9:16, hook in the first 2 s, platform loudness); Claude for titles/descriptions/tags/chapters; thumbnails from our HTML graphics templates; vedit's `publish_video` (exists) uploading private + scheduled; YouTube Analytics API read-back into item 5. Quota ~6 uploads/day.

**Just you and me?** **Yes, fully.** Cheapest item on the list.

**Risks**: none technical; strategic only (does SNITCH want YouTube).

**Build sequence**: OAuth login → Shorts from the Winter films → metadata + thumbnails → upload private → schedule → analytics.

---

## 7. Store handles: automatic video adaptation (videos provided, we adapt)

**Requirements**
- Access: the store handles (or city handles) and the publishing API (item 1's Meta app covers them if they sit in the same Business Manager); the public file host.
- Data: the campaign videos (provided); a **store registry** (sheet: store name, city, area, address, handle, Quick availability, facade clip or photo); facade footage per store (10 s tripod clip, day and evening, or a good photo); your adaptation rules (what changes per store, what never changes).

**Tech**: aive recipes with slots (opening/closing facade, lockup, CTA) → batch renderer producing N versions; grading on the reference surface to match each facade shot to the film; the film's camera language applied to the facade shot (push-in, ghost trail) with our per-shot effects; optional Kontext-style adaptation for stores with only a photo (experimental, local for tests, licensed model if published); a spot-check grid (React); scheduler per handle; versioning so every store version is traceable to the master.

**Just you and me?** **Yes.** It is our editor plus a registry and a batch. The only outside dependency is the stores supplying facade footage and SNITCH granting handle access.

**Risks**: 150 handles is a trust and attention risk (recommend city handles or a staged rollout); facade quality varies (fix: a one-page shooting guide for stores, Claude checks exposure and stability on intake); stock truth if the video shows products (fix: campaign videos, not inventory claims).

**Build sequence**: you teach me the rules on one film and three stores → slot recipe, three versions, your check → registry + batch for 20 → scheduler to handles → scale with spot checks.

---

## 8. AI model generation from a stylist's brief, then the photoshoot

**Requirements**
- Access: product photos (ghost-mannequin or on-model) and flats; a stylist's time for briefs and QA; SNITCH's position on AI imagery disclosure and on an owned digital model.
- Data: three SKUs for the first trial; reference looks for the theme.
- Spend: a licensed/hosted model for anything published (the local Flux Kontext dev build is non-commercial): Kontext Pro/Max via API, or an Apache-licensed editor on a hosted GPU; ₹5–40 per image; a trial costs ₹2–5k.

**Tech**: ComfyUI + Flux Kontext locally (installed, proven) for tests; hosted image APIs (fal/Replicate or BFL) for production; a brief form (React) → shot-list generator (Claude) → generation workflows → **fidelity checks** (colour delta vs the flat, logo/print similarity, body plausibility; OpenCV) → QA grid (approve/reject/redo) → upscale (Real-ESRGAN) → export with disclosure tag → library. Owned digital model identity via a reference-image set or a LoRA trained on consented synthetic images.

**Just you and me?** **Yes for social and teaser imagery** (garment-faithful route: real garment pixels, generated world and model consistency). **Partly for catalogue imagery**: full try-on from flats is experimental; a retoucher may be needed at the end, and product-page use should be gated on return rate.

**Risks**: garment fidelity (the whole risk; fix: garment-faithful route first, automated checks, QA grid); licence (fix: hosted licensed model for published work); disclosure and likeness rules (fix: owned identity, label, SNITCH sign-off).

**Build sequence**: brief form + three SKUs → garment-faithful route, 30 images, QA pass rate → owned identity consistent over 10 images → try-on trial on the same SKUs → route decision + licensed model.

---

## Global setup checklist (do once, mostly SNITCH-side)

| # | Need | Who | Used by |
|---|---|---|---|
| 1 | Meta Business Manager: a Developer app, system user, permissions: publishing, insights, messaging, comments | SNITCH admin grants; we configure | 1, 2, 5, 7 |
| 2 | Hotline admin login for Instagram Login connection | SNITCH | 2 |
| 3 | List of all handles (main, Hotline, stores) + admins | SNITCH | 5, 7 |
| 4 | Google Cloud project: YouTube Data API + OAuth client; Looker Studio access | we create with a SNITCH Google account | 5, 6 |
| 5 | ManyChat Pro seat | SNITCH pays; we build | 2 |
| 6 | Cloud host (Railway/Render) + domain + object storage (R2/S3) | we set up; SNITCH owns the accounts | 1, 2, 5, 7 |
| 7 | Claude API key with a monthly budget (₹5–25k/month across items) | SNITCH | all |
| 8 | Shared drive/NAS for the asset library; store registry sheet | SNITCH | 3, 7 |
| 9 | Licensed image model account (BFL/fal) when imagery is published | SNITCH approves spend | 8 |
| 10 | One security review before the stylist goes public | an engineer, a few days | 2 |

Everything else (code, screens, flows, QA, docs) is us.

## How we will work

- **One item, one session, one folder** under `Desktop/SNITCH_AI_Lab/<item>` with its own README, runbook and versioned outputs; the editor project stays where it is and is reused, not copied.
- **Design before code**: you give a sketch or Figma frame and the rules; Claude proposes the plan; you approve; it builds and tests.
- **Nothing is done until you have seen the real output** (frames, pages, threads), the rule that has held since the video work.
- **Hard rules carry over**: never modify original footage; nothing leaves the machine without your yes; no paid call without an approved budget; no keys in code; versions never overwrite.
- **Weekly**: a 30-minute review of what shipped, what the dashboard says, what to change.

## Proposed order (eight weeks)

| Week | Items | Visible result |
|---|---|---|
| 1–2 | 3 (review screen + library), 5 (one handle), 1 (voice guide + proposals) | first cuts reviewed on a screen; data collecting; first Hotline week proposed |
| 3–4 | 1 (plan page + scheduler), 2 (script + brain prototype), 4 (rubric on 30 reels) | Hotline posting from the engine; stylist answering on a test account |
| 5–6 | 4 (report + trial reels), 7 (rules with you, 3 stores, then 20), 5 (all handles) | first predicted-vs-trial comparison; store versions rendered |
| 7–8 | 2 (eval + review + Hotline), 6, 8 (brief form + trial), 7 (scheduler) | stylist live; Shorts flowing; first AI imagery trial judged |

First build recommendation: **item 3** (everything else draws from the library and the review screen), with item 5's first pull started the same day so no data is lost.
