/* SNITCH AI studio pitch — vanilla JS. Scenes come from assets/scenes.js (generated from scenes/*.json). */
(function () {
  'use strict';
  const S = window.PITCH_SCENES.filter(s => s.layout);
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CH = {0:'Start',1:'The ideas'};
  const BADGE = { built: 'Built & tested', prototype: 'Prototype', access: 'Needs SNITCH access', experimental: 'Experimental' };
  const ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2l11 6-11 6z"/></svg>',
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>',
    prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 2L4 8l7 6z"/></svg>',
    next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2l7 6-7 6z"/></svg>',
    replay: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3a5 5 0 1 1-4.9 6h1.6A3.5 3.5 0 1 0 8 4.5V7L4 3.5 8 0z"/></svg>'
  };
  const badge = (k, extra) => `<span class="badge ${k}">${esc(BADGE[k] || k)}${extra ? ' · ' + esc(extra) : ''}</span>`;

  /* ---------- state ---------- */
  const stage = $('#stage'), cap = $('#caption'), audio = new Audio();
  let idx = 0, mode = 'auto', started = false, fired = [], timer = null, agentUntil = null;
  audio.preload = 'auto';

  /* ---------- layouts (HTML string per scene) ---------- */
  const video = (f, key) => `<div class="film"><video data-video="${key}" src="${f.src}" poster="${f.poster}" preload="metadata" muted playsinline loop controls controlslist="nodownload"></video><div class="label">${esc(f.label)}</div></div>`;
  const list = (a, cls, pre) => `<ul class="${cls || ''}">${a.map((x, i) => `<li class="cue" data-cue="${pre}:${i}">${esc(x)}</li>`).join('')}</ul>`;

  const L = {};
  L.cover = s => `<section class="scene cover">
      <h1>${esc(s.title)}</h1>
      <p class="lede cue" data-cue="show:name">${esc(s.lede)}</p>
      <p class="cue muted" data-cue="show:offline">Runs offline from this laptop. Every number is from a logged test run on 5 November 2026.</p>
      <div class="badge-row cue" data-cue="show:badges">${['built', 'prototype', 'access', 'experimental'].map(b => badge(b)).join('')}</div>
      <div class="cover-actions"><button class="btn" id="startBtn">${ICON.play} Start the pitch</button><button class="btn ghost" id="exploreBtn">Explore instead</button></div>
      <p class="small">Keys: <kbd>→</kbd> next · <kbd>←</kbd> back · <kbd>space</kbd> play/pause · <kbd>M</kbd> mode · <kbd>N</kbd> presenter notes · <kbd>E</kbd> evidence · <kbd>?</kbd> help</p>
    </section>`;

  L.eight = s => `<section class="scene"><div class="scene-head"><h1>${esc(s.title)}</h1></div>
      <ol class="eight">${s.items.map((it, i) => `<li class="cue" data-cue="item:${i}"><button data-go="${i + 2}"><span class="n num">${it.n}</span><span><b>${esc(it.name)}</b><span class="line">${esc(it.line)}</span></span>${badge(it.badge)}</button></li>`).join('')}</ol>
      <div class="badge-row cue" data-cue="show:legend"><span class="small">Labels:</span>${['built', 'prototype', 'access', 'experimental'].map(b => badge(b)).join('')}</div></section>`;

  const diagram = d => {
    const n = d.nodes.length, W = 1200, w = 140, gap = (W - 40 - n * w) / (n - 1), y = 36, h = 90;
    const pos = {}; d.nodes.forEach((nd, i) => pos[nd.id] = 20 + i * (w + gap));
    const edges = d.edges.map(([a, b, lab], i) => { const x1 = pos[a] + w, x2 = pos[b]; return `<g><path class="edge" d="M${x1} ${y + h / 2} L${x2 - 8} ${y + h / 2}" marker-end="url(#arr)"/><text class="edge-label" x="${(x1 + x2) / 2}" y="${y + h / 2 - 10}" text-anchor="middle">${esc(lab)}</text></g>`; }).join('');
    const nodes = d.nodes.map((nd, i) => { const lines = wrap(nd.label, 15); return `<g class="node ${nd.type}" data-node="${nd.id}" tabindex="0" role="button" aria-label="${esc(nd.label)}: ${esc(nd.detail)}"><rect x="${pos[nd.id]}" y="${y}" width="${w}" height="${h}" rx="10"/><text class="kind" x="${pos[nd.id] + 12}" y="${y + 22}">${nd.type}</text>${lines.map((t, k) => `<text x="${pos[nd.id] + 12}" y="${y + 48 + k * 19}">${esc(t)}</text>`).join('')}</g>`; }).join('');
    return `<figure class="diagram"><svg viewBox="0 0 ${W} 150" role="img" aria-label="${d.nodes.map(x => x.label).join(' → ')}"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5 0 10z" fill="currentColor"/></marker></defs>${edges}${nodes}</svg>
      <div class="diagram-list">${d.nodes.map(nd => `<button data-node="${nd.id}"><b>${esc(nd.label)}</b><span class="small">${esc(nd.type)}</span></button>`).join('')}</div>
      <figcaption>The parts behind this idea, for the engineer who checks my work. Click a part.</figcaption></figure><div class="node-detail" aria-live="polite"><p class="small">Select a part to read what it takes in, what it uses and what it must never do.</p></div>`;
  };
  const wrap = (t, n) => { const out = []; let line = ''; t.split(' ').forEach(wd => { if ((line + ' ' + wd).trim().length > n) { out.push(line.trim()); line = wd; } else line += ' ' + wd; }); if (line.trim()) out.push(line.trim()); return out.slice(0, 2); };

  L.idea = s => { const e = s.engineering; const ul = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; return `<section class="scene">
      <div class="idea-head"><h1><span class="idx num">${s.num}</span>${esc(s.title)}</h1>${badge(s.badge)}</div>
      <div class="tabs" role="tablist"><button role="tab" data-layer="idea" aria-selected="true">The idea</button><button role="tab" data-layer="how" aria-selected="false">How it will work</button><button role="tab" data-layer="eng" aria-selected="false">Engineering</button></div>
      <div class="layer active" data-layer="idea"><div class="idea-grid">
        <div><p class="big">${esc(s.what)}</p><div class="cue block" data-cue="show:why"><h3>The thinking behind it</h3><p>${esc(s.why)}</p></div></div>
        <div class="cue block approved" data-cue="show:approved"><h3>What you approved</h3>${list(s.approved, 'ticks', 'ap')}</div>
      </div><div class="note cue" data-cue="show:status"><b>Where it stands.</b> ${esc(s.badgeNote)}</div></div>
      <div class="layer" data-layer="how"><div class="idea-grid"><div><h3>How it will work</h3><ol class="steps-list">${s.steps.map((x, i) => `<li class="cue" data-cue="st:${i}">${esc(x)}</li>`).join('')}</ol></div><div class="block"><h3>What it needs</h3>${ul(s.needs)}</div></div></div>
      <div class="layer" data-layer="eng"><p class="small">My engineering plan for the engineer who checks it. Not part of the pitch; everything here is defined again with SNITCH before it is built.</p>${s.diagram ? diagram(s.diagram) : ''}<div class="eng">
        <div><h3>Models</h3>${ul(e.models)}</div><div><h3>Agents</h3>${ul(e.agents)}</div><div><h3>Parts and connections</h3>${ul(e.apis)}</div>
        <div><h3>Running cost (estimate)</h3><div class="cost">${esc(e.costs.hosted)}</div><div class="est">hosted route</div><div class="cost" style="margin-top:8px">${esc(e.costs.box)}</div><div class="est">with the office workstation</div></div>
        <div><h3>Limits</h3>${ul(e.limits)}</div><div><h3>Needs</h3>${ul(e.needs)}</div>
      </div></div></section>`; };

  L.proto = s => `<section class="scene"><div class="scene-head"><h1>${esc(s.title)}</h1></div>
      <div class="films">${s.films.map(f => video(f, f.id)).join('')}</div>
      <p class="cue muted" data-cue="show:learn">Each note from our senior editor became a permanent rule: who is ready before a take is picked, the whole group kept in frame, a shot started where the action starts.</p>
      <div class="split"><div class="steps">${s.steps.map((t, i) => `<div class="step cue" data-cue="step:${i}"><span class="cmd">${esc(t.cmd)}</span><span class="res">${esc(t.result)}</span></div>`).join('')}</div>
      <div class="bugs cue" data-cue="show:honest">${s.honest.map(b => `<div class="bug"><p>${esc(b)}</p></div>`).join('')}</div></div>
      <p class="small">This morning's run on a real project; every result is in the evidence panel. Films play muted; use their controls for sound.</p></section>`;

  const gantt = r => { const W = 640, left = 150, wk = (W - left - 20) / 12; return `<figure class="chart"><svg viewBox="0 0 ${W} 150" role="img" aria-label="Twelve-week roadmap in four phases">${Array.from({ length: 13 }, (_, i) => `<line class="grid" x1="${left + i * wk}" y1="20" x2="${left + i * wk}" y2="130"/>${i < 12 && i % 2 === 0 ? `<text x="${left + i * wk + wk}" y="14" text-anchor="middle">wk ${i + 1}</text>` : ''}`).join('')}
      ${r.map((p, i) => `<text class="t" x="0" y="${42 + i * 26}">${esc(p.phase)}</text><rect class="ph cue" data-cue="phase:${i}" x="${left + (p.weeks[0] - 1) * wk + 1}" y="${30 + i * 26}" width="${(p.weeks[1] - p.weeks[0] + 1) * wk - 2}" height="16" rx="4"/>`).join('')}</svg>
      <figcaption>Twelve weeks, four phases.</figcaption></figure>`; };
  const costChart = (c, note) => { const W = 640, left = 150, max = 22, sx = (W - left - 20) / max, rowH = 30; return `<figure class="chart"><div class="legend"><span><i class="h"></i>hosted route</span><span><i class="b"></i>with the office workstation</span></div><svg viewBox="0 0 ${W} ${c.length * rowH + 30}" role="img" aria-label="Estimated monthly running cost per idea, hosted route versus office workstation, in thousand rupees">
      ${[0, 5, 10, 15, 20].map(v => `<line class="grid" x1="${left + v * sx}" y1="6" x2="${left + v * sx}" y2="${c.length * rowH + 8}"/><text x="${left + v * sx}" y="${c.length * rowH + 24}" text-anchor="middle">₹${v}k</text>`).join('')}
      ${c.map((r, i) => `<text class="t" x="0" y="${22 + i * rowH}">${esc(r.system)}</text><rect class="h" x="${left + r.hosted[0] * sx}" y="${10 + i * rowH}" width="${Math.max(3, (r.hosted[1] - r.hosted[0]) * sx)}" height="8" rx="2"/><rect class="b" x="${left + r.box[0] * sx}" y="${20 + i * rowH}" width="${Math.max(3, (r.box[1] - r.box[0]) * sx)}" height="8" rx="2"/>`).join('')}</svg><figcaption>${esc(note)}</figcaption></figure>`; };

  L.close = s => `<section class="scene"><div class="scene-head"><h1>${esc(s.title)}</h1></div>
      <div class="role cue" data-cue="show:role"><div class="cue" data-cue="role:me"><h3>I design, build and run</h3><ul>${s.role.me.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="snitch cue" data-cue="role:snitch"><h3>SNITCH grants (four things)</h3><ul>${s.role.snitch.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div class="cue" data-cue="role:outside"><h3>Outside touches</h3><ul>${s.role.outside.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
      <div class="charts"><div class="cue" data-cue="show:roadmap">${gantt(s.roadmap)}<ul class="small" style="padding-left:18px">${s.roadmap.map(p => `<li><b>${esc(p.phase)}</b> (weeks ${p.weeks[0]}–${p.weeks[1]}): ${esc(p.items)}</li>`).join('')}</ul></div>
        <div class="cue" data-cue="show:costs">${costChart(s.costs, s.costNote)}</div></div>
      <div class="end cue" data-cue="show:end"><img src="assets/img/snitch_word.png" alt="SNITCH"><p class="small">Eight ideas I can stand behind. Thank you.</p></div></section>`;

  L.explain = s => { const eng=s.engineering; const ul=a=>`<ul>${(a||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;return `<section class="scene explain">
 ${window.EDITIONS?.render(s)||''}${s.agents||s.kind==='eight'||s.id==='cover'||s.kind==='connected-close'?`<div class="restored-animation"><div class="frame animated-explanation"><div class="diagram-canvas">${window.ILL.render(s)}${s.kind==='connected-close'?'<section class="end-slate cue" data-cue="fr:end-slate"><img src="assets/img/snitch_word.png" alt="SNITCH"><p>Eight ideas. One connected studio.</p><h2>Thank you.</h2><strong>Questions?</strong></section>':''}${s.kind==='producer'?`<section class="mvp-output-grid cue" data-cue="fr:outputs" aria-label="The five selected final films"><header><small>EDIT MVP · YOUR SELECTED FINAL OUTPUTS</small><h2>Your five selected final films.</h2><button data-mvp-close>Back to animation</button></header><div>${s.reel.map((f,i)=>`<figure><video data-selected-film="${i}" src="${f.src}" poster="${f.poster}" muted playsinline loop controls preload="metadata" aria-label="${esc(f.label)}"></video><figcaption>${i+1}. ${esc(f.label)}</figcaption><button data-selected-play="${i}">▶ Play full film</button></figure>`).join('')}</div><p>Choose Play full film for picture and sound. Narration pauses while your chosen film plays.</p></section>`:(window.OUTCOMES?.render(s)||'')}</div></div><div class="agent-explanation" aria-live="polite">The animation builds with the narration. Select an agent in Explore to inspect its job.</div><div class="agent-inspector" hidden></div><nav class="step-nav" aria-label="Replay animated explanation">${s.narration.map((n,j)=>`<button data-step-index="${j}" aria-label="Replay animated step ${j+1}">${j+1}</button>`).join('')}</nav>${s.kind==='producer'?'<div class="outcome-open-row"><button class="outcome-open" data-mvp-show>Show the five selected final films</button></div>':s.agents?'<div class="outcome-open-row"><button class="outcome-open" data-outcome-open>Replay the illustrated workflow</button></div>':''}</div>`:window.SHOW.render(s)}
 ${s.id==='cover'?`<div class="cover-actions"><button class="btn" id="startBtn">${ICON.play} Start presentation</button><button class="btn ghost" id="exploreBtn">Explore instead</button></div>`:''}
 ${s.kind==='early-showcase'?window.FINAL_SHOWCASE.render(s):''}
 <details class="engineering-depth"><summary>Explore the complete workflow, engineering and specifications</summary><div>
 
 ${s.what?`<h2>The proposal in detail</h2><p>${esc(s.what)}</p><p>${esc(s.why)}</p><div class="spec-grid"><div><h3>Approved scope</h3>${ul(s.approved)}</div><div><h3>Workflow</h3>${ul(s.steps)}</div><div><h3>Needs</h3>${ul(s.needs)}</div></div>`:''}
 ${eng?`<div class="spec-grid"><div><h3>Models + tools</h3>${ul(eng.models)}</div><div><h3>Agents</h3>${ul(eng.agents)}</div><div><h3>Connections</h3>${ul(eng.apis)}</div><div><h3>Running costs · estimates</h3><p>Hosted: ${esc(eng.costs.hosted)}</p><p>Workstation: ${esc(eng.costs.box)}</p></div><div><h3>Limits and build status</h3>${ul(eng.limits)}</div><div><h3>Dependencies</h3>${ul(eng.needs)}</div></div><p>${esc(s.badgeNote)}</p>`:''}
 <h3>Evidence</h3>${s.evidence.map(x=>`<div class="ev"><b>${esc(x.claim)}</b><span class="src">${esc(x.source)}</span><span class="val">${esc(x.value)}</span></div>`).join('')}
 <h3>Presenter context</h3><p>${esc(s.notes.technical)}</p><p>${esc(s.notes.implementation)}</p>
 </div></details>${s.reel&&s.kind!=='early-showcase'?window.FINAL_SHOWCASE.render(s):''}
 ${s.agents?`<details class="supporting-demo"><summary>Open the real footage, comparisons and annotated demonstrations</summary>${window.SHOW.render(s)}</details>`:''}
 </section>`; };

  L.appendix = s => `<section class="scene appx"><div class="scene-head"><h1>${esc(s.title)}</h1></div>
      <h3>Readiness matrix</h3><div class="qa-table" style="max-height:none"><table><thead><tr>${s.matrix[0].map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.matrix.slice(1).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <h3>One platform, eight products</h3><div class="arch">${s.architecture.nodes.map(n => `<div>${esc(n.label)}</div>`).join('')}</div>
      <h3>Build vs buy</h3><table><thead><tr><th>Need</th><th>Decision</th><th>Why</th></tr></thead><tbody>${s.buildbuy.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <h3>Day-one fixes to next steps</h3><ul>${s.fixes.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>`;

  /* ---------- render + interactions ---------- */
  function render(i) {
    idx = i; delete document.body.dataset.replaying;agentUntil = null; const s = S[i]; audio.src = s.audio + '?rev=67'; audio.currentTime = 0; fired = []; reelAt = null; reelOn = false; filmActive = false; $('.player').classList.remove('reel');
    if (!L[s.layout]) { stage.innerHTML = '<section class="scene"><h2>This page needs a fresh reload</h2><p>Press ⌘R (or ⌘⇧R) to load the current version.</p></section>'; return; }
    $$('video', stage).forEach(v => v.pause()); stage.innerHTML = L[s.layout](s); stage.scrollTop = 0;
    $$('.rail button').forEach(b => b.setAttribute('aria-current', String(+b.dataset.ch === s.chapter)));
    $('#pos').innerHTML = `<b>${esc(CH[s.chapter])}</b>${i + 1} / ${S.length}`;
    cap.textContent = mode === 'explore' && s.narration[0] ? s.narration[0].text : (s.reel ? s.reel.length + ' selected films, ready to play.' : '');
    if (mode === 'explore') $$('.layer', stage).forEach(l => l.classList.toggle('active', l.dataset.layer === 'idea'));
    bind(s); window.SHOW.set(stage,s,0); if (s.edition === 'short') window.SHORT_STORY?.tick(stage, s, 0, mode); if (s.id === 'cover') cue('fr:0'); if (s.reel) reelSetup(s);
    if (!$('#evidence').hidden) fillEvidence(); if (!$('#notes').hidden) fillNotes();
    try { localStorage.setItem('pitch-idx', i); } catch (e) { }
  }
  function bind(s) {
 $$('[data-selected-play]',stage).forEach(b=>b.addEventListener('click',()=>{setMode('explore');const thumb=$('.reel-thumb[data-reel="'+b.dataset.selectedPlay+'"]',stage);thumb?.click();$('.selected-showcase',stage)?.scrollIntoView({block:'start',behavior:'auto'});}));

 $('[data-mvp-show]',stage)?.addEventListener('click',()=>{setMode('explore');const g=$('.mvp-output-grid',stage);g.dataset.open='true';g.classList.add('on');$$('video',g).forEach(v=>{v.muted=true;v.play().catch(()=>{});});});
 $('[data-mvp-close]',stage)?.addEventListener('click',()=>{setMode('explore');const g=$('.mvp-output-grid',stage);g.dataset.open='false';g.classList.remove('on');$$('video',g).forEach(v=>v.pause());});
    $('#sceneJump',stage)?.addEventListener('change',e=>go(+e.target.value));
    $$('.restored-animation > .step-nav [data-step-index],.supporting-demo [data-step-index],.walkthrough [data-step-index]',stage).forEach(b=>b.addEventListener('click',()=>replayStep(+b.dataset.stepIndex)));

    $('[data-play-finals]', stage)?.addEventListener('click', () => { reelStart(s); $('#reelVideo')?.scrollIntoView({block:'nearest',behavior:'auto'}); });
    window.OUTCOMES?.bind(stage, () => setMode('explore'));
    $('[data-format-toggle]', stage)?.addEventListener('click', e => { setMode('explore'); const p = $('.format-demo.full', stage); if (!p) return; const open = p.dataset.open !== 'true'; p.dataset.open = String(open); p.classList.remove('gone'); e.currentTarget.textContent = open ? 'Back to the films' : 'Show screen-format previews'; $$('video', p).forEach(v => { v.muted = true; if (open) v.play().catch(() => {}); else v.pause(); }); });
    $$('[data-agent]', stage).forEach(el => { const h = () => inspectAgent(s, +el.dataset.agent); el.addEventListener('click', h); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h(); } }); });

    $('#startBtn')?.addEventListener('click', () => { started = true; setMode('auto'); playScene(); });
    $('#exploreBtn')?.addEventListener('click', () => { setMode('explore'); });
    $$('[data-layer][role=tab]', stage).forEach(t => t.addEventListener('click', () => setLayer(t.dataset.layer)));
    $$('.node,.diagram-list button', stage).forEach(n => { const h = () => showNode(s, n.dataset.node); n.addEventListener('click', h); n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h(); } }); });
    $$('[data-go]', stage).forEach(b => { b.addEventListener('click', () => go(+b.dataset.go)); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(+b.dataset.go); } }); });
    $$('.out', stage).forEach(o => o.addEventListener('click', () => { $('.node-detail', stage).innerHTML = `<h3>${o.querySelector('b').textContent}</h3><p>${esc(o.dataset.detail)}</p>`; }));
    $$('.annot', stage).forEach(a => a.addEventListener('click', () => { const v = $(`[data-video="${a.dataset.seek}"]`, stage); if (v) { v.currentTime = +a.dataset.t; v.play(); } }));
    $$('.prop button', stage).forEach(b => b.addEventListener('click', () => { const p = b.closest('.prop'); p.dataset.state = b.dataset.act === 'edit' ? '' : b.dataset.act; if (b.dataset.act === 'edit') { const c = p.querySelector('.cap'); c.contentEditable = 'true'; c.focus(); } }));
    const r = $('.cmp input', stage); if (r) r.addEventListener('input', () => r.parentElement.style.setProperty('--x', r.value + '%'));
    $$('.ph', stage).forEach((b, i) => b.addEventListener('mouseenter', () => { b.closest('.cue').querySelectorAll('li')[i]?.scrollIntoView?.({ block: 'nearest' }); }));
  }
  function inspectAgent(s, index) { const a = s.agents?.[index]; if (!a) return; setMode('explore'); const bar = $('.agent-explanation', stage); if (bar) bar.innerHTML = '<b>' + esc(a.name) + '</b><span>' + esc(a.input) + ' → ' + esc(a.output) + '</span>'; $$('[data-agent]', stage).forEach(el => el.classList.toggle('agent-selected', +el.dataset.agent === index)); const p = $('.agent-inspector', stage); p.hidden = false; const j = s.narration.findIndex(n => n.cues.includes('fr:' + a.f)); p.innerHTML = `<h3>${esc(a.name)}</h3><dl><dt>Input</dt><dd>${esc(a.input)}</dd><dt>Output</dt><dd>${esc(a.output)}</dd><dt>Tools</dt><dd>${esc(a.tools)}</dd><dt>Never</dt><dd>${esc(a.never)}</dd></dl>${j >= 0 ? '<button class="agent-replay">Replay this agent’s explanation</button>' : ''}`; const demo = $('.format-demo.mini', stage); if (demo) demo.style.display = a.f === 'a6' ? '' : 'none'; $('.agent-replay', p)?.addEventListener('click', () => { stopAudio(); fired = Array.from({length:j}, (_,k) => k); agentUntil = s.timing[j + 1] != null ? s.timing[j + 1] - 0.04 : s.duration; const start = () => { audio.currentTime = s.timing[j]; audio.play().then(() => setPlayIcon(true)).catch(() => setPlayIcon(false)); }; if (audio.readyState > 0) start(); else audio.addEventListener('loadedmetadata', start, {once:true}); }); }

  function replayStep(j){const s=S[idx];setMode('explore');document.body.dataset.replaying='true';agentUntil=(s.timing[j+1]!=null?s.timing[j+1]:s.duration)-.06;fired=Array.from({length:j},(_,k)=>k);$$('.animated-explanation .cue',stage).forEach(el=>el.classList.remove('on','cue-live'));$$('.animated-explanation .phaseA',stage).forEach(el=>el.classList.remove('gone'));for(let k=0;k<j;k++)s.narration[k].cues.forEach(c=>cue(c));window.SHOW.set(stage,s,j,true);setCaption(s,j);const begin=()=>{audio.currentTime=s.timing[j];audio.play().then(()=>setPlayIcon(true)).catch(()=>{cap.textContent='Press play to hear this step.';});};if(audio.readyState>0)begin();else audio.addEventListener('loadedmetadata',begin,{once:true});}

  function setLayer(name) { $$('[data-layer][role=tab]', stage).forEach(t => t.setAttribute('aria-selected', String(t.dataset.layer === name))); $$('.layer', stage).forEach(l => l.classList.toggle('active', l.dataset.layer === name)); }
  function showNode(s, id) { const n = s.diagram.nodes.find(x => x.id === id); if (!n) return; $$('.node', stage).forEach(x => x.classList.toggle('sel', x.dataset.node === id)); $('.node-detail', stage).innerHTML = `<h3>${esc(n.label)} <span class="small">· ${esc(n.type)}</span></h3><p>${esc(n.detail)}</p>`; }

  /* ---------- cues ---------- */
  function cue(c) {
    const [k, a] = c.split(':'); if(k==='fr' && /^a\d+$/.test(a))$$('.phaseA',stage).forEach(el=>el.classList.add('gone'));  if (k === 'fr') { const role = S[idx].agents?.find(x => x.f === a); const bar = $('.agent-explanation', stage); if (role && bar) bar.innerHTML = '<b>' + esc(role.name) + '</b><span>' + esc(role.input) + ' → ' + esc(role.output) + '</span>'; }
    if(c==='fr:outputs')$$('.mvp-output-grid video',stage).forEach((v,i)=>{const seek=()=>{v.currentTime=[3,6,7,9,10][i]||0;};if(v.readyState>0)seek();else v.addEventListener('loadedmetadata',seek,{once:true});}); const els = $$(`[data-cue="${c}"]`, stage); els.forEach(el => el.classList.add('on'));
    if (els[0] && mode === 'auto' && !$('.walkthrough,.animated-explanation',stage)) { const r = els[0].getBoundingClientRect(), s = stage.getBoundingClientRect(); if (r.bottom > s.bottom || r.top < s.top) els[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    if (k === 'play') (a === 'all' ? $$('video', stage) : $$(`[data-video="${a}"]`, stage)).forEach(v => { v.muted = true; v.play().catch(() => { }); });
    if (k === 'fr' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) els.forEach(el => (el.tagName === 'VIDEO' ? (el.id ? [] : [el]) : $$('video', el)).forEach(v => { v.muted = true; v.play().catch(() => { }); }));
    if (k === 'reel' && a === 'start') { const s = S[idx], j = s.narration.findIndex(n => n.cues.includes('reel:start')); reelAt = (s.timing[j + 1] != null ? s.timing[j + 1] : s.duration) - 0.02; if (mode !== 'auto') reelAt = null; }
    if (k === 'fr' && a === 'mvp' && !$('.walkthrough,.animated-explanation',stage)) $('.selected-showcase', stage)?.scrollIntoView({block:'start',behavior:'auto'});
    if (k === 'fr' && a === 'i') $$('.phaseA', stage).forEach(el => el.classList.add('gone'));
    if (k === 'fr' && a === 'ask') $$('.format-demo.full', stage).forEach(p => { p.classList.add('gone'); $$('video', p).forEach(v => v.pause()); });
    if (k === 'fr' && a === 'c') $$('.strip', stage).forEach(el => el.classList.add('gone'));
    if (k === 'layer') setLayer(a);
    if (k === 'flow') { const d = $('.diagram', stage); if (d) { d.classList.remove('flowing'); void d.offsetWidth; d.classList.add('flowing'); } }
    if (k === 'highlight') { const n = $(`.node[data-node="${a}"]`, stage); if (n) { n.classList.add('hot'); setTimeout(() => n.classList.remove('hot'), 3000); } }
    if (k === 'slider') { const r = $('.cmp input', stage); if (r) { const from = +r.value, to = +a, t0 = performance.now(); const step = t => { const p = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - p, 3); r.value = from + (to - from) * e; r.parentElement.style.setProperty('--x', r.value + '%'); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); } }
    if (k === 'count') { if (a === 'stats') $$('[data-count]', stage).forEach(el => rollUp(el)); if (a === 'qa') $$('tr[data-row]', stage).forEach((el, i) => setTimeout(() => el.classList.add('lit'), i * 70)); }
    if (k === 'show' && a === 'warn') $$('tr.w', stage).forEach(tr => tr.classList.add('on'));
    if (k === 'show' && a === 'role') ['role:me'].forEach(() => { });
  }
  function rollUp(el) { const target = el.dataset.count, num = parseFloat(target.replace(/[^0-9.]/g, '')); if (isNaN(num) || /min/.test(target)) return; const t0 = performance.now(); const step = t => { const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(num * e); if (p < 1) requestAnimationFrame(step); else el.textContent = target; }; requestAnimationFrame(step); }

  /* ---------- reel (plays next steps's films one after another) ---------- */
  let reelAt = null, reelOn = false, reelIdx = 0, filmActive = false;
  function reelSetup(s) {
    const v = $('#reelVideo'); if (!v) return; v.volume = 0.65;
    const label = $('#reelLabel');
    const load = i => { reelIdx = i; v.src = s.reel[i].src; v.poster = s.reel[i].poster; if (label) label.textContent = s.reel[i].label; $$('.reel-thumb', stage).forEach((t, k) => t.classList.toggle('sel', k === i)); };
    v.addEventListener('timeupdate', () => { if (reelOn && s.reelSeconds && v.currentTime >= s.reelSeconds) reelNext(s); });
    v.addEventListener('ended', () => { if (reelOn) reelNext(s); else { filmActive = false; setPlayIcon(false); } });
    v.addEventListener('play', () => { clearTimeout(timer); timer = null; filmActive = true; audio.pause(); setPlayIcon(true); });
    v.addEventListener('pause', () => { if (filmActive) setPlayIcon(false); });
    $$('.reel-thumb', stage).forEach((t, i) => { const h = () => { clearTimeout(timer); timer = null; reelOn = false; filmActive = true; audio.pause(); load(i); v.muted = false; v.play().then(() => { setPlayIcon(true); $('.player').classList.remove('speaking'); }).catch(() => { setPlayIcon(false); }); }; t.addEventListener('click', h); t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h(); } }); });
    load(0);
    stage._reelLoad = load;
  }
  function reelStart(s) { clearTimeout(timer); timer = null; const v = $('#reelVideo'); if (!v) return; v.volume = 0.65; reelOn = true; filmActive = true; $$('.phaseA,.format-demo', stage).forEach(el => { el.classList.add('gone'); $$('video', el).forEach(v => v.pause()); }); cue('fr:0'); audio.pause(); setPlayIcon(false); $('.player').classList.add('reel'); stage._reelLoad(0); v.muted = false; v.currentTime = 0; v.play().catch(() => { }); cap.textContent = s.reel[0].label; setPlayIcon(true); $('.player').classList.remove('speaking'); }
  function reelNext(s) { const v = $('#reelVideo'); if (reelIdx + 1 < s.reel.length) { stage._reelLoad(reelIdx + 1); v.currentTime = 0; v.play().catch(() => { }); cap.textContent = s.reel[reelIdx].label; } else { reelOn = false; filmActive = false; v.pause(); $('.player').classList.remove('reel'); if(s.autoReel && mode==='auto' && idx<S.length-1){go(idx+1,true);return;} ['fr:1', 'fr:2', 'fr:3'].forEach((c, i) => setTimeout(() => cue(c), i * 900)); cap.textContent = 'Start with one campaign. Measure the time and quality. Then expand.'; setPlayIcon(false); } }

  /* ---------- narration engine ---------- */
  function playScene() {
    const s = S[idx]; stopAudio(); agentUntil = null; fired = [];
    if (!s.audio) { if (s.reel && mode === 'auto') { reelStart(s); cap.textContent = s.reel[0].label; setPlayIcon(true); $('.player').classList.remove('speaking'); } return; }
    audio.src = s.audio + '?rev=67'; audio.currentTime = 0;
    audio.play().then(() => setPlayIcon(true)).catch(() => { cap.textContent = 'Press play to start the narration.'; });
  }
  function tick() {
    const s = S[idx], t = audio.currentTime; window.SHOW.tick(stage,s,t,mode); window.OUTCOMES?.tick(stage, s, t, document.body.dataset.replaying==='true'?'auto':mode); window.SHORT_STORY?.tick(stage, s, t, mode); if (agentUntil != null && t >= agentUntil) { agentUntil = null; audio.pause(); setPlayIcon(false); return; }
    if (reelAt != null && t >= reelAt && !reelOn) { reelAt = null; reelStart(s); return; }
    if (reelOn) return;
    s.timing.forEach((start, j) => { if (t >= start - 0.05 && !fired.includes(j)) { fired.push(j); setCaption(s, j); $$('.cue-live', stage).forEach(el => el.classList.remove('cue-live')); s.narration[j].cues.forEach(c => { cue(c); $$(`[data-cue="${c}"]`, stage).forEach(el => el.classList.add('cue-live')); }); const ill = $('.ill', stage); if (ill) ill.classList.toggle('focus', s.narration[j].cues.length > 0); $$('.script p', $('#notes')).forEach((p, k) => p.classList.toggle('now', k === j)); } });
    const j = fired[fired.length - 1]; if (j != null) { const start = s.timing[j], end = s.timing[j + 1] != null ? s.timing[j + 1] - 0.75 : s.duration; const p = Math.max(0, Math.min(1, (t - start) / Math.max(0.5, end - start))); const words = $$('#caption .w'); const n = Math.floor(p * words.length); words.forEach((w, k) => w.classList.toggle('said', k < n)); const active=words[Math.min(n,words.length-1)];if(active && cap.scrollHeight>cap.clientHeight)cap.scrollTop=Math.max(0,active.offsetTop-cap.offsetTop-cap.clientHeight/2); }
    $('.progress i').style.width = ((idx + (s.duration ? Math.min(1, t / s.duration) : 1)) / S.length * 100) + '%';
  }
  function setCaption(s, j) { const text = s.narration[j].text; cap.scrollTop=0; cap.innerHTML = text.split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' '); }
  let raf; function loop() { if (!audio.paused) tick(); raf = requestAnimationFrame(loop); } loop();
  audio.addEventListener('timeupdate', tick);
  audio.addEventListener('ended', () => { if(S[idx].autoReel && mode==='auto'){reelStart(S[idx]);$('#reelVideo')?.scrollIntoView({block:'center'});return;} if (S[idx].reel && reelAt != null && mode === 'auto') { reelAt = null; reelStart(S[idx]); return; } setPlayIcon(false); if (mode === 'auto' && idx < S.length - 1 && !S[idx + 1].exploreOnly) timer = setTimeout(() => { render(idx + 1); playScene(); }, 900); });
  audio.addEventListener('error',()=>{cap.textContent='Local narration could not load. Use Replay or skip this scene; check that the assets folder stays beside index.html.';setPlayIcon(false);});
  function stopAudio() { clearTimeout(timer); audio.pause(); setPlayIcon(false); const rv = $('#reelVideo'); if (rv) rv.pause(); reelOn = false; filmActive = false; }
  function setPlayIcon(on) { $('.player').classList.toggle('speaking', on); $('#play').innerHTML = on ? ICON.pause : ICON.play; $('#play').setAttribute('aria-label', on ? 'Pause narration' : 'Play narration'); }
  function toggle() { if (filmActive) { const v = $('#reelVideo'); if (v) { if (v.paused) v.play().then(() => { setPlayIcon(true); $('.player').classList.remove('speaking'); }).catch(()=>setPlayIcon(false)); else { v.pause(); setPlayIcon(false); } } return; } if (audio.paused) { if (!audio.src || audio.ended) playScene(); else audio.play().then(() => setPlayIcon(true)).catch(()=>setPlayIcon(false)); } else { audio.pause(); setPlayIcon(false); } }
  function go(i, play) { if (i < 0 || i >= S.length) return; stopAudio(); render(i); if (play || (mode === 'auto' && started)) playScene(); }
  function setMode(m) { delete document.body.dataset.replaying;mode = m; document.body.dataset.mode = m; $('#modeBtn').textContent = m === 'auto' ? 'Explore' : 'Auto Pitch'; $('#modeBtn').setAttribute('aria-pressed', String(m === 'explore')); $('#modeBtn').title = m === 'auto' ? 'Switch to Explore: free navigation, everything visible' : 'Switch to Auto Pitch: narrated, synchronised'; if (m === 'explore') { stopAudio(); $$('.cue', stage).forEach(el => el.classList.add('on')); } if (m === 'auto' && !started) { started = true; } }

  /* ---------- panels ---------- */
  function fillEvidence() { const s = S[idx]; $('#evidence').innerHTML = `<button class="close-x" data-close="evidence" aria-label="Close evidence">×</button><h2>Evidence for this scene</h2>${s.evidence.map(e => `<div class="ev"><b>${esc(e.claim)}</b><span class="src">${esc(e.source)}</span><span class="val">${esc(e.value)}</span></div>`).join('')}<h3>Offline source documents</h3><ul><li><a href="assets/evidence/SNITCH AI photoshoot studio - product spec v1.md" target="_blank">SNITCH AI photoshoot studio - product spec v1.md</a></li><li><a href="assets/evidence/SNITCH technical audit - 8 systems (evidence-based).md" target="_blank">SNITCH technical audit - 8 systems (evidence-based).md</a></li><li><a href="assets/evidence/SNITCH build brainstorm v1 (approved lineup).md" target="_blank">SNITCH build brainstorm v1 (approved lineup).md</a></li><li><a href="assets/evidence/SNITCH final 8 - requirements, tech and build plan.md" target="_blank">SNITCH final 8 - requirements, tech and build plan.md</a></li><li><a href="assets/evidence/SNITCH final 8 - skills to add and edge cases.md" target="_blank">SNITCH final 8 - skills to add and edge cases.md</a></li><li><a href="assets/evidence/SNITCH master blueprint - 8 systems, agents, stacks, costs.md" target="_blank">SNITCH master blueprint - 8 systems, agents, stacks, costs.md</a></li><li><a href="assets/evidence/audit-evidence-video-editor.md" target="_blank">audit-evidence-video-editor.md</a></li><li><a href="assets/evidence/SNITCH final eight + interactive pitch proposal.md" target="_blank">SNITCH final eight + interactive pitch proposal.md</a></li></ul><p class="small">Sources are files in “claude context” and the editor project; nothing here is invented.</p>`; $('[data-close]', $('#evidence')).addEventListener('click', () => togglePanel('evidence')); }
  function fillNotes() { const s = S[idx], n = s.notes; $('#notes').innerHTML = `<button class="close-x" data-close="notes" aria-label="Close notes">×</button><h2>Presenter notes · ${esc(s.title)}</h2>${s.what ? `<div class="details"><h3>The idea</h3><p>${esc(s.what)}</p><h3>The thinking</h3><p>${esc(s.why)}</p><h3>What you approved</h3><ul>${s.approved.map(x => `<li>${esc(x)}</li>`).join('')}</ul><h3>How it will work</h3><ol>${s.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol><h3>What it needs</h3><ul>${s.needs.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}<h3>Key message</h3><p>${esc(n.key)}</p><h3>Script</h3><div class="script">${s.narration.map((x, j) => `<p class="${fired.includes(j) && fired[fired.length - 1] === j ? 'now' : ''}">${esc(x.text)}</p>`).join('')}</div><h3>Evidence</h3>${s.evidence.map(e => `<div class="ev"><b>${esc(e.claim)}</b><span class="src">${esc(e.source)}</span><span class="val">${esc(e.value)}</span></div>`).join('')}<h3>Full explanation for questions</h3>${(s.fullNarration||[]).map(x=>`<p>${esc(x.text)}</p>`).join('')}<h3>Technical context</h3><p>${esc(n.technical)}</p><h3>Implementation considerations</h3><p>${esc(n.implementation)}</p><h3>Likely questions</h3>${n.questions.map(q => `<div class="qa-q"><b>${esc(q.q)}</b>${esc(q.a)}</div>`).join('')}<p class="small"><a href="notes.html?edition=${window.PITCH_EDITION}" target="_blank">Printable notes for every scene</a></p>`; $('[data-close]', $('#notes')).addEventListener('click', () => togglePanel('notes')); }
  function togglePanel(name) { const BTN = { notes: '#notesBtn', evidence: '#evBtn' }, otherName = name === 'notes' ? 'evidence' : 'notes'; const p = $('#' + name), other = $('#' + otherName); p.hidden = !p.hidden; other.hidden = true; if (!p.hidden) (name === 'notes' ? fillNotes : fillEvidence)(); $(BTN[name]).setAttribute('aria-pressed', String(!p.hidden)); $(BTN[otherName]).setAttribute('aria-pressed', 'false'); }

  /* ---------- chrome ---------- */
  $('#play').addEventListener('click', toggle); $('#next').addEventListener('click', () => go(idx + 1)); $('#prev').addEventListener('click', () => go(idx - 1));
  $('#replay').addEventListener('click', () => { render(idx); playScene(); });
  $('#modeBtn').addEventListener('click', () => setMode(mode === 'auto' ? 'explore' : 'auto'));
  $('#notesBtn').addEventListener('click', () => togglePanel('notes')); $('#evBtn').addEventListener('click', () => togglePanel('evidence'));
  $('#helpBtn').addEventListener('click', () => $('#help').showModal());
  $('.progress').addEventListener('click', e => { const r = e.currentTarget.getBoundingClientRect(); go(Math.floor((e.clientX - r.left) / r.width * S.length)); });
  $$('.rail button').forEach(b => b.addEventListener('click', () => go(S.findIndex(s => s.chapter === +b.dataset.ch))));
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,[contenteditable=true]') || $('#help').open) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); go(idx + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(idx - 1); }
    else if (k === ' ' && !e.target.closest('button,summary,a,[role=button]')) { e.preventDefault(); if (!started) { started = true; setMode('auto'); } toggle(); }
    else if (k === 'Home') go(0); else if (k === 'End') go(S.length - 1);
    else if (k.toLowerCase() === 'm') setMode(mode === 'auto' ? 'explore' : 'auto');
    else if (k.toLowerCase() === 'n') togglePanel('notes'); else if (k.toLowerCase() === 'e') togglePanel('evidence');
    else if (k.toLowerCase() === 'r') { render(idx); playScene(); }
    else if (k === '?') $('#help').showModal(); else if (k === 'Escape') { $('#notes').hidden = true; $('#evidence').hidden = true; }
    else if (/^[1-4]$/.test(k)) go(S.findIndex(s => s.chapter === +k));
    else if (k.toLowerCase() === 'd') { const r = document.documentElement; r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark'; }
  });
  audio.addEventListener('pause', () => { if (!filmActive) { $$('video', stage).forEach(v => v.pause()); setPlayIcon(false); } });
  audio.addEventListener('play', () => { if (!filmActive && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { $$('.animated-explanation video,.supporting-demo[open] .walk-content video,.walk-content video', stage).forEach(v => { if (v.id === 'reelVideo') return; const c = v.closest('.cue'); if (!c || c.classList.contains('on') || mode === 'explore') { v.muted = true; v.play().catch(() => {}); } }); } });
  window.PITCH = { go, setMode, cue, replayStep, audio, pause:()=>stopAudio(), resume:()=>{setMode('auto');if(audio.paused)toggle();}, state: () => ({ idx, mode, started, fired: fired.slice(), t: audio.currentTime, paused: audio.paused }) };
  window.addEventListener('error', e => { if (!stage.textContent.trim()) stage.innerHTML = '<section class="scene"><h2>Something did not load</h2><p>Press ⌘R to reload. If it happens again, open index.html from Finder in Safari or Chrome.</p><p class="small">' + esc(e.message) + '</p></section>'; });
  document.body.dataset.mode = 'auto'; setPlayIcon(false); const deep = new URLSearchParams(location.search); const target = S.findIndex(s => s.id === deep.get('scene')); render(target >= 0 ? target : 0); if (deep.get('mode') === 'explore') setMode('explore');
})();

/* Browser presentation control; does not alter playback or scene timing. */
(()=>{const bar=document.querySelector('.tools');if(!bar||document.getElementById('fullscreenBtn'))return;const b=document.createElement('button');b.id='fullscreenBtn';b.className='chip';b.type='button';b.textContent='⛶ Full screen';b.setAttribute('aria-pressed','false');b.title='Full screen (F). Press Esc to exit.';bar.prepend(b);const live=document.createElement('span');live.setAttribute('role','status');live.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';bar.append(live);const current=()=>document.fullscreenElement||document.webkitFullscreenElement;const update=()=>{const on=!!current();b.textContent=on?'⛶ Exit full screen':'⛶ Full screen';b.setAttribute('aria-pressed',String(on));};const toggle=async()=>{try{if(current()){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}else{const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(!request)throw Error('unsupported');await request.call(document.documentElement);}update();}catch(e){live.textContent='Open this link in a regular browser tab to use full screen, or use your browser’s full-screen command.';b.title=live.textContent;}};b.addEventListener('click',toggle);document.addEventListener('fullscreenchange',update);document.addEventListener('webkitfullscreenchange',update);document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.target.closest('input,textarea,[contenteditable=true]')&&!document.querySelector('dialog[open]')){e.preventDefault();toggle();}});update();})();

/* Keep the diagram soft until the idea card's own exit animation completes. */
(()=>{const update=e=>{if(e.animationName!=='pop-hold'||!e.target.matches('.ill .pop'))return;const canvas=e.target.closest('.ill');if(!canvas)return;if(e.type==='animationstart')canvas.classList.add('idea-pop-blur');else canvas.classList.remove('idea-pop-blur');};document.addEventListener('animationstart',update);document.addEventListener('animationend',update);document.addEventListener('animationcancel',update);})();
