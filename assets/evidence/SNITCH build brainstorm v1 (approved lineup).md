# SNITCH build brainstorm v1: the approved lineup and how we build it

2026-11-05. For Shruti; built with Claude. This is a brainstorm, not a plan: for each approved item, how it could work, the pieces we already have, what you design, what Claude builds, the order of first sessions, and the questions only you can answer. Nothing here is built yet.

**The approved lineup**
1. Hotline content engine (automated posting with approval)
2. Hotline AI stylist in DMs
3. Creative Producer + asset library (the ad creative lab lives inside it)
4. Pre-publish QC and performance predictor, with trial reels as the live test (replaces the trend radar)
5. Content performance dashboard across all handles
6. YouTube automation for SNITCH (kept as a question: cheap if yes)
7. Store handles: auto-push videos, with automatic per-store facade adaptation
8. AI model generation from a stylist's brief, then the photoshoot

Shared foundation under all of them: the edit agent (aive), the brand grammar, the asset library, one Meta app, one dashboard.

---

## 1. Hotline content engine

**How it works.** Monday: the agent reads this week's brief (a line from you or the Hotline owner), the asset library and the product feed, and proposes seven posts: for each, the cut, the caption in the Hotline voice, the music, the format (reel / carousel / story), and a suggested day and time from the dashboard's best slots. You approve, edit or swap on a phone page. Approved posts go to the scheduler (week 1) or the Instagram publishing API (once the Meta app exists). Results flow back (item 5) and next Monday's proposal learns.

**Pieces we have:** the edit agent with recipes and the graphics system; Earshot music scoring against SNITCH's own reels; the Shopify feed; Claude for captions.
**New pieces:** the Hotline voice guide (yours); the weekly plan page; the scheduler or API connection; a "caption facts" rule (prices and names only from the feed).

**You design:** the plan page (seven cards, approve / edit / swap), the voice guide, the approval on phone.
**Claude builds:** the proposal job, caption writer, scheduler hookup, publishing API when granted.
**First sessions:** (1) voice guide + 20 example captions you rate; (2) the proposal job producing seven posts from the Winter library; (3) the plan page; (4) scheduler; (5) API.
**Dependencies:** Hotline admin; a Meta app for API posting (scheduler needs neither).
**Open questions for you:** who approves on the Hotline side, and how many posts per week is right (seven is my guess).

---

## 2. Hotline AI stylist in DMs

**How it works.** Entry: comment-to-DM under posts ("style me"), Story replies, an `ig.me` bio link with ice-breakers. Conversation: four moves (understand occasion/budget/what they own → show two or three looks as cards with price and link → adjust → close: buy / save / talk to a human). Brain: Claude with tools (product search over the Shopify feed, the Hotline look library, size charts). Routing and hand-off: ManyChat. Meta rules respected: replies inside the 24-hour window, human continues with the 7-day tag, human hand-off always offered.

**Pieces we have:** the product feed; the campaign stills and cuts as look references; Claude.
**New pieces:** the look library (each Hotline look tagged with SKUs, occasion, vibe); the stylist service (webhook); ManyChat flows; an evaluation set of 200 real questions (pull from existing DMs and comments once we have access).

**You design:** the conversation (every message, every quick reply), the look-card layout, the hand-off moment, the tone.
**Claude builds:** the stylist service, the look library index, the ManyChat connection, the eval harness.
**First sessions:** (1) write the conversation as a script with 10 example threads; (2) build the brain against the feed, test with 50 questions on screen; (3) a test Instagram account with ManyChat triggers; (4) the eval set to 200 and a pass rate; (5) security review, then Hotline.
**Dependencies:** Hotline admin (Instagram Login), a ManyChat seat, hosting (small), one security review.
**Open questions:** does SNITCH have human stylists who can take hand-offs, and in which hours? Should the stylist recommend only in-stock items, or also "coming soon"?

---

## 3. Creative Producer + asset library (with the ad creative lab inside)

**How it works.** Upload a shoot → three cuts side by side → notes per shot in plain English → re-render → approve → every clip, render and still lands in the library with tags (SKU, setup, people, camera motion, speech, usability, rights). Recipes turn one approved cut into platform variants: organic reel, Short, story, store version (item 7), and **ad variants** (6–12 hooks, lengths, end cards, music) with a results board when the media buyer reports back.

**Pieces we have:** the whole pipeline, QA, versioning, the analysis tags, this week's hand-mapping of 762 clips.
**New pieces:** the review screen; the library database and search page; recipe definitions; the ad variants board.

**You design:** the review screen, the search page, the variants board, the recipe list.
**Claude builds:** all of it on top of aive.
**First sessions:** (1) review screen on one shoot; (2) library from the existing analysis; (3) recipes; (4) ad variants from one campaign.
**Dependencies:** none beyond footage; company hosting later if the team needs it off your Mac.
**Open questions:** does the shoot team keep a shot list with SKUs per setup? (If yes, SKU tagging is exact; if not, it becomes a process ask.)

