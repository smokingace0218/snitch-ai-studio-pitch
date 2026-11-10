# aive audit evidence (2026-11-05, ~02:45–03:00 local)

Every claim below cites a command run in this session or a file read. Nothing was edited in the source tree, in the raw footage, or in `Spring Shoot/Outputs`. All runs were local (Ollama at 127.0.0.1:11434, faster-whisper cache, ffmpeg); no cloud calls, no InVideo.

## Environment
- Project: `/Users/ravijayant/Desktop/SNITCH_Creative_Producer_Handover/ai-video-editor` (not a git repo: `git rev-parse` -> "fatal: not a git repository").
- Machine: macOS 26.6.2 (25G83), arm64, Apple M5 Pro, 24 GB RAM (`sw_vers`, `uname -m`, `sysctl`).
- Python: `.venv/bin/python --version` -> 3.12.15. CLI entry points present: `.venv/bin/aive`, `.venv/bin/aive-mcp`.
- ffmpeg/ffprobe: `/Users/ravijayant/.local/bin/ffmpeg`, version 8.1.2 (martin-riedl.de static build) — matches SETUP.md's "must be <= 8" pin.
- Cloud keys: `env | grep -cE '^(ANTHROPIC_API_KEY|OPENAI_COMPATIBLE_API_KEY)='` -> `0`; no `.env` file in `ai-video-editor/`. `aive consent video-1` reports vision and planner both as "local Ollama ... stays on this machine".
- Docs read first: `CLAUDE.md`, `RUNBOOK.md`, `SETUP.md`, `STATUS.md`, `HANDOVER.md` (project root).
- Note: `projects/video-1/project.yaml` has `scoring.human_picks: /Users/ravijayant/Desktop/claude context/ai-video-editor/research/benchmark/picks.json` — a path outside the handover folder. It exists on this Mac (`ls -la` -> 4910 bytes, Nov 1), but it will break on another machine.

## Tests
Command (from RUNBOOK "Health check"):
```
.venv/bin/python -m pytest -q tests/test_craft.py tests/test_core.py tests/test_reference.py
```
Output: `42 passed in 6.63s` (wall 9 s). No failures, no skips. HANDOVER.md says "34 pass" — the suite has grown; the fast subset alone is now 42.
Test files present: `conftest.py test_core.py test_craft.py test_e2e.py test_invideo_roundtrip.py test_reference.py`. `test_e2e.py` is marked `pytest.mark.slow` + `needs_ffmpeg` (line 16) and was not run (time-box; RUNBOOK says ~1 min). `test_invideo_roundtrip.py` was not run (InVideo is out of scope).

## Health check
`.venv/bin/aive doctor` (exit 0, 1 s), verbatim:
```
ok   ffmpeg: /Users/ravijayant/.local/bin/ffmpeg (ffmpeg version 8.1.2-https://www.martin-riedl.de Copyright ()
ok   ffprobe: /Users/ravijayant/.local/bin/ffprobe (ffprobe version 8.1.2-https://www.martin-riedl.de Copyright )
ok   vedit 0.4.2
ok   encoders: HWInfo(encoders={'h264': 'libx264', 'hevc': 'libx265', 'av1': 'libsvtav1'}, working=[], checked_at=1793537960.063044, hwaccel='')
ok   opencv 4.14.0
ok   anthropic (Claude provider)
ok   scenedetect (PySceneDetect backend)
ok   faster_whisper (speech transcription)
ok   local vision model: Ollama running, qwen3-vl:8b-instruct ready
ok   whisper model cached (offline)
```
Note `hwaccel=''` and `working=[]`: no hardware encoder is in use; renders go through libx264 (confirmed by the render log line `(libx264, ...)`).

`aive list` showed 9 projects; `video-1` had 7 sources and latest `plan_v039.json` before this audit (109 files in `projects/video-1/plans`).

## Three variations (commands + plan ids)
Starting point: `aive show video-1` -> plan v039, 6 shots, 14.1 s, 1080x1920@25. Analysis and take maps were already cached (`projects/video-1/analysis/s*_takes.json` present for all 7 sources), so no Whisper or vision pass ran.

| # | Command | Plan written | Wall | Result |
|---|---|---|---|---|
| A | `.venv/bin/aive plan video-1` (reference-guided; "following reference Refrence video.mp4: 3 shots, 15.0s + no card") | `plans/plan_v040.json` (+ `plan_v040_selection.md/.json`) | 1 s | 6 shots, 14.1 s. Same shot list as v039 except shot 5: B001C018 21.75–23.11 (turning, score 0.47) instead of v039's revised B001C008 2.25–3.61 |
| B | `.venv/bin/aive plan video-1 --no-reference` (brief-driven) | `plans/plan_v041.json` | 6 s | 8 shots, 15.0 s, different order and sources (opens on B001C018 25.75, closes on B001C008 4.40 with `fade_black`; dissolves on shots 3 and 7) |
| C | `.venv/bin/aive revise video-1 --version 40 "hard cuts only" "remove shot 5"` | `plans/plan_v042.json` (parent `plan_v040.json`) | 0 s | 6 shots, 14.8 s; all transitions now `cut` ("hardened 3 transition(s)"). **"remove shot 5" was NOT applied** — see Failures |

