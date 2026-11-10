# SNITCH master blueprint: eight systems, broken down to the agent

2026-11-05. The consolidated plan: for each system, how far it can go (in three stages), the agents that make it up (what each takes in, puts out, uses, and must never do), the stack, the cost on the hosted route and with an office workstation, how Shruti and Claude build it, and the number that proves it works. Built on what we verified this week; nothing here is assumed to work that we have not run or read in official documentation.

**How to read "extent":** *Now* = buildable in the first weeks with what exists. *With data* = after the dashboard holds 2–3 months of SNITCH's own numbers. *With the box* = with a 32 GB NVIDIA workstation in the office. Percentages are my estimate of how much of the full vision each stage delivers.

**How agents are defined here:** an agent is one job with a clear input, output, tools and guardrails. Each is a separate Claude Code session to build, a separate module to run, and a separate thing to test. Agents talk to each other through files and a small database, never through shared memory, so one failing never breaks the rest.

**The shared platform (built once, used by all eight):** the edit engine (aive/vedit), the asset library (SQLite/Postgres + search), the brand grammar (edit rules, voice guide, graphics), one Meta app (publishing, insights, messaging), the dashboard database, the Claude runtime (prompts, tools, logging, budgets, prompt-injection guard), and the approval service (a phone page; WhatsApp or ManyChat notifications).

---

## 1. Hotline content engine

**Extent.** Now 80%: weekly proposals, cuts, captions, music, approval, scheduled posting via a scheduler. With data 95%: proposals ranked by what performed; best time slots. With the box: render time irrelevant. Remaining 5% is taste, which stays human by design.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Planner | weekly brief, library, feed, last 90 days' performance | 7 post proposals (format, cut spec, SKUs, day/time) | library search, dashboard query | repeat a clip used in the last 60 days without flagging |
| Cutter | a proposal | the rendered cut + QA report | edit engine recipes, graphics, Earshot | publish anything; render over spec |
| Copywriter | cut, SKUs, voice guide | caption, hashtags, alt text | feed lookup, voice guide | state a price or name not returned by the feed |
| Publisher | approved post | scheduled/published post id | scheduler API or Instagram publishing API, signed media URLs | publish without a recorded approval; publish if a tagged SKU is out of stock |
| Learner | last week's posts + metrics | notes for next Planner run | dashboard | change rules on its own; it proposes, you accept |

**Stack.** aive/vedit, ffmpeg, Earshot, Claude API; FastAPI + React plan page; SQLite→Postgres; object storage with signed URLs (R2/S3); Meta Content Publishing API or a scheduler; cron.
**Cost.** Hosted route: ₹3–10k/month (Claude + scheduler + storage). With the box: ₹1–4k/month (Claude only).
**Build (sessions).** 1 voice guide + 20 rated captions · 2 Planner from the Winter library · 3 Cutter via recipes · 4 plan page + approvals · 5 Publisher via scheduler · 6 Meta API when approved · 7 Learner.
**How I help.** I write every agent, the page and the pipeline; you write the voice guide, design the plan page, rate captions, approve posts. We ship on Hotline with manual publish in week 2.
**Proof.** Posts/week with zero editor hours; edits per approved post trending down; reach/saves per post vs the last 90 days.

---

## 2. Hotline AI stylist in DMs

**Extent.** Now 70%: comment/story/bio entry, four-move conversation, live-stock looks, hand-off, on a test account. With data 85%: looks ranked by what sells and saves; FAQ from real questions. With the box: no change (cloud by nature). The last 15% is style judgement for unusual asks, which goes to humans.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Gatekeeper | inbound DM/comment | route: stylist / support / human / ignore; language | classifier, block lists | engage with abuse, minors, medical or body-judgement topics |
| Stylist | thread, occasion/budget/size/vibe | 2–3 look cards with product ids, prices, links, one-line why | product search (feed), look library, size chart | invent a product or price; promise fit; message outside the 24-hour window |
| Adjuster | a look + a note ("more casual", "under ₹1,500") | revised looks | same | drop the human option |
| Hand-off | thread | human queue ticket with summary | ManyChat human assignment, 7-day tag | let the bot keep talking after hand-off |
| FAQ miner | weekly threads | top questions → Hotline content ideas (item 1) and stylist FAQ | dashboard | export personal data |

