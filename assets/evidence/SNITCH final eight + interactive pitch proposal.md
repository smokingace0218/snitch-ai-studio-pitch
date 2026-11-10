# SNITCH: the eight finalised ideas and the interactive pitch

**Correction (Shruti, 2026-11-05):** the finalised list is the eight ideas we chose and brainstormed, not ten. The two additions I had proposed (a separate Trend & Virality Radar, and a Creator Kit & Scorecard) are **not in the pitch**; trend intelligence is covered as the research input inside "Know before you post", and creator kits are simply a recipe inside the Creative Producer if ever wanted. The sections for the two dropped ideas are kept below only as reference and are marked NOT SELECTED.

2026-11-05. Strategic review after the two audits. Five lenses argued it (Principal Engineer, AI Engineer, Creative Director, Marketing Strategist, Senior Product Designer); the pitch format was argued by a Creative Director, an Interaction Designer, a Storytelling Specialist and a Presentation Designer. Evidence comes from the hands-on editor audit (`audit-evidence-video-editor.md`) and the technical audit; feasibility labels use its vocabulary.

**Feasibility labels:** *Demonstrated* = ran here, output judged. *Buildable* = standard engineering on verified APIs/tools; not yet built. *Experimental* = method is sound, result unproven.
**Ownership labels:** *I design & build* (with Claude Code) · *SNITCH grants* (access/budget) · *Specialist* (one-off engineering) · *Platform* (bought/official service).

---

## Part 1. Consolidation: from eight systems to ten marketing ideas

**What the lenses challenged.**
- *Marketing Strategist:* "Chetan named trend intelligence and virality; our eight systems dropped the trend radar. Put it back as intelligence, not as a tool that posts." *AI Engineer:* "Agreed, but keep the honest split: the radar is demonstrated (last30days ran on SNITCH today), the predictor is experimental." Verdict: trend radar returns as idea 5, separate from the pre-publish check.
- *Creative Director:* "Influencer automation is one of his interests and we have no system for it." *Principal Engineer:* "It needs no new system: creator kits come from the Creative Producer's recipes; the scorecard from the dashboard. It is a product on existing systems, not an engineering line." Verdict: idea 9.
- *Senior Product Designer:* "The asset library and the Creative Producer are one experience: you don't 'open the library', you search while cutting." Verdict: merged into idea 3; the ad creative lab lives inside it too.
- *Principal Engineer:* "Nothing we show may be described as a product that works for others. The editor works for Shruti, with two known revise bugs." Verdict: every idea carries the audit label, and the deck says "built and tested by me" not "launched".
- *Marketing Strategist:* "Ten ideas must read as one proposal: 'the studio that makes SNITCH's content faster, smarter and everywhere'." Verdict: one narrative, four chapters, ten ideas.