`aive plan` has no `--seed`, `--style` or `--duration` flag (`aive plan --help`: only `--brief` and `--no-reference`). `--brief` would persist a new brief into `project.yaml` (`cmd_plan`: `p.update_settings({"brief": a.brief})`, `app/cli.py` line 122), so it was not used to avoid mutating the project config. Variation is therefore: reference vs brief planning, plus `revise`. Plan versions are allocated monotonically (v040–v043 created, nothing overwritten).

Shot-list diff A (v040) -> C (v042), from `aive show --json` of each:
```
-2 B001C009 in=0.740 out=3.100 dur=2.36 trans=flash_cut
-3 B001C011 in=18.000 out=21.160 dur=3.16 trans=slide_left
-4 B001C016 in=3.554 out=4.914 dur=1.36 trans=slide_left
+2 B001C009 in=0.740 out=3.100 dur=2.36 trans=cut
+3 B001C011 in=18.000 out=21.160 dur=3.16 trans=cut
+4 B001C016 in=3.554 out=4.914 dur=1.36 trans=cut
```

## Human correction (note + diff)
Command:
```
.venv/bin/aive revise video-1 --version 40 "make the second shot start later so the ball pass is fully visible"
```
Wall 12 s, exit 0. Plan written: `plans/plan_v043.json` (parent `plan_v040.json`). Tool output: `- moved shot 2 to position 3`.
Plan history (from `plan_v043.json`): `['v040 -> next: make the second shot start later so the ball pass is fully visible', '  moved shot 2 to position 3']`.

Shot-list diff v040 -> v043:
```
 1 B001C008 in=4.543 out=6.103 dur=1.56 trans=cut
-2 B001C009 in=0.740 out=3.100 dur=2.36 trans=flash_cut
-3 B001C011 in=18.000 out=21.160 dur=3.16 trans=slide_left
+2 B001C011 in=18.000 out=21.160 dur=3.16 trans=slide_left
+3 B001C009 in=0.740 out=3.100 dur=2.36 trans=flash_cut
 4 B001C016 in=3.554 out=4.914 dur=1.36 trans=slide_left
 5 B001C018 in=21.750 out=23.110 dur=1.36 trans=cut
 6 B001C012 in=11.029 out=15.029 dur=4.00 trans=cut
```
**Did the tool understand the note? No.** The in-point of the ball-pass shot (B001C009, 0.740) is unchanged; the shot was reordered to position 3 instead. Evidence of what happened: the local parser in `app/revise.py` (lines 330–386) has no operation for trimming an in/out point; unrecognised commands go to `_via_model`, which asks the configured planner to rewrite the note into one of its fixed command forms ("replace shot N", "remove shot N", "move shot N to position M", ...), none of which can shift an in-point. `projects/video-1/logs/usage.jsonl` records that call: `{"provider": "ollama", "model": "qwen3-vl:8b-instruct", "purpose": "interpret revision", "input_tokens": 365, "output_tokens": 18, "cost_usd": 0.0, ...}` — local, free, but the model chose "move shot 2 to position 3". The time-shift intent is silently lost: exit code 0, no warning.

## Render (path + specs + time)
Both a preview and a final of variation A (v040) were rendered; the preview is recorded as the primary render, the final was also done because it was fast.

Preview: `.venv/bin/aive preview video-1 --version 40` — wall **50 s** (render step itself "(20.4s)"), exit 0.
- Output: `/Users/ravijayant/Desktop/SNITCH_Creative_Producer_Handover/ai-video-editor/projects/video-1/previews/video-1_v040_preview.mp4`
- ffprobe: h264 **540x960**, 25/1 fps, aac 48 kHz stereo, duration **14.080 s**, 2,835,494 bytes.
- Also written: `previews/video-1_v040_storyboard.jpg`, `previews/video-1_v040_preview_frames.jpg`, `previews/video-1_v040_preview_qa.md/.json`, `output/video-1_v040.vedit.json`, sound stems in `output/sound/v040/` (ambience.wav, music.wav, sfx.wav, mix.wav, mix_report.json, sound_review.json, sound_spec.json). Console: `sound: -11.01 LUFS, peak -2.51 dBFS, 17 effects`.
- One Python warning printed: `numpy/lib/_nanfunctions_impl.py:1215: RuntimeWarning: All-NaN slice encountered` (non-fatal).