**Stack.** ManyChat (triggers, menus, hand-off); FastAPI webhook on Railway/Render; Claude API with tools; small embeddings index over products and looks; Postgres; Instagram Messaging API via Instagram Login (own account: Standard Access, no app review); webhook signature checks; 200-question eval harness.
**Cost.** Hosted route only: ManyChat ₹2.5–5k + Claude ₹5–15k + hosting ₹1–2k per month at a few thousand conversations. The box can host the webhook if SNITCH prefers on-site.
**Build.** 1 conversation script + 10 threads · 2 Stylist against the feed, 50 questions on screen · 3 test account + ManyChat flows · 4 Gatekeeper + Hand-off · 5 eval to 200, pass rate ≥ your bar · 6 security review · 7 soft launch via bio link, then comment-to-DM.
**How I help.** I build the service, flows, index and eval; you design every message, the cards, the hand-off moment; SNITCH grants Hotline admin and names the humans.
**Proof.** Reply time (seconds), conversations/week, card click-through, product-page visits and assisted orders via UTM, hand-off rate under 20%, Hotline follower growth.

---

## 3. Creative Producer + asset library (ad creative lab inside)

**Extent.** Now 90%: review screen, library with tags and search, platform recipes, ad variants and a results board. With data 100%: recipes default to what performs. With the box: 5–10× render speed, overnight batches trivial.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Ingestor | a shoot folder | analysed, tagged clips in the library (scenes, takes, faces, motion, speech, readiness, SKU suggestions, rights fields) | edit engine analysis, Whisper, local VLM | modify originals; mark rights it cannot verify |
| Editor | brief + library | three cuts with QA reports | edit engine, brand grammar | ship a cut with a failed QA check |
| Reviser | a cut + plain-English notes | revised cut | edit engine revise | ignore a note silently |
| Librarian | approved cut | versioned asset with tags, rights, usage count, channel crops | library | overwrite a version |
| Variant maker | approved cut + recipe | platform variants / 6–12 ad variants | recipes, safe-zone checks | exceed platform specs |
| Results reader | media buyer's sheet or Ads API | variants board with numbers | Ads read access | treat a missing number as zero |

**Stack.** aive/vedit (exists), ffmpeg, Whisper, CLIP-type embeddings; FastAPI + React (review screen, search page, variants board); SQLite→Postgres; NAS/Drive with checksums; optional Meta Ads read API.
**Cost.** ~₹0 either route; hosting ₹1–3k/month only if the team needs it off your Mac.
**Build.** 1 review screen on one shoot · 2 library from the existing analysis (762 clips already mapped) · 3 search page · 4 recipes · 5 variant maker on one campaign · 6 results board · 7 team access.
**How I help.** All code on top of the existing engine; you design the three screens and the recipe list; the shoot team supplies shot lists with SKUs.
**Proof.** Footage-to-first-cut minutes; variants per brief; minutes to find a shot; reuse rate; cost per result of the winning ad variant.

---

## 4. Pre-publish QC and performance indicator (with trial reels)

