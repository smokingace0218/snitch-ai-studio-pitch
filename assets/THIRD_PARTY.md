# Third-party code and assets

**No third-party JavaScript or CSS libraries are used.** The page is hand-written HTML, CSS and JavaScript so it runs offline from a file with nothing to vendor or update.

| Item | Source | Licence / terms | Where |
|---|---|---|---|
| Helvetica Now Display / Text | installed on the presenting Mac (user fonts) | SNITCH's own licensed brand face; **not copied into this folder**; the CSS falls back to Helvetica Neue → Helvetica → Arial if absent | `assets/style.css` `--display`, `--text` |
| Narration voice | macOS `say`, voice **Tara** (en_IN), generated locally | Apple system voice; audio files generated on this Mac | `assets/audio/*.m4a` via `tools/build.py` |
| SNITCH wordmark | `SNITCH_Creative_Producer_Handover/assets/brand/snitch_word.png` | SNITCH brand asset | `assets/img/snitch_word.png` |
| Films (720p copies) | `Spring Shoot/Outputs`, `Spring Shoot/Video 1 Ref & Raw Clips`, `ai-video-editor/projects/video-1/output/video-1_v040.mp4` | SNITCH footage; the human reference reel is the editors' work; originals untouched | `assets/video/` |
| Review sheets, contact sheet, scene-swap frame | the editor project's `output/review/`, `claude context/audit-contact-sheet-video-1-v040.jpg`, `SNITCH_AI_Lab/kontext_before_after.jpg` | project outputs; the scene-swap was made with Flux Kontext dev (**non-commercial licence**, test only) | `assets/img/` |

Animation guidance: the `iart-ai/web-animation-skills` pack (MIT; svg-animation, 60fps-animation, accessible-animation, micro-interaction, gsap-web) installed to `claude context/.agents/skills/` on 2026-11-05. Only its guidance is used; no GSAP or other library is loaded by the page.

Kokoro (MIT) was evaluated for narration and installed in a scratch environment; its bundled espeak loader failed on this Mac and the model did not download, so it is not used. `tools/build.py` keeps an engine switch (`PITCH_TTS=kokoro`) for a later swap.


## Current edition correction · 5 November 2026

The older statement above that Kokoro was not used is superseded. The current narration uses the installed local Kokoro Heart voice and cached weights. No model download, original-media upload or paid API call was made for this revision. New code-native HTML/CSS visuals and footage-derived stills were authored locally. FFmpeg created a silent 12-second montage from existing pitch copies. Original films and source projects remain untouched.