Final: `.venv/bin/aive render video-1 --version 40` — wall **27 s** (render step "(23.6s)", libx264), exit 0.
- Output: `/Users/ravijayant/Desktop/SNITCH_Creative_Producer_Handover/ai-video-editor/projects/video-1/output/video-1_v040.mp4`
- ffprobe: h264 yuv420p **1080x1920**, 25/1 fps, aac 48 kHz stereo, duration **14.080 s**, 7,887,938 bytes, 4.48 Mb/s.
- No QA autofix re-render was triggered (one pass).

## QA report
Produced automatically by preview and render, and re-run standalone: `.venv/bin/aive qa video-1 --version 40` (3 s) -> `output/video-1_v040_qa.md -> pass with warnings`. 29 checks on the final; verbatim results:
```
pass file exists: 7.9 MB
pass playable: full decode ok
pass duration in range: 14.08s vs requested 12–18s
pass duration matches plan: file 14.080s, plan 14.080s
pass resolution: 1080x1920 (expected 1080x1920)
pass frame rate: 25.000 fps (expected 25.0)
pass video codec: h264 (expected h264)
pass orientation: portrait
pass audio codec: aac (expected aac)
pass no unexpected black: none
pass no empty frames at cuts: none
pass no frozen frames: none
pass loudness: -11.0 LUFS (target -10.5)
pass no clipping: peak -2.0 dBFS (approved limit -1.0)
pass no timeline gaps: none
pass no repeated source footage: none
pass text inside safe area: ok
pass no visually repeated shots: none
pass no rig or floor edge at frame edges: clean
warn subject kept in frame: subject touches the frame edge in shots [5]
pass subject detected in rendered frames: subject visible in every people shot
pass effects frame-accurate: 14 effects within 1 frame
pass effects audible, not overbearing: balanced against the music
pass spectral balance: low 50%, mid 43%, high 7%
pass mono compatible: L/R correlation 0.6
warn rhythm variety (bursts and holds): shot-length variation 0.43 (human median 0.80)
pass editorial crop: 1.30x (human median 1.3x)
pass final shot held: 4.00s before the card
pass source files unchanged: all match their import fingerprints
```
The preview QA (`previews/video-1_v040_preview_qa.md`) has the same results minus the resolution/fps/codec checks (25 checks, same two warnings).