**Extent.** Now 70%: craft QC (frames, cuts, sound, loudness, safe zones, captions), the "brain" read (hook strength, pacing curve, visual change at 3 s/7 s, music energy, payoff, loop seam) scored against 30 past reels you label, trial-reel decisions. With data 90%: a calibrated score with confidence, monthly checked against trial results. With the box: faster, not different. The missing 10% is virality itself, which no one predicts reliably; we predict relative lift.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| QC | a finished video | pass/fail list with frames | edit engine QA, Earshot, safe-zone templates | pass a video with an empty frame or a clipped peak |
| Analyst (the brain) | the video + rubric + house benchmarks | feature read + score + confidence + evidence frames | motion/cut/sound extractors, CLIP, benchmark set | show a score without its evidence |
| Director's notes | the analysis | specific re-cut notes ("hook lands at 2.4 s, move to 0.5 s") | brand grammar | generic advice |
| Trial runner | approved video | trial-reel checklist; 24–72 h later, the numbers (typed or screenshot-read) and a share/re-cut/drop recommendation | Instagram app (manual), dashboard | post anything itself |
| Calibrator | monthly predictions vs results | rubric weights update proposal | dashboard | change weights without your approval |

**Stack.** Our analysis stack (OpenCV, ffmpeg, Earshot, scene/motion tools), CLIP embeddings, a weighted rubric now and a small model later (scikit-learn), React one-page report, the dashboard database.
**Cost.** ~₹0 compute; Claude for notes ₹1–2k/month.
**Build.** 1 rubric on 30 labelled reels with you · 2 extractor + report; verify it separates best from worst · 3 QC integration · 4 run on new cuts · 5 four trial cycles on Hotline · 6 monthly calibration.
**How I help.** I build the extractors, rubric, report and calibration; you label the 30 reels, define "worked", design the one-page report and the re-cut note format.
**Proof.** Separation on the labelled set; monthly correlation of score vs trial results; share of posts that went through a trial before full release.

---

## 5. Content performance dashboard, all handles

**Extent.** Now 90%: daily pulls, one dashboard, Monday summary. With data 100%: feature tags per post answer "what works". Box: not relevant (could host the database).

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Collector | handle registry, tokens | daily raw insights per media and account; gap log | Instagram/YouTube insights APIs or a bought connector | backfill a missed day with zeros |
| Transformer | raw rows | clean tables (handle × format × day; per post) | SQL | drop unknown fields silently |
| Tagger | each post's video | feature tags (hook type, length, music energy, graphics, caption shape) | the Analyst from item 4 | tag without the video |
| Narrator | the week's tables | Monday summary in plain English with the posts behind every claim | dashboard | state causation |

**Stack.** Airbyte/n8n or Windsor.ai connector; Postgres (Supabase/Neon); Looker Studio or Metabase; Claude for narration; secrets store; system-user token.
**Cost.** ₹2–20k/month depending on connector; free dashboard. With the box: database on-site, ₹0–5k.
**Build.** 1 one handle into a sheet · 2 dashboard · 3 all handles · 4 Tagger · 5 Narrator · 6 store-manager views.
**How I help.** I build collector, transforms, narration and views; you design the owner's screen and the summary layout; SNITCH grants read-only insights on every handle.
**Proof.** Report time → 0; decisions made from it; it's the yardstick for items 1, 2, 4, 6, 7.

---

## 6. YouTube automation

**Extent.** Now 95%: Shorts from every film, metadata, thumbnails, private upload, scheduled public, analytics. With data 100%: evergreen styling Shorts from DM questions. Box: irrelevant.

**Agents.** Shorts maker (film → Shorts within spec), Metadata writer (title/description/tags/chapters from transcript + feed), Thumbnailer (graphics templates; checks model release), Uploader (private, scheduled; never public without approval), Analytics reader (into item 5).
**Stack.** aive/vedit incl. `publish_video`; Google Cloud OAuth client; YouTube Data + Analytics APIs; HTML graphics templates.
**Cost.** ~₹0.
**Build.** 1 OAuth login · 2 Shorts from the Winter films · 3 metadata + thumbnails · 4 private upload + schedule · 5 analytics.
**How I help.** All of it; you approve each public switch and design the thumbnail template.
**Proof.** Shorts per campaign, hours per upload → 0, 30-day views, subscribers, search impressions.

---

## 7. Store handles: automatic video adaptation

