/* The concise edition uses a purpose-built visual story, not compressed agent screens. */
window.SHORT_STORY=(()=>{
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wrap=(t,max)=>{const out=[];let l='';for(const w of t.split(' ')){if((l+' '+w).trim().length>max){out.push(l);l=w}else l=(l+' '+w).trim()}if(l)out.push(l);return out};
const words=(t,x,y,max=28,size=22)=>wrap(t,max).map((l,i)=>`<text x="${x}" y="${y+i*(size+9)}" class="ss-copy" font-size="${size}">${esc(l)}</text>`).join('');
const cue=(name,body)=>`<g class="cue ss-part" data-cue="fr:${name}">${body}</g>`;
const svg=(body,label)=>`<svg class="ill short-story" viewBox="0 0 1200 640" role="img" aria-label="${esc(label)}">${body}</svg>`;
function overview(s){const cards=[['Hotline content','Keep posts moving'],['Instagram styling','Help customers shop'],['The Edit Room','Create and resize films'],['The Hook Lab','Improve the message'],['One dashboard','Choose what to repeat'],['YouTube','Extend the same shoot'],['AI photo studio','Explore product imagery']];return svg(`<text x="60" y="66" class="ss-heading">Seven ideas. One marketing team.</text>${cue(0,'<text x="60" y="115" class="ss-sub">Follow the numbers: this is the order of the pitch.</text>')}${cards.map(([name,benefit],i)=>{const x=i<4?60+i*280:200+(i-4)*280,y=i<4?170:360;return cue(i+1,`<g data-go="${i+2}" role="button" tabindex="0" aria-label="Open ${esc(name)}"><rect x="${x}" y="${y}" width="240" height="145" rx="14" class="ss-card"/><circle cx="${x+30}" cy="${y+32}" r="17" class="ss-disc"/><text x="${x+30}" y="${y+38}" text-anchor="middle" class="ss-number">${i+1}</text><text x="${x+20}" y="${y+83}" class="ss-card-title">${esc(name)}</text><text x="${x+20}" y="${y+116}" class="ss-sub">${esc(benefit)}</text></g>`)}).join('')}${cue(8,'<path d="M60 550H1140" class="ss-rule"/><text x="600" y="590" text-anchor="middle" class="ss-sub">Shared assets · real product facts · human approval · results</text>')}`,'Seven numbered ideas in narrated order')}
function render(s){if(s.id==='eight')return overview(s);if(!s.shortStory)return window.ILL.render(s);const b=s.shortStory;
let drawing=window.OUTCOMES.illustration(s.id).replace('<svg class="om-illustration"','<svg x="415" y="135" width="735" height="365" class="ss-illustration"');for(let i=0;i<3;i++)drawing=drawing.replace(`class="om-phase om-phase-${i}"`,`class="om-phase cue om-phase-${i}" data-cue="fr:step${i}"`);
drawing=drawing.replace('</svg>','<g class="ss-motion-token" visibility="hidden"><rect x="-27" y="-12" width="54" height="25" rx="6" fill="#bd411f"/><text x="0" y="5" text-anchor="middle" fill="white" font-size="12" font-family="Arial" font-weight="700">WORK</text></g></svg>');
return svg(`${cue(0,`<circle cx="78" cy="62" r="25" class="ss-disc"/><text x="78" y="70" text-anchor="middle" class="ss-number">${s.num}</text><text x="120" y="73" class="ss-heading">${esc(s.title)}</text>`)}${cue('what',`<text x="60" y="157" class="ss-kicker">WHAT</text>${words(b.what,60,191)}`)}${cue('why',`<text x="60" y="285" class="ss-kicker">WHY IT HELPS</text>${words(b.why,60,319,29,20)}`)}${cue('how',`<text x="60" y="415" class="ss-kicker">HOW IT WORKS</text>${words(b.how,60,449,30,18)}`)}<path d="M390 135V505" class="ss-rule"/>${drawing}<text x="785" y="523" text-anchor="middle" class="ss-live-label"></text>${cue('impact',`<rect x="60" y="545" width="1080" height="62" rx="12" class="ss-impact"/><text x="600" y="583" text-anchor="middle" class="ss-impact-copy">${esc(b.impact)}</text>`)}${s.id==='idea-3'?cue('mvp','<g aria-label="MVP examples below"></g>'):''}`,s.title+' — what, why and how')}

const beats={
 'idea-1':{stage:[0,0,1,2,2],labels:['Weekly brief enters the studio','Less coordination for the team','Plan → clips → captions → sound','Human approval → schedule → results','Approved work feeds the next week'],arrows:[[230,150],[675,150]],token:'POST'},
 'idea-2':{stage:[0,0,1,1,2],labels:['A post creates styling interest','Help the customer get closer to shopping','STYLE comment → private reply → customer reply','Occasion + budget → real products → looks','Website link or confirmed store'],arrows:[[235,180],[575,180]],token:'STYLE'},
 'idea-3':{stage:[0,0,1,2,2],labels:['Start with the shoot footage','Reduce repeated editing work','Find shots → cut → sound → graphics → colour','Editor approval → channel and screen versions','Small MVP · the selected examples are below'],arrows:[[230,180],[645,180]],token:'CUT'},
 'idea-4':{stage:[0,0,1,2,2],labels:['Review the edit before release','Make each revision easier to explain','Opening + text + pace + message','Change one thing → test → record response','Carry the learning into the next campaign'],arrows:[[270,190],[650,190]],token:'TEST'},
 'idea-5':{stage:[0,0,1,2,2],labels:['Bring results and production effort together','Choose where time and money should go','Gather account data + effort → compare posts','Recommendations keep the source posts attached','Weekly decision: repeat, improve, or stop'],arrows:[[230,215],[665,215]],token:'DATA'},
 'idea-6':{stage:[0,0,1,2,2],labels:['Reuse approved campaign footage','Extend the shoot’s useful life','Main film + Shorts + titles + thumbnails','A person approves → schedule the release','Results feed the next YouTube package'],arrows:[[265,180],[655,180]],token:'FILM'},
 'idea-7':{stage:[0,0,0,1,2],labels:['Keep the real garment at the centre','Compare more shoot directions','Garment photos = what · model photos = who','Choose model + theme → plan → create shots','Check garment and face → approve → library'],arrows:[[230,190],[645,190]],token:'SHOT'}
};
function tick(stage,s,t,mode){
 const root=stage.querySelector('.short-story');const plan=beats[s.id];if(!root||!plan)return;
 if(mode!=='auto'){root.querySelectorAll('.om-phase').forEach(g=>{g.classList.add('on');g.classList.remove('ss-current')});root.querySelector('.ss-motion-token')?.setAttribute('visibility','hidden');return}
 let j=0;for(let i=0;i<s.timing.length;i++)if(t>=s.timing[i]-.05)j=i;
 const active=plan.stage[j];root.dataset.beat=j;root.dataset.processStage=active;
 root.querySelectorAll('.om-phase').forEach((g,i)=>{g.classList.toggle('on',i<=active);g.classList.toggle('ss-current',i===active)});
 const label=root.querySelector('.ss-live-label');if(label)label.textContent=plan.labels[j];
 const token=root.querySelector('.ss-motion-token');if(!token)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const end=s.timing[j+1]??s.duration;const p=Math.max(0,Math.min(1,(t-s.timing[j])/Math.max(.4,end-s.timing[j])));
 // Use the audio clock, not timers: pause, replay and seek preserve the hand-off position.
 const before=j>0?plan.stage[j-1]:0;const transfer=active>before;
 token.setAttribute('visibility',!reduce&&transfer&&p<.85?'visible':'hidden');
 if(transfer){const [x,y]=plan.arrows[Math.max(0,active-1)],travel=Math.min(1,p/.8);token.setAttribute('transform',`translate(${x-35+travel*95} ${y-15})`);token.querySelector('text').textContent=plan.token;}
}
return {render,tick,beats};
})();