---

## 4. Pre-publish QC and performance predictor (with trial reels)

**How it works.** You upload a finished video (or the agent's cut) → the system runs three checks and gives one page: (a) **craft QC** (what we already do: frames, cuts, sound, loudness, safe zones for Instagram UI, caption legibility); (b) **the brain**: a structured read of the video the way a retention analyst would: hook type and strength in the first 1–2 seconds (motion, face, text, question), pacing (cuts per second over time), visual change at 3 s and 7 s, music energy curve, payoff moment, loop potential, caption and cover; each scored against SNITCH's own best and worst past posts (from item 5) and against known reel retention patterns; (c) **a live test**: post it as an **Instagram trial reel** (non-followers only, off the grid; insights after ~24 h; can auto-share to everyone after 72 h if it performs). The agent reads the trial numbers and recommends: share, re-cut (with specific notes: "hook lands at 2.4 s, move it to 0.5 s"), or drop. Over months the predicted score is compared with trial results so it gets better and shows its confidence.

**Honest limits:** before the dashboard has 3–6 months of per-post data, the score is pattern-based, not learned; it tells you "this hook is weak", not "this will get 200k views". Trial reels need a professional account with 1,000+ followers (Hotline qualifies). Trial insights come from Instagram; there may be no API for trial-specific metrics, so the first version reads them from the app or screenshots, which is fine for a weekly rhythm.

**Pieces we have:** QA tools, motion/cut/sound analysis, Earshot, the knowledge rules, the Winter benchmark of human edits.
**New pieces:** the hook/pacing/payoff feature extractor; the scoring rubric; the one-page report; the trial-reel workflow; the learning loop.

**You design:** the one-page report (what a creative needs to see in 30 seconds), the "re-cut notes" format, the trial decision flow.
**Claude builds:** the extractor, rubric, report, the loop.
**First sessions:** (1) define the rubric together on 20 past SNITCH reels (10 best, 10 worst by reach); (2) extractor + report on those 20, check it separates them; (3) run on new cuts; (4) trial-reel cycle on Hotline for four weeks; (5) compare predictions with results monthly.
**Dependencies:** insights access for past-post performance; Hotline for trials.
**Open questions:** which past reels count as "worked" for SNITCH: reach, saves, shares, or profile visits? That choice defines the brain.

---

## 5. Content performance dashboard, all handles

**How it works.** Daily read-only pull of Instagram insights for every SNITCH handle (main, Hotline, stores) and YouTube into one database; a dashboard with handle, format and date filters; top posts; Monday summary in plain English; feature tags per post (hook type, length, music, graphics) so it can answer "what works", and feed items 1 and 4.

**Pieces we have:** nothing yet; mature off-the-shelf parts exist.
**New pieces:** connector (Airbyte/n8n), database, Looker Studio or Metabase dashboard, the summary job, the feature tagger (Claude on each post's video).

**You design:** the dashboard views (owner's one screen; analyst's filters), the Monday summary layout.
**Claude builds:** connector, tagger, summary.
**First sessions:** (1) one handle into a sheet; (2) dashboard; (3) all handles; (4) feature tags; (5) Monday summary.
**Dependencies:** read-only insights permission through Business Manager for every handle. Start now: Story metrics vanish after 24 hours.
**Open questions:** how many store handles exist today, and who administers them?

---

## 6. YouTube automation (your question mark)

**Short answer:** cheap to add, worth doing if SNITCH wants YouTube at all. Every finished film becomes Shorts with titles, descriptions, tags, chapters and a thumbnail; uploaded private for approval; scheduled public; analytics read back. Styling Shorts fed by the most-asked DM questions (item 2) are the evergreen content YouTube rewards.
**Pieces we have:** the uploader in our editor (needs one Google login); the graphics templates.
**Dependencies:** a Google account/channel.
**Decision for you:** keep it as item 6 if SNITCH has a channel strategy; otherwise park it.

---

## 7. Store handles: auto-push with per-store facade adaptation

**How it works (my understanding, to be corrected by you).** One approved campaign video becomes N store versions automatically, each adapted to that store's facade and place while the structure and the message stay identical: the same cuts, timing, music, graphics and words. What changes per store: the establishing or closing shot (the store's own facade), the location lockup (city, area, store name), possibly the colour mood of the facade shot matched to the film, and the call to action (address, hours, "60 minutes to your door" where Quick runs). Each store handle receives its version on schedule, approved once at the campaign level, not 150 times.

**Three ways to adapt, from cheapest to most ambitious:**
1. **Template slots:** the campaign cut has defined slots (opening 1.5 s, closing 2 s, lockup); each store's facade clip or photo fills the slots; the editor renders N versions. Works today with our editor.
2. **Facade-matched grading and motion:** the facade shot is graded to the film (we already grade on a reference surface) and given the film's camera language (push-in, ghost trail, long exposure) so it feels shot for the campaign, not pasted. Works today with our effects.
3. **Generated adaptation:** when a store has only a photo, Kontext-style editing makes the facade shot match time of day and weather of the film, or places the campaign's hero still in front of that facade. Experimental; keep for stores without footage.

**What we need per store:** one facade clip (10 s, tripod, daylight and evening if possible) or a good photo, the store name, address, Quick availability. A store onboarding form plus a shared folder is enough.

**Pieces we have:** the editor, grading, graphics, versioning, per-shot effects.
**New pieces:** the store registry (sheet), the slot-based recipe, the batch renderer, the per-handle scheduler, approval at campaign level with spot checks.

**You design:** the store template (where the facade goes, the lockup, the CTA), the onboarding form, the spot-check screen (a grid of N versions).
**Claude builds:** the registry, batch adaptation, scheduling.
**First sessions:** (1) you teach me the adaptation rules on one campaign film and three stores; (2) slot recipe + three versions rendered and checked; (3) registry and batch for 20 stores; (4) scheduler to store handles; (5) scale.
**Dependencies:** store facade footage or photos; store handle access (or city handles if we decide 150 is too many); the publishing API.
**Open questions (you said you'd teach me; these are what I need):** what exactly changes per store and what never changes; do stores have footage already; are store handles one per store today or one per city; who approves, once per campaign or per store?

---

## 8. AI model generation from a stylist's brief, then the photoshoot

**How it works.** A stylist writes a brief: the outfit (SKUs), the model (build, skin tone, hair, age, attitude), the setting and theme, the shot list (full-length, three-quarter, detail, movement). The system generates a consistent model identity (an owned digital model, reused across shoots so the brand has a face it controls), renders the shot list with the real garments, runs fidelity checks (colour vs the flat, logo and print similarity, body plausibility), shows a QA grid for approve / reject / redo, upscales and exports with a disclosure tag, and files everything in the library.

**Two routes, debated:**
- **Garment-faithful route (safest, works today):** start from a real on-model or ghost-mannequin photo of the garment; generate the model's face/body consistency and the world around it (scene, light, pose variations within limits). The garment pixels stay real. This is what we proved on our footage this week.
- **Full generation route (experimental):** virtual try-on / garment-conditioned models render the outfit on the generated model from flats alone. Prints, logos and fit drift; needs a retoucher for catalogue use. Run as a 3-SKU trial, judged by the QA pass rate and, if ever published on product pages, by return rate.

**Model identity:** train or fix one or two owned digital models (a LoRA or a reference-image set) so every shoot features the same faces; consent and disclosure handled once.

**Pieces we have:** ComfyUI + Flux Kontext locally for tests; product feed images; the QA habits; Figma for layouts.
**New pieces:** the brief form, the shot-list generator, the identity set, fidelity checks, the QA grid, a licensed/hosted model for anything published (the local test model is non-commercial).

**You design:** the brief form (what a stylist fills in), the QA grid, the disclosure label, the shoot "look" references.
**Claude builds:** the generation workflows, checks, grid, export.
**First sessions:** (1) brief form + three SKUs chosen with the stylist; (2) garment-faithful route: 30 images, QA grid, pass rate; (3) one owned model identity, consistency across 10 images; (4) try-on trial on the same three SKUs; (5) decide the route and the licensed model.
**Dependencies:** product photos (ghost or on-model), a stylist's time, licensed model spend when we publish, GPU or hosted pipeline at volume.
**Open questions:** is the goal social/teaser imagery first, or product-page imagery? Does SNITCH want an owned "digital model" with a name, or anonymous faces? Any existing rules on AI imagery disclosure at SNITCH?

---

## Build order (first eight weeks, my proposal)

| Week | Build | Why first |
|---|---|---|
| 1–2 | Item 3 review screen + library; item 5 one handle into a sheet; item 1 voice guide + proposals | foundation and the fastest visible wins; data collection starts |
| 3–4 | Item 1 plan page + scheduler; item 2 conversation script + brain prototype on a test account; item 4 rubric on 20 past reels | Hotline goes live on content; stylist takes shape; the brain learns what SNITCH's "worked" means |
| 5–6 | Item 4 report + first trial-reel cycle; item 7 adaptation rules with you on three stores; item 5 all handles | predictor meets reality; store adaptation defined |
| 7–8 | Item 2 eval to 200 + security review; item 7 batch for 20 stores; item 8 brief form + garment-faithful trial; item 6 if yes | stylist ready for Hotline; stores scale; imagery trial |

## What I need from you before the first session
1. Your answers to the open questions above (store adaptation rules matter most).
2. Hotline admin and read-only insights access, as soon as SNITCH agrees.
3. Twenty past SNITCH reels you consider "worked" and ten that didn't, with why in one line each. That single list trains the brain's rubric.