**Extent.** Now 85%: slot-based adaptation (facade clip, lockup, CTA), facade graded and given the film's camera language, batch for N stores, campaign-level approval with spot checks, staggered scheduling. With the box 95%: 150 versions overnight, generated adaptation for photo-only stores. The last 5% is store footage quality, which is a process, not software.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Registrar | store sheet + facade uploads | validated store registry (name, city, area, handle, Quick, facade asset, facade date, language) | intake QC (sharpness, exposure, stability, faces/plates) | accept a facade without a date or with visible faces |
| Adapter | master film + store record + rules | the store version (slots filled, facade graded and moved like the film, lockup, CTA, caption in the city language) | edit engine, grading on reference surface, per-shot effects, Kontext-class edit for photo-only stores | touch anything outside declared slots (a diff check proves it) |
| Batcher | master + N stores | N versions, overnight, with a spot-check grid | queue | run on a laptop that will sleep |
| Scheduler | approved batch | staggered posts per handle over days | publishing API / scheduler | post all handles at the same minute |
| Auditor | registry monthly | stale facades, closed stores, wrong details | registry, SNITCH's store list | guess Quick availability |

**Stack.** aive/vedit recipes with slots, ffmpeg, our grading and effects, ComfyUI/Kontext for photo-only facades (licensed model if published), FastAPI + React (registry, spot-check grid), object storage, Meta publishing API, cron.
**Cost.** Hosted route: storage + scheduler ₹2–6k/month; generated facades ₹5–40 each. With the box: ~₹0.
**Build.** 1 you teach the rules on one film and three stores · 2 slot recipe + diff check · 3 Registrar + intake QC + shooting guide · 4 Batcher for 20 · 5 Scheduler with stagger · 6 Auditor · 7 scale.
**How I help.** I build it all; you write the adaptation rules and the shooting guide, design the registry and the spot-check grid; SNITCH supplies facade footage and handle access.
**Proof.** Versions per campaign with hours of human time ≈ 1; spot-check reject rate; per-handle reach and directions taps vs before.

---

## 8. AI model library and photoshoot studio

**Extent.** Now 60%: capture + cleanup, theme presets, model boards from reference sets, garment-faithful shoots (real garment pixels, generated world), add-ons, finish; try-on as a trial. With data (your archive) 80%: the house look learned; identities and themes tuned. With the box 90%: a vast cached casting library, trained identities, try-on at volume, ₹0 per image. The last 10%: busy prints, sheer fabrics and extreme silhouettes still carry a human reject rate.

**Agents.**
| Agent | In | Out | Tools | Never |
|---|---|---|---|---|
| Intake | phone photos | cleaned garment reference set (angles, white-balanced, background removed) + retake requests | OpenCV, rembg | pass a blurred or colour-cast reference; keep a colleague's face |
| Archivist | past-shoot archive | house-look profile (light, colour, framing, pose vocabulary per theme), theme reference clusters, benchmark set | CLIP, colour science, our grading tools | send the archive anywhere |
| Casting director | theme + product + filters | a board of model images (faces × styles × poses), suggestions with reasons | cached boards, identity library, Claude | propose an identity that matches a real person |
| Identity maker | casting plan | new identities: reference sets (12–20 images), personality cards, dedup and real-person checks; promoted identities get trained add-ons | generators, face embeddings, LoRA trainer (box or rented GPU) | create near-twins; change a published identity |
| Shot director | theme preset + product focus + chosen model/pose | photographer's brief per shot (lens, light, pose, set, must-keep, may-change) | theme presets, house-look profile | write a generic prompt |
| Dresser | garment refs + model image | the garment on the body (try-on) or the garment photo kept with a generated world (garment-faithful) | try-on models, multi-reference editors | describe the garment in words only |
| Critic | candidates | survivors with scores: garment colour, print/logo similarity, edges, hands, face match, house-look score; reject reasons | OpenCV, CLIP, face embeddings | let a drifted logo through |
| Stylist assistant | approved frame + add-on request | re-rendered frame with catalogue accessories | feed, editors | add an accessory that's not in stock without tagging it generic |
| Finisher | approved frames | graded, grained, cropped per channel, upscaled, AI-tagged, in the library with SKU/theme/model/add-on tags | our grading, Real-ESRGAN, library | export from the test model with a publish tag |