**The eight finalised ideas, in pitch order (value × feasibility × fit to Chetan's interests)**

| # | Idea | Chetan's interest | System | Feasibility | Why this order |
|---|---|---|---|---|---|
| 1 | **Creative Producer + asset library** (one shoot, every cut; ad variants inside) | creative production, asset reuse | 3 | Demonstrated (6 films, 42 tests, 2-min pipeline); review screen and library buildable | the proof we already have; everything else draws on it |
| 2 | **Hotline content engine** (weekly posts, one-tap approval) | Hotline, multi-page content | 1 (+3) | engine Demonstrated, product Buildable | the thing he originally asked for, within weeks |
| 3 | **Content performance dashboard, all handles** | marketing growth, multi-page | 5 | Buildable (mature parts) | the measuring stick for all eight; data expires if we wait |
| 4 | **Pre-publish QC + performance indicator** (with trial reels; trend research as its input) | virality, trend intelligence, creative quality | 4 | QC Demonstrated (29 checks); predictor Experimental | his virality question answered honestly: fewer blind posts, measured |
| 5 | **Hotline AI stylist in DMs** | Hotline, growth | 2 | Buildable on verified API rules; needs a security review | the growth bet; converts followers into styled shoppers |
| 6 | **YouTube automation** | growth, multi-page | 6 | Buildable (uploader exists) | cheapest channel expansion |
| 7 | **Store handles: automatic video adaptation** | multi-page content | 7 (+3) | capabilities Demonstrated, product Buildable; photo-only facades Experimental | multi-page at scale with one approval |
| 8 | **AI model generation + photoshoot studio** | reference-based fashion imagery | 8 | garment-faithful route Demonstrated once; studio Buildable; try-on Experimental | highest ceiling, longest road; the office workstation changes its economics |

Influencer work is not a separate idea: creator kits are a recipe inside idea 1 and creator measurement a view inside idea 3, mentioned in one line when Chetan asks. Shared under all eight: the brand grammar, the library, one Meta app, the dashboard database, the Claude runtime with approvals and budgets.

**Numbering note:** the detailed sections below keep their original numbering from the ten-idea draft (1, 2, 3, 4, 6, 7, 8, 10 are the eight; 5 and 9 are marked NOT SELECTED).

---

## Part 2. Each idea, defined

### 1. Creative Producer: one shoot, every cut
- **Opportunity.** A shoot yields hundreds of clips (762 for Winter); every cut and variant costs editor hours; shots are hard to find later.
- **Experience.** Drop a shoot folder. In minutes, three cuts side by side with a shot table. Type notes in plain English, approve. Every clip and render is searchable by words, SKU and setup; one approval yields platform variants and, for ads, 6–12 hook variants with a results board.
- **Workflow.** Footage → local analysis (scenes, takes, faces, motion, sound) → plans → previews → human notes → revised render → 29-check QA → versioned asset in the library → variants.
- **Engineering.** aive/vedit engine (exists), Whisper, Earshot, OpenCV; FastAPI + React review screen and search; SQLite→Postgres library; recipes as editor styles. Day-one fixes from the audit: git, the remove bug, a trim operation, a shot-table diff on every revise.
- **My contribution.** Design the review screen, search and variants board; build with Claude; curate recipes; operate for the team.
- **Feasibility.** Demonstrated: plan → revise (structural) → render → QA in ~2 min; 42 tests; 138 renders. Buildable: screen, library, trim, diff. Limit: timing-level notes fail today.
- **Impact.** Footage-to-first-cut in minutes; variants per brief 3+; minutes to find a shot; fewer reshoots. Measure: hours per cut, approvals without manual re-edit.
- **Implementation.** No access needed; 1–2 weeks to a usable screen; 4–6 weeks to a team pilot; ~₹0 beyond Claude usage; hosting only for team use.

### 2. Hotline, always on
- **Opportunity.** Hotline needs a person for every post; consistency and frequency suffer.
- **Experience.** Monday: seven proposed posts (cut, caption in the Hotline voice, music, day/time). Approve, edit or swap on your phone. Posts go out on schedule; next Monday learns from last week.
- **Workflow.** Brief + library + feed → Planner → Cutter → Copywriter (facts only from the feed) → approval → Publisher (scheduler now, Instagram API when approved; stock re-checked at publish) → Learner.
- **Engineering.** Idea 1's engine; Claude captions; signed media URLs on object storage; Meta Content Publishing API; cron. 
- **My contribution.** Voice guide, plan page, approval flow, weekly operation.
- **Feasibility.** Engine demonstrated; captions/page/publishing buildable (verified API). Limit: Meta app review 2–6 weeks; scheduler bridges.
- **Impact.** Posts/week without editor hours; edits per approved post falling; reach and saves vs the last 90 days.
- **Implementation.** Hotline admin + Meta app (SNITCH); 2 weeks to manual-publish; ₹3–10k/month.

### 3. Performance Cockpit
- **Opportunity.** Main, Hotline and store pages are judged in separate Meta views; nobody sees the whole picture; Story data vanishes in 24 h.
- **Experience.** One screen: every handle, every format, over time; top posts; a Monday summary in plain English with the posts behind every claim. Store managers see their own handle.
- **Workflow.** Daily read-only pulls → database → dashboard → feature tags per post (hook, length, music, graphics) → summary.
- **Engineering.** System user with read-only insights; a bought connector (Windsor.ai/Airbyte) or small collector; Postgres; Looker Studio/Metabase; Claude narration.
- **My contribution.** Dashboard views, summary format, handle registry, weekly reading.
- **Feasibility.** Buildable; mature. Limit: permission review 1–3 weeks.
- **Impact.** Report time → 0; format and timing decisions from data; the yardstick for ideas 2, 4, 5, 7, 8, 9.
- **Implementation.** Insights permission + a Google account (SNITCH); 1–2 weeks for one handle, 4–6 weeks all; ₹2–20k/month.

### 4. Know before you post
- **Opportunity.** Videos go out on instinct; craft defects and weak hooks are found after posting.
- **Experience.** Upload a finished video; get one page: craft QC (frames, sound, safe zones, captions), a "retention read" (hook strength in the first 2 s, pacing curve, visual change at 3 s/7 s, music energy, payoff, loop) with evidence frames and specific re-cut notes, and a trial-reel plan: post to non-followers first, read the numbers after 24 h, then share, re-cut or drop.
- **Workflow.** Video → QC → analyst → director's notes → trial reel (Instagram feature) → numbers → decision → monthly calibration against results.
- **Engineering.** Our analysis stack + Earshot (exists); rubric built on 30 reels Shruti labels; a weighted scorecard now, a small learned model when the cockpit has months of data.
- **My contribution.** Label the 30 reels, define "worked", design the one-page report and the note format, run the trial cycles.
- **Feasibility.** QC demonstrated (27/29 on today's render). Retention read buildable. **Predictive value experimental**: it predicts relative lift, never virality; say so on the slide.
- **Impact.** Share of posts through a trial before release; score-vs-result correlation reported monthly; fewer wasted posts.
- **Implementation.** Insights access; Hotline for trials; 2–3 weeks to the first report; ~₹0.

### 5. Trend & Virality Radar (NOT SELECTED: kept for reference; its research feeds idea 4)
- **Opportunity.** Trends are noticed late; the team posts what it thinks is rising.
- **Experience.** A one-page Monday brief: what is rising in men's fashion and short-form formats (hooks, sounds, structures), with evidence, three content angles for Hotline and the main page, one thing to stop.
- **Workflow.** Research run (Reddit/web via last30days; YouTube via TubeAlfred; our own comments and insights) → synthesis → brief → angles into idea 2's planner.
- **Engineering.** last30days (installed; ran on SNITCH today: coupon-driven chatter, returns complaints), TubeAlfred plugin, the cockpit's data, Claude.
- **My contribution.** Curate the brief, choose what reaches the planner.
- **Feasibility.** Demonstrated for the research; buildable as a weekly job. Limit: Instagram/TikTok sources need keys; X not enabled.
- **Impact.** Share of posts made from radar angles and their reach/saves vs others.
- **Implementation.** 1 week; ₹1–3k/month.

### 6. Hotline Stylist in DMs
- **Opportunity.** "How do I style this?" sits unanswered in comments and DMs; the question never becomes a sale.
- **Experience.** Comment "style me" or reply to a Story; a stylist answers in seconds with two or three looks from live stock, prices and links; adjust ("more casual", "under ₹1,500"); a human is one tap away.
- **Workflow.** Entry (comment-to-DM, Story reply, bio link) → gatekeeper (route, language, safety) → stylist (tools: product search, look library, size chart) → cards → adjust → buy/save/human; 24-hour window respected; humans continue with the 7-day tag.
- **Engineering.** ManyChat for triggers and hand-off; FastAPI webhook + Claude with tools on Railway/Render; Instagram Messaging API via Instagram Login (own account: Standard Access, no app review, per Meta docs); 200-question eval; security review.
- **My contribution.** Conversation design, cards, hand-off moment, eval set, weekly thread reads.
- **Feasibility.** Buildable on verified rules; nothing built yet; medium risk (tone, safety, policy). Limit: humans must exist for hand-offs.
- **Impact.** Reply time, conversations/week, card click-through, product-page visits and assisted orders via UTM, follower growth.
- **Implementation.** Hotline admin, ManyChat seat, hosting, one security review; 6–8 weeks to a soft launch; ₹8–22k/month.

### 7. Shorts on autopilot
- **Opportunity.** Reels never become Shorts; uploads are manual.
- **Experience.** Every finished film becomes Shorts with titles, descriptions, chapters and a thumbnail, uploaded private for approval, scheduled public; styling Shorts seeded by the stylist's most-asked questions.
- **Engineering.** vedit `publish_video` (exists, not connected), Google OAuth, YouTube APIs, graphics templates.
- **My contribution.** Templates, approvals, the one-time login with me.
- **Feasibility.** Buildable, low risk. **Impact.** Shorts per campaign, hours per upload → 0, views, subscribers. **Implementation.** A Google project; 1–2 weeks; ~₹0.

### 8. Store Network Content
- **Opportunity.** Store handles are silent or inconsistent; adapting one film for many stores is manual.
- **Experience.** Approve one campaign film once; the system makes a version per store (that store's facade in the opening/closing slots, graded and moved like the film, local lockup and CTA, language per city) and posts them staggered; a spot-check grid of ten random versions.
- **Workflow.** Store registry + facade intake QC → adaptation recipe (slots only; a diff proves the master is untouched) → batch → spot check → staggered scheduling → cockpit.
- **Engineering.** Idea 1's engine (grading on a reference surface, per-shot effects, slots: demonstrated capabilities); registry + batch + scheduler to build; Kontext-class edit for photo-only stores (experimental).
- **My contribution.** The adaptation rules, the shooting guide for stores, the registry and spot-check screens.
- **Feasibility.** Buildable; 150 versions overnight needs the office workstation. Limit: facade footage quality; spam signals if posted carelessly.
- **Impact.** Versions per campaign at ~1 hour of human time; per-handle reach and directions taps.
- **Implementation.** Facade footage, handle access, publishing API; 3 stores → 20 → all; ₹2–6k/month hosted, ~₹0 with the box.

### 9. Creator Kit & Scorecard (NOT SELECTED: a recipe inside idea 1 if ever wanted)
- **Opportunity.** Creator campaigns are manual and unmeasured.
- **Experience.** From a brief: a creator kit in a day (cuts, stills, cleared music, do's and don'ts in the brand grammar); after posting, a scorecard per creator (reach, saves, link clicks, code redemptions) that shapes the next shortlist.
- **Engineering.** Idea 1's variants; Meta branded-content insights into the cockpit; Shopify discount codes and UTMs; Claude for briefs. Discovery stays human or on a platform (Instagram's API cannot search creators).
- **My contribution.** Templates, kits, the scorecard, the brief voice.
- **Feasibility.** Buildable. **Impact.** Brief-to-live days; cost per 1,000 reached; redemptions per creator. **Implementation.** Branded-content access + codes; 1–2 weeks; platform fee only if discovery is bought.

### 10. AI Photoshoot Studio
- **Opportunity.** Every drop needs imagery; shoots are slow and costly; teasers, colourways and lookbooks wait on them.
- **Experience.** Photograph the product on a phone; pick a theme (street, editorial, traditional, fusion, old money); choose from a casting board of SNITCH's own model personalities; get a contact sheet of a professional shoot; add catalogue accessories; approve; it lands in the library, channel-cropped.
- **Workflow.** Capture → intake QC and cleanup → theme preset → casting → shot director (a photographer's brief) → generation with the real garment locked → critic (colour, print/logo, edges, hands, face match, house look) → contact sheet → style-it → finish.
- **Engineering.** Local ComfyUI + Flux Kontext for tests (installed); hosted multi-reference editors (Nano Banana Pro, Seedream: verified on our connector) or a licensed open base on a workstation for production; try-on models for the trial; face and CLIP embeddings for checks; the archive for the house look; identity reference sets and trained add-ons.
- **My contribution.** Themes and references, the casting plan, every screen, judging every contact sheet, the publish-grade decision.
- **Feasibility.** Garment-faithful scene swap demonstrated once on a real frame (judged good by eye). Studio buildable. **Try-on for prints, logos, sheer fabrics experimental**; catalogue use gated on a return-rate trial.
- **Impact.** Cost and days per shoot vs a physical shoot; pass rate per garment category; stylist's "would we publish" rate.
- **Implementation.** Archive, product photos, a stylist's time, disclosure policy, licensed model spend, ideally the workstation; 4–8 weeks to the first real shoot; ₹5–15k/month hosted or ~₹1–3k with the box.

---

## Part 3. Demonstrations and evidence to show

1. **The editor, live (2 minutes).** `aive plan` on video-1 → shot table → "hard cuts only" → preview render → `aive qa` 27/29 → play beside the human reference. Then say what it can't do yet (timing notes, removal). Evidence on screen: 42 tests, 138 renders, the QA report.
2. **Real video comparison.** Video 1 v1 (first cut, October) beside v9 (graphics system) and the human editors' reference: the learning curve in 30 seconds.
3. **The scene swap, before/after.** The Spring Shoot frame, studio to dusk street, four people and garments intact, made on this Mac.
4. **The research brief.** last30days' SNITCH page: organic chatter is coupon-driven; complaints cluster on returns. Proof the radar is real and that insight feeds marketing, not support.
5. **The contact sheet from today's audit** with its two honest defects circled. Credibility is the demo.
6. (If access arrives) the DM stylist on a test account answering "style me for a wedding under ₹3,000".

---

## Part 4. The pitch format: what the four creative lenses recommend

**Options weighed.**
| Medium | Clarity | Reliability | Interactivity | Time to build | Verdict |
|---|---|---|---|---|---|
| Interactive single-page web story (HTML, runs offline from the laptop) | high: scroll narrative with real video, diagrams, expandable engineering | high if offline and tested; no network dependence | high | 2–3 days | **Primary** |
| Slides (Claude's Slides artifact type, exportable to PPTX/PDF) | good for a leave-behind | very high | low | half a day | **Leave-behind and backup** |
| Figma prototype | beautiful, but static video and no real demos | medium (needs Figma online) | medium | 2 days | design the look here, don't present from it |
| Short film (hyperframes) | emotional opener | high once rendered | none | 1 day | optional 20-second opener inside the web story |
| Live terminal demo | the strongest proof | medium (rehearse; have the render pre-made) | high | hours | inside the web story as "press play / run live" |

**Recommendation.** An **interactive web story** presented from Shruti's laptop (all videos and images local, no internet needed), with a **six-slide leave-behind** generated from the same content, and the **live editor demo** rehearsed as a two-minute moment. Not a PowerPoint of technical bullets.

**Narrative structure (four chapters, eight ideas, one studio).**
1. *What you asked for.* The Hotline video creator: built, tested, six films. The learning curve as a real video comparison. (Creative Producer evidence.)
2. *Hotline, always on.* A week in the life: Monday proposals → one tap → posts → a follower comments "style me" → the stylist answers → a human steps in. (Hotline content engine, Hotline AI stylist.) Interactive: tap through the seven proposals; tap the DM thread.
3. *One shoot, everywhere.* The same footage becomes cuts, Shorts, store versions, ad variants; the Studio makes imagery without a shoot. (Creative Producer, YouTube automation, store adaptation, AI photoshoot studio.) Interactive: a workflow diagram where each node expands into a real example; the store-adaptation grid; the scene-swap slider.
4. *Know before you post.* The pre-publish QC and read with its trend research input, the trial reel, the dashboard. (Pre-publish QC + indicator, performance dashboard.) Interactive: a real QA report; a before/after retention read; a dashboard mock with real numbers once access exists.
Close: *My role and the ask*: what I build and run, what SNITCH grants (four items), the 12-week plan, the eight-week kill rule.

**Visual direction.** SNITCH's own frames and films as the material; white and black with the wordmark; large type; one accent for "evidence" badges (Built & tested / Prototype / Needs access / Experimental) that appear on every idea; motion restrained (reveal on scroll, no gimmicks); diagrams as clean SVG with expandable nodes.

**Navigation.** A chapter rail on the left; each idea is a card with three layers: *story* (one sentence and a visual) → *how it works* (the diagram) → *engineering* (expandable: models, agents, APIs, costs, limits). Keyboard arrows for presenting, scroll for exploring, a "show me the evidence" toggle that reveals audit facts on every claim.

**Technical appendix** (one tap away, never in the main flow): the readiness matrix, the architecture, build-vs-buy, costs on both routes, the roadmap, the audit evidence and contact sheet.

**Skills and tools that can actually build it (verified installed or available):**
- **artifact-design** and **impeccable** (installed): page design, typography, hierarchy, responsive layout.
- **dataviz** (installed) and **dataink** (available plugin): the few charts (test counts, QA pass rates, costs, timeline) done properly.
- **animation-principles**, **motion-design**, **kinetic-typography** (installed): scroll reveals, the title moments, the learning-curve comparison.
- **hyperframes** (installed, updated): an optional 20-second opening film rendered from HTML.
- **artifact-diagramming** (installed) for the workflow SVGs; **Figma MCP** for designing the look first if Shruti wants to.
- **gstack `/design-review` and `/qa`** (installed): test the page like a product before the meeting; **`/browse`** to rehearse.
- Build and serve: plain HTML/CSS/JS, videos as local files; no frameworks needed; a copy published as a private Claude artifact without footage if a link is wanted.
- Slides leave-behind: the Slides artifact type (verified available) → PPTX/PDF.

**Realistic scope for a polished, reliable pitch.**
- Day 1: content lock (this document), visual direction in Figma or a sketch, assets gathered (films v1/v9/reference, scene swap, contact sheet, QA report, research page), the six-slide leave-behind.
- Day 2: the web story built chapter by chapter, interactive diagrams, evidence toggles, offline test on the presenting laptop.
- Day 3: design review and QA passes, rehearsal of the live demo with a pre-rendered fallback, final polish; optional opener film.
- Minimum viable in one day: chapters 1 and 2 interactive, 3 and 4 as designed stills, the live demo, the leave-behind.

---

## Part 5. The final recommendation, in short

1. **Eight finalised ideas, in pitch order**: Creative Producer + asset library; Hotline content engine; content performance dashboard; pre-publish QC + performance indicator; Hotline AI stylist in DMs; YouTube automation; store-handle video adaptation; AI model generation + photoshoot studio. (Chetan asked for ten; we present eight that are real, and say so: "eight we can stand behind, not ten we can't".)
2. **One system per idea**: each idea is carried by its own technical system from the blueprint and audit, all sharing the brand grammar, the library, one Meta app, the dashboard database and the Claude runtime.
3. **Demonstrations**: the live editor, the v1/v9/reference comparison, the scene swap, the research brief, the audited contact sheet.
4. **Format**: an offline interactive web story in four chapters with evidence badges and an expandable engineering layer, plus a six-slide leave-behind and a rehearsed two-minute live demo.
5. **Built with**: artifact-design, impeccable, dataviz, motion skills, diagramming, gstack reviews; Slides type for the leave-behind.
6. **Scope**: 2–3 days for polished and reliable; one day for a minimum version.

**Distinctions the pitch keeps visible on every idea:** *Built & tested by me* (editor pipeline, QA, scene swap, research run) · *I can prototype in weeks* (review screen, Hotline engine, cockpit, Shorts, kits, store template) · *Needs SNITCH access or a specialist* (Meta app, Hotline admin, insights, a security review, a workstation) · *Experimental* (virality prediction, try-on, generated facades, autonomous styling for unusual asks).

Nothing was built or modified for this document; the editor and all outputs are untouched.