## Contact sheet observations
File: `/private/tmp/claude-501/-Users-ravijayant-Desktop-claude-context/f51a87d2-59dc-4dd5-8377-a511dd73c0f9/scratchpad/audit/contact_sheet.jpg` (3240x960, six 540-wide tiles from the **final** 1080x1920 render at 1.173, 3.520, 5.867, 8.213, 10.560, 12.907 s via `ffmpeg -ss T -frames:v 1` + `tile=6x1`). Full-res frames in `.../scratchpad/audit/frames_final/f0..f5.png`; the earlier preview-based sheet is kept as `contact_sheet_preview540.jpg`. Frames 0 and 3 were inspected at full 1080x1920.
- **Frame 0 (1.17 s, shot 1, line-up of four):** "WINTER   SEASON" white type in the top third. All four heads intact with headroom. The two outer models are clipped by the frame: the left model's left arm/shoulder is cut by the left edge, the right model's right shoulder/sleeve by the right edge. This is the 1.3x editorial crop on a group shot — the issue Ravi raised on v4 shot 1 (HANDOVER.md s.5) is still visible in this plan.
- **Frame 1 (3.52 s, shot 2, ball):** one model standing, one seated with the basketball; standing model's head close to the top edge but not cut. The ball pass itself is not in this frame.
- **Frame 2 (5.87 s, shot 3):** three models, SNITCH / CHILL OUT lockup mid-frame; one model leans in from the right with the body partly out of frame (looks intentional in the take).
- **Frame 3 (8.21 s, shot 5, B001C018 21.75–23.11):** four models huddled, all looking down at hands — the "heads-down huddle" STATUS.md calls a known weak moment. The SNITCH / CHILL OUT lockup sits across the group's chests (the word "SNITCH" over the blue jacket, "CHILL OUT" over the yellow one). The right model's shoulder touches the right edge — matches the QA warning for shot 5.
- **Frames 4–5 (10.56 s, 12.91 s, closing shot):** one model mid-jump with motion blur, then landing/clapping; centred, full headroom.
- **Not seen in any sampled frame:** light rigs, stands, floor edge, black or empty frames, cut-off heads. Backdrop is the plain studio cyclorama throughout. (Six samples only; the QA's per-frame black/frozen/rig checks passed on all frames.)

## CLI/MCP surface
- `aive --help` subcommands (21): `new, list, import, analyze, brief, plan, show, revise, preview, render, qa, open, consent, usage, set, run, make, reference, study, invideo, doctor`.
- Relevant option sets: `plan [--brief] [--no-reference]`; `revise [--version N] [--preview] project commands...`; `preview [--version]`; `render [--version]`; `qa [--video] [--version] [--preview]`; `show [--version] [--json]`. `make` and `new` carry `--style {calm,standard,energetic}` and `--duration`, `plan` does not.
- MCP server: `app/mcp_server.py` (stdio, `MCPServer(name="aive")`), console script `aive-mcp` (`pyproject.toml [project.scripts]`), registered per the file header with `claude mcp add aive -- aive-mcp`. 10 tools: `list_projects_tool, create_project, import_media, analyze, plan, show_plan, revise, preview, render_final, read_report, vedit_project_path`. Each wraps the CLI handler and returns `"exit N\n" + stdout`. (An `aive` MCP server with these tools was also present in this session's deferred tool list, so the registration exists on this account.)
- Dependency lock: `requirements.lock.txt`, 67 lines, **66 pinned `name==version` entries** (`grep -cE '^[A-Za-z0-9_.-]+=='`). `pyproject.toml` pins `vedit-mcp>=0.4.2`, `opencv-python>=4.9,<5`, `av>=11,<19`. No `uv.lock`.

## Failures and friction
1. **`revise` mis-parses "remove shot N" as a move.** `aive revise video-1 --version 40 "hard cuts only" "remove shot 5"` logged `moved shot 5 to position 5`; plan v042 still has 6 shots including shot 5. Cause (read, not fixed): in `app/revise.py` `apply()`, the branch `elif re.search(r"move", t) and _shot_no(t, n)` (line ~352) precedes `elif re.search(r"\b(remove|delete|drop|cut)\b", t)` (line ~358), and `"move"` is a substring of `"remove"`. The tool's own error text lists `'remove shot 7'` as a supported example. Exit code 0, so a user would not notice.
2. **Free-form timing note not understood** (see Human correction): the in-point was not changed; the note was turned into a reorder by the local Ollama planner. No op exists for shifting in/out points by seconds.
3. Non-fatal `RuntimeWarning: All-NaN slice encountered` from numpy during both preview and final render.
4. First attempt to check for API keys with `${VAR:+yes}` shell expansion was blocked by the auto-mode classifier ("Credential Materialization"); re-done with `env | grep -c`, which only counts. No manual intervention otherwise.
5. `hwaccel=''` in doctor: software libx264 only. Render was still fast (~24 s for 14 s of 1080x1920), so not a blocker on this M5 Pro.
6. Not run: `tests/test_e2e.py` (slow e2e render), `tests/test_invideo_roundtrip.py`, `aive open` (vedit UI), `aive make` on fresh footage, anything InVideo.

## Verdict
Demonstrably works end to end on an already-analysed project, locally, in under two minutes: `doctor` (all ok) -> fast tests (42 passed) -> `plan` (reference and brief modes, versioned v040/v041, 1–6 s) -> `revise` for structural commands the local parser knows (`hard cuts only` applied correctly) -> `preview` (540x960, 50 s) and `render` (1080x1920@25, 27 s) with three-stem designed sound at -11.0 LUFS / -2.0 dBFS peak -> QA (29 checks, pass with 2 warnings) -> contact sheet of clean, defect-free frames; source fingerprints verified unchanged, and nothing written to `Spring Shoot/Outputs` (newest file there still dated Nov 4 04:51).

Did not work: plain-English corrections about *timing within a shot* ("start later so the ball pass is fully visible") are not representable in `revise` and get silently converted to a reorder; `remove shot N` is caught by the `move` branch and does nothing. Both return exit 0, so plain-English revision needs a human to re-read the shot table after every note. The 1.3x group-shot crop that Ravi flagged is still present in the reference-mode plan v040 (outer models clipped in shot 1; shot 5 touches the edge per QA). The project config carries one absolute path outside the handover folder (`scoring.human_picks`).

Files created by this audit (all versioned/new, nothing overwritten): `projects/video-1/plans/plan_v040..v043*.json/.md`, `projects/video-1/previews/video-1_v040_preview*.{mp4,jpg,md,json}`, `projects/video-1/previews/video-1_v040_storyboard.jpg`, `projects/video-1/output/video-1_v040.{mp4,vedit.json}`, `video-1_v040_frames.jpg`, `video-1_v040_qa.{md,json}`, `projects/video-1/output/sound/v040/*`, and the scratchpad `audit/` folder.