**Stack.** ComfyUI + Flux Kontext (tests), hosted editors via the Weave connector (Nano Banana Pro with 14 references, Seedream) or BFL/fal APIs, try-on models (IDM-VTON/CatVTON class or hosted try-on), Qwen-Image-class commercial base for trained add-ons, face embeddings (InsightFace), CLIP, OpenCV, Real-ESRGAN; FastAPI + React (five screens: capture, brief, casting, shoot, style/finish); the library.
**Cost.** Hosted route: identities ₹500–2,000 each (training) + ₹5–40 per image; boards for a vast library are the expensive part (₹20k–1.6 lakh for 200 identities). With the box: ₹0 per image, identities and boards overnight; Claude ₹1–3k/month.
**Build.** 1 Archivist on your archive → the house-look page · 2 theme presets (6) + Intake on 5 phone photos · 3 Identity maker: first 10 identities, dedup/safety · 4 Casting director + boards · 5 Shot director + Dresser (garment-faithful) + Critic → contact sheet on 3 SKUs · 6 try-on trial on 10 SKUs across categories, pass rate per category · 7 Stylist assistant + Finisher · 8 scale the library (200 identities on the box) · 9 the stylist's first real shoot, judged by eye.
**How I help.** I build every agent and screen; you curate themes and references, write the casting plan, judge every contact sheet, and decide publish-grade; SNITCH gives the archive, product photos, a stylist's time, the disclosure policy and, ideally, the workstation.
**Proof.** Pass rate per garment category at full size; identity consistency across 10 shots; "would we publish this?" yes-rate from the stylist; cost and days per shoot vs a physical shoot.

---

## Costs at a glance

| System | Hosted route / month | With the office box / month | One-time |
|---|---|---|---|
| 1 Hotline engine | ₹3–10k | ₹1–4k | – |
| 2 DM stylist | ₹8–22k | ₹8–20k (cloud by nature) | security review |
| 3 Creative Producer | ₹0–3k | ₹0 | – |
| 4 QC + indicator | ₹1–2k | ₹1–2k | – |
| 5 Dashboard | ₹2–20k | ₹0–5k | – |
| 6 YouTube | ₹0 | ₹0 | – |
| 7 Store adaptation | ₹2–6k + generated facades | ₹0 | facade footage |
| 8 Photoshoot studio | ₹5–15k + identities | ₹1–3k | box ₹4–6 lakh (shared by all) |
| **Total** | **≈ ₹20–80k** | **≈ ₹11–34k** | |

## Build order (one session per agent, you design first)

Weeks 1–2: 3 (review screen, library), 5 (first handle), 1 (voice guide, Planner). Weeks 3–4: 1 (page, scheduler), 2 (script, Stylist), 4 (rubric), 8 (Archivist on the archive). Weeks 5–6: 4 (report, trials), 7 (rules, 3 stores, 20), 5 (all handles), 8 (themes, identities, first contact sheet). Weeks 7–8: 2 (eval, review, launch), 6, 8 (try-on trial), 7 (scheduler). Weeks 9–12: 8 (library at scale, stylist's first real shoot), calibration everywhere, runbooks and hand-over.

## What I need from you to begin (in order)
1. Pick the first system (my recommendation: 3, with 5's first pull the same day).
2. The 30 labelled reels (for 4) and the past-shoot archive (for 8) whenever they're ready; both stay on your machine.
3. SNITCH's access grants as the pitch lands: Hotline admin, insights read access, a Meta app, a Google account; and the workstation decision.
