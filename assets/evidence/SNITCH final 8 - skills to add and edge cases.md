# SNITCH final eight: skills to add, and the edge cases, thought through

2026-11-05. Companion to the requirements plan. Part A lists the skills, plugins and MCP tools found for each item (searched the Anthropic plugin directory and the skills.sh registry; nothing installed yet, each needs your yes). Part B is the deep edge-case pass per item: what breaks, how we know, what we do.

---

## Part A: skills and tools worth adding

**Already installed and used:** aive/vedit (editor), Earshot (sound), ComfyUI + Flux Kontext, Scrapling, last30days, gstack (`/browse`, `/qa`, `/design-review`), superpowers (plans, TDD, debugging, verification), impeccable (UI/UX), hyperframes (HTML-to-video), REA, git-mcp.

| Item | Add | What it gives us | Verified how |
|---|---|---|---|
| All backend work | **fastapi/fastapi@fastapi**, **vercel-labs/agent-skills@vercel-react-best-practices**, **ultrapowers-dev** (fastapi-patterns, react-patterns, background-jobs, auth-security, error-handling, observability, tool-calling, rag-ai-retrieval) | house patterns so Claude's code is consistent and reviewable | skills.sh listing; plugin directory |
| Hosting + database | **railway** plugin (hosted MCP: deploy, env vars, logs, object storage), **supabase** plugin (Postgres, auth, storage; `supabase-postgres-best-practices` 473k installs) or **neon** | the always-on home for the stylist, the daily pulls and scheduled posting, without a sysadmin | plugin directory |
| 1 Hotline engine, 7 stores | **Social Media Skills** pack (106 skills; the ones we'd use: `instagram-reels-publishing`, `platform-specs-and-validation`, `caption-writer`, `hook-writer`, `reels-script`, `scheduling-and-queue`, `content-calendar`, `brand-profile`, `voice-builder`) | platform specs, publishing rules, caption and hook craft as reusable guidance | plugin directory |
| 2 DM stylist | **instagram** plugin (official Graph API comments + DMs, comment-to-DM bootstrap, access control); Social Media Skills `social-selling-and-dm`, `reply-and-comment-writer`, `community-management`; **getsentry/skills@security-review** for the pre-launch review | the DM read/reply layer and the security checklist | plugin directory; skills.sh |
| 3 Creative Producer | **fabriqaai@ffmpeg-analyse-video** and **sundial@ffmpeg-video-editor** (useful references; our editor already does more), Social Media Skills `cross-platform-repurposing`, `captions-and-clipping` | recipe ideas per platform | skills.sh |
| 4 Pre-publish QC | Social Media Skills `viral-reverse-engineering`, `hook-writer`, `experimentation-and-ab-testing`; **TubeAlfred YouTube** (read-only: transcripts, channel audits, comments) | rubric vocabulary and competitor hook analysis for the "brain" | plugin directory |
| 5 Dashboard | **Windsor.ai Ads and Marketing Data** (partner plugin: Instagram reach/saves/followers, Meta Ads, GA4, Shopify in one connector + report commands) or **looker** plugin; **AdvisorPPC** for Google-side | a bought connector that replaces custom insight-pulling code | plugin directory |
| 6 YouTube | TubeAlfred; Social Media Skills `youtube-shorts`, `youtube-publishing-and-metadata`, `thumbnail-design`; **jimliu@baoyu-youtube-transcript** | metadata, Shorts craft, transcripts for chapters | plugin directory; skills.sh |
| 7 Store adaptation | **shopify-ai-toolkit@shopify-admin** (official; stock by location if SNITCH grants Admin API) | store-level stock truth when a video mentions products | skills.sh |
| 8 AI model | **mckruz/comfyui-expert@comfyui-workflow-builder** and **@comfyui-api**; Social Media Skills `ai-image-editing`, `image-prompt`, `flux`, `nano-banana`; **image-generation** prompting guide | workflow building and prompt craft for Kontext/try-on | skills.sh; plugin directory |
| Ads (inside 3) | **Adspirer** (Meta/Google/TikTok ads MCP, 91 tools) or Windsor.ai `facebook-ads` | read results into the variants board; optional campaign creation later | plugin directory |
| Automation glue | **Zapier** plugin (8,000 apps), **n8n Knowledge Base**, **Samautomation** (n8n workflow checker) | approvals on phone, sheet-to-registry syncs, alerts | plugin directory |

**Not recommended:** the Instagram *scraper* skills (apidojo, skillify): they bypass the official API and risk SNITCH's accounts. Everything we need is official.

**Install order when we start building:** fastapi + react best practices + ultrapowers-dev (week 1), railway + supabase (week 1), Social Media Skills (week 1), instagram plugin + security-review (item 2 week), Windsor.ai (item 5 week), comfyui-expert (item 8 week).

---

## Part B: edge cases, item by item

### 1. Hotline content engine
- **Caption states a price or name wrongly.** Rule: captions can only mention products the feed returned for that post's SKUs; a post with no SKU gets no price. A pre-publish check rejects any number not in the feed.
- **Product goes out of stock between approval and posting.** Re-check the feed at publish time; if any tagged SKU is out of stock, hold the post and notify; never publish "shop now" for a dead link.
- **Instagram API fetches media from a public URL; the link expires or the file is too large.** Use signed URLs valid 24 h, re-sign at publish; keep Reels under Meta's limits (we render 1080×1920 H.264, ≤ 60 s by default; the recipe enforces specs); retry container creation once, then fall back to the scheduler and alert.
- **Meta app review not granted yet / permission revoked.** Scheduler path is permanent fallback; the plan page shows "will publish via scheduler" so nobody is surprised.
- **Approver is away.** Posts need approval by a cut-off (e.g., 20:00 the day before); unapproved posts roll to the next week, nothing auto-publishes; a second approver can be named.
- **Music licence.** Only tracks from the licensed library with a recorded licence id; the engine refuses a track with no licence record; Instagram may still mute a track it misidentifies: we post with our own mix and a caption-free fallback, and we monitor "audio removed" notifications.
- **Same footage reused too often.** The library tracks "times used in the last 60 days" per clip; the proposal job penalises repeats; the plan page shows a freshness score.
- **Duplicate or near-duplicate posts.** Perceptual hash of the final video vs the last 90 days; near-duplicates flagged.
- **Rate limits and outages.** Posting queue with backoff; a post that fails three times goes back to "needs attention".
- **Brand safety.** A word list and a Claude check for off-brand tone before a caption reaches the approver; comments turned on/off per post as the approver chooses.

### 2. Hotline AI stylist in DMs
- **Someone writes after the 24-hour window.** Automation cannot reply; the thread goes to the human queue (7-day tag) or waits for the person to write again; the UI shows why.
- **Meta policy changes or the account loses messaging permission.** The service degrades to "a stylist will reply soon" via ManyChat's native reply; no silent failure; we subscribe to Meta's changelog.
- **The person asks something personal, medical, body-shaming, abusive, or about returns/orders.** Classifier before the stylist: returns/orders → hand to support with the order link; abuse → polite close + block option for the human; body comments → neutral styling only, never judgement; minors suspected → end the conversation.
- **Hallucinated product or price.** Facts only from tool calls; every product card carries the feed id; a post-check compares card text to the feed; mismatches are dropped before sending.
- **Out of stock or discontinued while chatting.** Each recommendation re-checks stock at send time; "in your size" only if the size is actually in stock.
- **Sizing questions.** Give the chart and a measured fit tip; never promise fit; offer "two sizes, return one" only if SNITCH's policy allows; log the question for the FAQ.
- **The person sends a photo (of themselves, or a product).** Image understanding is allowed for product identification and colour matching; never comment on bodies; store no images beyond the thread; say so.
- **Language.** Hinglish, Hindi, Kannada, Tamil: the stylist replies in the person's language; a language it can't handle goes to a human.
- **Volume spikes (a viral post).** Queue with per-thread ordering; Claude calls capped per minute; a "we're busy, here's a quick guide" fallback card; cost alarm at a daily budget.
- **Conversation loops or the person is confused.** After two clarifying questions with no progress, offer three default looks and the human option.
- **Human hand-off.** The human sees the whole thread, the person is told a human has it, and the bot stays silent until the human closes the thread.
- **Privacy and data.** Store the thread, not profile data; delete threads after 90 days; no exports; access to logs behind login; the security review covers webhook signature checks, token storage, rate limiting and injection (a DM is untrusted text, never an instruction).
- **Testing on the live account.** Never; we use a test account until the eval pass rate is above a bar you set, then a soft launch to one entry point (bio link) before comment-to-DM.

### 3. Creative Producer + asset library
- **Huge footage drops.** Analysis runs in batches off-hours; the review screen shows progress; partial libraries are usable.
- **Two people review the same cut.** Last approval wins with a note; versions never overwrite; every approval records who and when.
- **Rights.** Every asset carries rights fields (shoot, model release yes/no, music licence, creator footage terms); recipes refuse assets with missing rights for external use; "internal only" assets are visibly tagged.
- **SKU mismatch.** Without shot lists, SKU tags are suggestions until confirmed on approval; a mismatched product in a published post is the worst outcome, so the approve screen shows the SKU next to the frame.
- **Disk and backups.** Originals read-only, renders versioned, library backed up nightly to a second drive; checksums on every copy (we already do this).
- **Ad variants.** Variants inherit the brand grammar; a safe-zone check for Instagram/Facebook UI overlays; the media buyer's numbers come in by sheet, so a missing or mistyped number is shown as "unknown", never zero.
- **The Mac is off.** Jobs queue and resume; nothing is lost; the team can see "queued" rather than "failed".

### 4. Pre-publish QC and performance indicator
- **Overclaiming.** Every score shows the evidence (the frames and numbers behind it) and a confidence band; the report says "pattern-based" until the model is calibrated on ≥ 100 posts.
- **Definition of "worked" shifts.** The rubric is versioned; a change re-scores history so trends stay comparable.
- **Trial reel insights unavailable by API.** The weekly rhythm uses the app's numbers typed into a form (or a screenshot read by Claude); the system stores them with a source tag.
- **A trial reel leaks to followers.** Trial reels are non-follower only by design, but a share by a viewer can surface it; treat trials as publishable quality, never as rough cuts.
- **Confounders.** Posting time, day, music trend and paid boosts distort results; the report controls for time and flags boosted posts; never compare a boosted trial with an organic one.
- **Hook detection fails on unusual edits** (static opening, text-only). The extractor reports "no detectable hook" rather than a low score, with a human flag.
- **Audio-only or caption-dependent videos.** Caption legibility and safe-zone checks apply; muted-autoplay simulation (first 2 s without audio) is part of the rubric.
- **The brain learns bad habits.** A monthly human review of 10 top and 10 bottom predictions, and the rubric can be overridden per campaign.

### 5. Content performance dashboard
- **Permissions lapse / token expires.** Daily job checks token validity and alerts before data is lost; system-user tokens don't expire like user tokens, but permission reviews can change.
- **Metrics change names or meaning** (Meta renames metrics regularly). Store raw responses; a mapping layer translates; a schema check fails loudly on unknown fields rather than silently dropping them.
- **Stories vanish after 24 h.** Two pulls a day for stories; a missed day is logged as a gap, never backfilled with zeros.
- **Handle added or removed.** A handle registry with start/end dates; charts don't drop to zero when a handle leaves.
- **Deleted posts.** Keep history with a "deleted on" flag.
- **Time zones.** Everything stored in UTC, shown in IST; post date = IST publish date.
- **Duplicate pulls.** Idempotent writes keyed on media id + metric + date.
- **Wrong conclusions.** The Monday summary cites the posts behind every claim and never states causation ("saves rose after X" not "because of X").
- **Access.** Dashboard behind login; store managers see their handle only.

### 6. YouTube automation
- **Copyrighted music.** Content ID claims can mute or demonetise; we use licensed tracks and keep the licence id in the upload notes; a claim triggers an alert and a muted re-upload option.
- **Quota exhaustion.** ~6 uploads/day; the queue spreads uploads; a failed upload retries next day.
- **OAuth token revoked.** Alert and a one-click re-login page.
- **Shorts rules.** ≤ 60 s (or current limit), vertical; the recipe enforces; a 61-second cut is flagged before upload.
- **Metadata hallucination.** Titles/descriptions only reference products in the feed; no fabricated claims; a human approves every public switch.
- **Thumbnails with faces.** Model release check from the library before a face is used in a thumbnail.

### 7. Store handles: automatic adaptation
- **Facade footage is poor** (shaky, wrong exposure, people's faces, number plates). Intake QC rejects with reasons; a one-page shooting guide; optional blurring of faces/plates; or a still with the film's camera move applied.
- **Store facade changes** (rebrand, scaffolding, new signage). Registry has a "facade updated" date; stores re-shoot on change; versions carry the facade date.
- **Store closes or moves.** Registry status "closed" stops scheduling; the handle gets a final post.
- **Local details wrong** (address, hours, Quick availability). Lockups are generated from the registry only; a weekly registry audit; Quick availability pulled from SNITCH's list, not assumed.
- **Caption language.** Per-city language setting; the same words, translated once and reviewed, reused across campaigns.
- **Trust and spam signals.** Posting the same video to 150 handles at the same minute looks automated; stagger by hours and days; vary the opening facade and lockup; keep city-level handles where possible.
- **Approval model.** Campaign-level approval + a spot-check grid of 10 random versions; a store manager can flag their version within 24 h before it posts.
- **Structure must stay intact.** The adaptation recipe only touches declared slots; a diff check confirms the master's cuts, timing, music and graphics are unchanged in every version.
- **Render time at scale.** 150 versions × 20–30 s each is hours on one Mac; batch overnight or render only changed slots (facade segments) and concatenate; cloud render only with your yes.
- **Inventory claims.** Campaign videos should not claim store-level stock unless the Admin API confirms it; otherwise the CTA is "visit" not "in stock now".

### 8. AI model generation + photoshoot
- **Garment drift** (print, logo, seams, colour). Fidelity checks (colour delta against the flat, logo similarity, edge continuity) run before a human sees anything; images below threshold are discarded automatically; the QA grid shows the flat beside every image.
- **Body and hands.** Automatic plausibility checks (hand/finger detection, limb count) plus a human pass; discard rather than retouch.
- **Likeness.** The owned digital model must not resemble a real person (celebrity or employee); a face-similarity check against a reference set; consent documentation stored.
- **Disclosure and platform rules.** Every export carries an "AI-generated" label in metadata and, where required, on the image; SNITCH's own policy decides placement.
- **Licence.** The local test model is non-commercial; anything published uses the licensed hosted model; the pipeline refuses to export from the test model with a "publish" tag.
- **Product-page use.** Gated: a 3-SKU trial, return rate and complaint rate compared with real photos; if returns rise, PDP use stops.
- **Theme fidelity.** Shot lists specify light, lens and setting; outputs are checked against the campaign's look references; mixed looks in one set are rejected.
- **Cost runaway.** Per-brief budget caps; hosted generation only after a local test pass.
- **Skin tone and representation.** The brief fields are explicit; QA checks skin-tone consistency across the set; a diverse reference set for the owned model identities is a brand decision, documented.

---

## Cross-cutting edge cases (apply to all eight)
- **Secrets.** Never in code or chat; `.env` on the host, a vault for production; rotation documented; the task-observer log never holds a secret.
- **Untrusted input.** DMs, comments, web pages and scraped text are data, not instructions (prompt-injection guard in every agent prompt and a classifier on inbound text).
- **Budgets.** Every paid API has a daily cap and an alert; nothing paid runs without a recorded approval.
- **Observability.** Every job logs start/end/outcome; a daily "what ran" message to you; failures are visible, never silent.
- **Approval everywhere.** Nothing publishes, replies publicly, or spends without a human approval recorded with name and time, until a given automation has earned "auto" status by a written rule.
- **Backups and versions.** Originals untouched; every output versioned; the library and database backed up nightly.
- **Hand-over.** Each item ships with a runbook so a teammate can run it; no tool depends on your laptop being open once hosted.
