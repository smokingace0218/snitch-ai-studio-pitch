# SNITCH AI Photoshoot Studio: product spec v1

2026-11-05. From Shruti's description of how it should work at SNITCH; written as the thing we build. Item 8 of the final eight.

## The workflow as SNITCH wants it

1. A person at SNITCH photographs a product on a phone from several angles (front, back, side, detail, on a hanger or mannequin).
2. They tell the agent what kind of shoot it is (indoor / outdoor / studio) and the styling theme (street style, editorial, traditional, fusion, old money, and more).
3. The agent suggests models from a library of **model personalities** that fit the product and the theme; the user filters and picks.
4. The agent produces a complete, professional shoot: a contact sheet of shots, consistent model, light and setting.
5. The user can add accessories or extra styling on the model to showcase the product better; the agent re-renders.
6. Approved images go to the library, tagged with the SKU, ready for the channels.

## The five screens (what you design)

**1. Capture.** A phone-first upload with a small guide: which angles, plain background, daylight or a bright room, no filters, fill the frame. The agent checks each photo on arrival (sharpness, exposure, background clutter, colour cast) and asks for a retake with one line ("too dark; stand near a window"). It auto-cleans: background removal, white balance to a neutral card, perspective straightening. Output: a clean garment reference set per SKU. If the product exists in the Shopify feed, its feed photos join the set automatically.

**2. Brief.** Three choices and a few optional ones. *Shoot type:* studio / indoor / outdoor. *Theme:* street style, editorial, traditional, fusion, old money, minimal, sport, festive (each theme is a preset: setting, light, lens, pose energy, colour mood, and reference images you curate once). *Product focus:* what must be visible (collar, print, fit, fabric). Optional: occasion, season, time of day, a mood board.

**3. Model picker.** The agent proposes 3–6 model personalities from SNITCH's owned library that suit the product and theme (a corduroy shirt + old money → calm, tailored, early thirties; a graphic tee + street → energetic, early twenties). Each card: name, look, build, skin tone, hair, attitude, the themes it suits, sample shots. Filters: build, skin tone, age range, attitude, hair. The user picks one (or two for a duo shot). Every personality is an **owned identity** with a consistent face across every shoot and consent handled once.

**4. Shoot.** The agent writes the shot list from theme + product focus (full-length, three-quarter, detail, movement, a sitting or leaning shot, a back view if the product has a back detail), renders 4–8 candidates per shot, runs the fidelity checks, and shows a **contact sheet** like a real shoot. Each frame shows the garment reference beside it. Actions per frame: approve, reject, redo with a note ("more daylight", "looser pose"), and **style it**: add accessories or layers.

**5. Style and finish.** The add-on panel offers accessories and layers **from SNITCH's own catalogue first** (sunglasses, caps, bags, overshirts, trousers, shoes from the feed), so every add-on is a real product and a cross-sell, with generic options (a watch, a scarf) when the catalogue has none. The agent re-renders the chosen frames with the add-on, keeping everything else. Finish: colour grade preset per theme, grain, crop ratios per channel (4:5 feed, 9:16 story/reel cover, 1:1, 3:4 PDP), upscale, "AI-generated" tag in metadata, export to the library with SKU, theme, model and add-on tags.

## The pipeline under it

| Step | How | Tool |
|---|---|---|
| Intake QC and cleanup | sharpness/exposure/clutter checks, background removal, white balance, straighten | local (OpenCV, rembg) |
| Garment reference set | 3–6 cleaned angles per SKU + feed photos | library |
| Theme presets | setting, light, lens, pose energy, colour mood, 3–6 references each | curated by you, stored as JSON + images |
| Model library | owned identities: a reference set of the face from several angles (and later a trained LoRA for stronger consistency), a personality card, consent record | built once, grown over time |
| Model suggestion | Claude scores personalities against product type, theme and focus; returns 3–6 with reasons | Claude |
| Shot list and photographer's brief | per shot: camera, lens, light, pose, set, "must keep" (garment, colour, print, labels), "may change" (setting, props) | Claude |
| Generation (tests) | Flux Kontext locally, garment photo locked | ComfyUI on this Mac (non-commercial, tests only) |
| Generation (production) | multi-reference edit: garment refs + model identity refs + theme refs + previous approved shot, 2K/4K | Nano Banana Pro or Seedream via the Weave connector (verified available), or BFL/fal APIs; paid per image |
| Fidelity checks | garment colour vs reference, logo/print similarity, edge continuity, hands and limbs, face similarity to the chosen identity | local (OpenCV, CLIP, face embedding) |
| Contact sheet and actions | approve / reject / redo / style it | the web app (FastAPI + React) |
| Add-ons | catalogue items as references in a second edit pass on the approved frame | same editors |
| Finish | grade per theme, grain, crops, upscale, metadata tag | local (our grading, Real-ESRGAN) |
| Library | SKU, theme, model, add-ons, rights, channel crops | the asset library (item 3) |

## Why phone photos are enough, and when they aren't

Enough when the capture guide is followed: the editors need the garment's true colour, print and construction, not studio polish; cleanup handles the rest. Not enough when the photo is blurred, colour-cast, or hides the detail the shoot must show; the intake check catches that before anyone waits on a render. For the first weeks the feed's own product photos act as a safety net for every SKU already online.

## What makes it look like a real shoot, not AI

1. Real garment pixels locked as references; never described in words alone.
2. A photographer's brief (body, lens, light, pose, set, imperfections) generated from the theme preset, not a generic prompt.
3. One identity, one light setup, one lens across a set, enforced by feeding the first approved frame into the rest.
4. Finish like a shoot: grade, grain, crops, retouch-level QA at full size.
5. A human eye on the contact sheet, always.

## Edge cases specific to this product
- **Phone photo of a product on a person at SNITCH** (a colleague wearing it): the colleague's face must never appear in output; intake blurs/removes faces and the shoot uses the owned identity only.
- **Products with text or logos**: the check compares the rendered logo to the reference; a drifted logo is a reject, never a retouch.
- **Transparent or very dark/very light garments**: known hard cases; the intake flags them and the shoot uses the feed's studio photo as the primary reference.
- **Theme and product mismatch** (sportswear + old money): the agent warns and suggests the two closest themes.
- **Two models**: both identities as references; the check confirms each face matches its identity.
- **Accessories not in the catalogue**: generic add-on, tagged so marketing knows there's nothing to link.
- **Ratio and safe zones per channel**: crops generated from a 4:5 master with the product centred; reels covers keep the product out of UI overlays.
- **Repeat shoots of the same SKU**: the library offers the previous set and the same identity for continuity, unless the brief asks for a new look.
- **Cost control**: per-brief cap (e.g., 40 images), local tests before hosted runs, every hosted run approved with a quoted cost.

## Build order
1. Theme presets (you curate references for 6 themes) and 2 owned model identities.
2. Capture screen + intake checks + cleanup, tested on 5 real phone photos.
3. Model picker with Claude's suggestions and filters.
4. Shoot: shot list + local Kontext candidates + fidelity checks + contact sheet (test quality on 3 SKUs).
5. Hosted generation (Nano Banana Pro / Seedream) for one SKU with your approval of the cost; compare with local.
6. Style-it add-ons from the catalogue; finish and export; library tagging.
7. Stylist's first real shoot; judge by eye; decide the production model and the PDP trial.

## What this needs from SNITCH
Product photos (phone, following the guide), a stylist's time for the theme presets and the first shoot, the feed (have), sign-off on AI-imagery disclosure and on owned model identities, and an approved image budget (₹2–5k for the trial; ₹5–40 per production image).
