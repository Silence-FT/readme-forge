'use strict';

/* ════════ THEME TOGGLE ════════ */
(function() {
  if (localStorage.getItem('readmeforge-theme') === 'dark')
    document.documentElement.setAttribute('data-theme', 'dark');
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('readmeforge-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('readmeforge-theme', 'dark');
    }
  });
})();

/* ════════ FORCE SMOOTH TRANSITIONS (bulletproof) ════════ */
window.addEventListener('load', function() {
  setTimeout(function() {
    const t = 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    document.querySelectorAll('*').forEach(el => { el.style.transition = t; });
  }, 200);
});

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ════════ TECH CATALOG — [name, hex, simple-icons slug, logoColor?] ════════ */
const TECH = {
Languages: [
['JavaScript','F7DF1E','javascript'],['TypeScript','3178C6','typescript'],
['Python','3776AB','python'],['Java','ED8B00','openjdk'],['Go','00ADD8','go'],
['Rust','000000','rust'],['C','A8B9CC','c'],['C++','00599C','cplusplus'],
['C#','239120','csharp'],['PHP','777BB4','php'],['Ruby','CC342D','ruby'],
['Swift','F05138','swift'],['Kotlin','7F52FF','kotlin'],['Dart','0175C2','dart'],
['Elixir','4B275F','elixir'],['Scala','DC322F','scala'],['Lua','2C2D72','lua'],
],
Frontend: [
['HTML5','E34F26','html5'],['CSS3','1572B6','css3'],['Sass','CC6699','sass'],
['Tailwind CSS','06B6D4','tailwindcss'],['Bootstrap','7952B3','bootstrap'],
['React','61DAFB','react','black'],['Vue.js','4FC08D','vuedotjs'],
['Svelte','FF3E00','svelte'],['Angular','DD0031','angular'],
['Next.js','000000','nextdotjs'],['Nuxt','00DC82','nuxtdotjs'],
['Astro','BC52EE','astro'],['Vite','646CFF','vite'],['Webpack','8DD6F9','webpack'],
['Three.js','000000','threedotjs'],['Electron','47848F','electron'],
['Tauri','24C8DB','tauri'],['Redux','764ABC','redux'],['Flutter','02569B','flutter'],
],
Backend: [
['Node.js','5FA04E','nodedotjs'],['Deno','000000','deno'],['Bun','000000','bun'],
['Express','000000','express'],['NestJS','E0234E','nestjs'],['Fastify','000000','fastify'],
['Django','092E20','django'],['Flask','000000','flask'],['FastAPI','009688','fastapi'],
['Spring','6DB33F','spring'],['Laravel','FF2D20','laravel'],
['Ruby on Rails','CC0000','rubyonrails'],['.NET','512BD4','dotnet'],
['GraphQL','E10098','graphql'],['Socket.io','010101','socketdotio'],
],
'Data & ML': [
['PostgreSQL','4169E1','postgresql'],['MySQL','4479A1','mysql'],['SQLite','003B57','sqlite'],
['MongoDB','47A248','mongodb'],['Redis','FF4438','redis'],['Firebase','FFD800','firebase'],
['Supabase','3FCF8E','supabase'],['Prisma','2D3748','prisma'],
['TensorFlow','FF6F00','tensorflow'],['PyTorch','EE4C2C','pytorch'],
['Pandas','150458','pandas'],['NumPy','013243','numpy'],['Jupyter','F37626','jupyter'],
['OpenAI','412991','openai'],
],
'Infra & Cloud': [
['Docker','2496ED','docker'],['Kubernetes','326CE5','kubernetes'],['Nginx','009639','nginx'],
['Linux','FCC624','linux','black'],['Git','F05032','git'],['GitHub','181717','github'],
['GitLab','FC6D26','gitlab'],['GitHub Actions','2088FF','githubactions'],
['AWS','232F3E','amazonaws'],['Vercel','000000','vercel'],
['Netlify','00C7B7','netlify'],['Cloudflare','F38020','cloudflare'],
],
Tooling: [
['VS Code','007ACC','visualstudiocode'],['Figma','F24E1E','figma'],
['Neovim','57A143','neovim'],['Markdown','000000','markdown'],
['ESLint','4B32C3','eslint'],['Prettier','F7B93E','prettier'],
['Jest','C21325','jest'],['Vitest','6E9F43','vitest'],['Storybook','FF4785','storybook'],
['Postman','FF6C37','postman'],['Stripe','635BFF','stripe'],
],
};
const TECH_INDEX = {};
Object.values(TECH).flat().forEach(t =>
  TECH_INDEX[t[0]] = { name:t[0], color:t[1], logo:t[2], lw:t[3]||'white' });

const LICENSES = {'MIT':'2DA44E','Apache-2.0':'1F6FEB','GPL-3.0':'E34C26',
'BSD-3-Clause':'F7B93E','MPL-2.0':'8250DF','Unlicense':'6E7781'};

const DEFAULT_STEPS = `Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m "Add some amazing feature")
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request`;

const KEY = 'readme-forge:v1';
const FIELDS = ['rf-name','rf-tagline','rf-desc','rf-logo','rf-repo','rf-version','rf-author',
'rf-author-url','rf-license','rf-badge-style','rf-features','rf-install','rf-run','rf-usage',
'rf-screenshot','rf-tree','rf-contrib','rf-ack'];
const CHECKS = ['ck-toc','ck-features','ck-stack','ck-quickstart','ck-usage','ck-tree',
'ck-contrib','ck-license','ck-author','ck-emoji'];
let techSel = new Set();
let customBadges = [];

/* ════════ badge builders ════════ */
const esc = s => encodeURIComponent(String(s||''))
  .replace(/-/g,'--').replace(/_/g,'__').replace(/%20/g,'');

function badgeUrl(o){
  const seg = o.message ? `${esc(o.label)}-${esc(o.message)}-${o.color}` : `${esc(o.label)}-${o.color}`;
  let url = `https://img.shields.io/badge/${seg}?style=${o.style||'flat-square'}`;
  if(o.logo) url += `&logo=${encodeURIComponent(o.logo)}&logoColor=${o.logoColor||'white'}`;
  return url;
}
const techBadge = (t, style) =>
  badgeUrl({label:t.name, color:t.color, logo:t.logo, logoColor:t.lw, style});

/* ════════ helpers ════════ */
function slugify(t){
  return t.toLowerCase().replace(/[`*_~[\]()!]/g,'')
    .replace(/[^\p{L}\p{N}\p{Extended_Pictographic}\p{Emoji_Component}\s-]/gu,'')
    .trim().replace(/\s+/g,'-');
}

function buildTree(src){
  const items = [];
  src.split('\n').forEach(l => {
    if(!l.trim()) return;
    const lead = l.match(/^[\t ]*/)[0].replace(/\t/g,' ').length;
    items.push({ name:l.trim(), depth:Math.floor(lead/2) });
  });
  const isLast = i => {
    const d = items[i].depth;
    for(let j=i+1;j<items.length;j++) if(items[j].depth <= d) return items[j].depth < d;
    return true;
  };
  const out = [];
  for(let i=0;i<items.length;i++){
    const {name, depth} = items[i];
    if(depth === 0){ out.push(name); continue; }
    let prefix = '';
    for(let d=1; d<depth; d++){
      let ai = -1;
      for(let j=i-1;j>=0;j--) if(items[j].depth === d){ ai = j; break; }
      prefix += (ai >= 0 && !isLast(ai)) ? '│   ' : '    ';
    }
    out.push(prefix + (isLast(i) ? '└── ' : '├── ') + name);
  }
  return out.join('\n');
}

function featuresBlock(text){
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if(!lines.length) return '';
  if(lines.some(l => l.includes('|'))){
    let md = '| Feature | Description |\n| --- | --- |\n';
    lines.forEach(l => {
      const [n, ...r] = l.split('|');
      md += `| ${(n||'').trim()||'—'} | ${r.join('|').trim()} |\n`;
    });
    return md;
  }
  return lines.map(l => `- ${l}`).join('\n');
}

const fence = c => '```bash\n' + c.trim() + '\n```\n\n';

/* ════════ state ════════ */
function readState(){
  const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const c = id => { const el = document.getElementById(id); return el ? el.checked : false; };
  return {
    name:v('rf-name'), tagline:v('rf-tagline'), desc:v('rf-desc'), logo:v('rf-logo'),
    repo:v('rf-repo'), version:v('rf-version'), author:v('rf-author'), authorUrl:v('rf-author-url'),
    license:v('rf-license')||'None', badgeStyle:v('rf-badge-style')||'flat-square',
    features:v('rf-features'), install:v('rf-install'), run:v('rf-run'), usage:v('rf-usage'),
    screenshot:v('rf-screenshot'), tree:v('rf-tree'), contrib:v('rf-contrib'), ack:v('rf-ack'),
    toc:c('ck-toc'), emoji:c('ck-emoji'),
    sections:{ features:c('ck-features'), stack:c('ck-stack'), quick:c('ck-quickstart'),
      usage:c('ck-usage'), tree:c('ck-tree'), contrib:c('ck-contrib'),
      license:c('ck-license'), author:c('ck-author') },
    tech:[...techSel], customBadges:customBadges.slice(),
  };
}

/* ════════ markdown generation ════════ */
function buildMarkdown(s){
  const L = [];
  const title = s.name || 'Untitled Project';
  if(s.logo) L.push(`<p align="center">`, `<img src="${s.logo}" alt="${title} logo" width="140" />`, `</p>`, '');
  L.push(`# ${title}`, '');
  if(s.tagline) L.push(`> ${s.tagline}`, '');

  const top = [];
  if(s.version) top.push(badgeUrl({label:'release', message:s.version, color:'1F6FEB', style:s.badgeStyle}));
  if(!s.sections.stack) s.tech.forEach(n => { const t = TECH_INDEX[n]; if(t) top.push(techBadge(t, s.badgeStyle)); });
  s.customBadges.forEach(b => {
    if(b.label || b.message)
      top.push(badgeUrl({label:b.label||'badge', message:b.message||'',
        color:(b.color||'6E7781').replace(/^#/,''), logo:b.logo||'', style:s.badgeStyle}));
  });
  if(s.license !== 'None' && LICENSES[s.license])
    top.push(badgeUrl({label:'license', message:s.license, color:LICENSES[s.license], style:s.badgeStyle}));
  if(top.length) L.push(top.map(u => `![badge](${u})`).join(' '), '');
  L.push('---', '');

  const EMO  = {about:'📌',features:'✨',stack:'🧰',shot:'📸',quick:'🚀',usage:'📖',
                tree:'🗂️',contrib:'🤝',license:'📄',author:'👤'};
  const NAME = {about:'About',features:'Features',stack:'Tech Stack',shot:'Screenshot',
                quick:'Quick Start',usage:'Usage',tree:'Project Structure',
                contrib:'Contributing',license:'License',author:'Author'};
  const secs = [];
  const add = (k, b) => { if(b && b.trim())
    secs.push([s.emoji && EMO[k] ? `${EMO[k]} ${NAME[k]}` : NAME[k], b.trim()]); };

  if(s.desc) add('about', s.desc);
  if(s.sections.features) add('features', featuresBlock(s.features));
  if(s.sections.stack && s.tech.length)
    add('stack', s.tech.map(n => { const t = TECH_INDEX[n];
      return t ? `![badge](${techBadge(t, s.badgeStyle)})` : ''; }).filter(Boolean).join(' '));
  if(s.screenshot)
    add('shot', `<p align="center"><img src="${s.screenshot}" alt="${title} screenshot" width="720" /></p>`);
  if(s.sections.quick){
    const slugName = (s.name||'project').toLowerCase().replace(/[^\w]+/g,'-').replace(/^-|-$/g,'');
    let q = '';
    if(s.repo)    q += fence(`git clone ${s.repo}\ncd ${slugName || 'project'}`);
    if(s.install) q += fence(s.install);
    if(s.run)     q += fence(s.run);
    add('quick', q);
  }
  if(s.sections.usage && s.usage) add('usage', s.usage);
  if(s.sections.tree && s.tree){ const t = buildTree(s.tree); if(t) add('tree', '```text\n' + t + '\n```'); }
  if(s.sections.contrib){
    const steps = (s.contrib||'').split('\n').map(x => x.trim()).filter(Boolean);
    add('contrib', (steps.length ? steps : DEFAULT_STEPS.split('\n'))
      .map((x,i) => `${i+1}. ${x}`).join('\n') +
      '\n\n> Pull requests are welcome. For significant changes, please open an issue first to discuss.');
  }
  if(s.sections.license)
    add('license', s.license !== 'None'
      ? `Distributed under the **${s.license} License**. See [LICENSE](./LICENSE) for more information.`
      : 'This project is open source. Add a [LICENSE](./LICENSE) file to define the terms.');
  if(s.sections.author && (s.author || s.ack)){
    let a = s.author ? (s.authorUrl ? `Built by [${s.author}](${s.authorUrl}).` : `Built by ${s.author}.`) : '';
    if(s.ack) a += (a ? '\n\n' : '') + `Acknowledgments: ${s.ack}`;
    add('author', a);
  }

  if(s.toc && secs.length){
    L.push(`## ${s.emoji ? '🧭 ' : ''}Table of Contents`, '');
    secs.forEach(([t]) => L.push(`- [${t}](#${slugify(t)})`));
    L.push('');
  }
  secs.forEach(([t, b]) => L.push(`## ${t}`, '', b, ''));
  return L.join('\n').replace(/\n{3,}/g,'\n\n').trim() + '\n';
}

/* ════════ render loop ════════ */
let currentMd = '';
function update(){
  const s = readState();
  currentMd = buildMarkdown(s);
  if(window.marked){
    marked.setOptions({ gfm:true, breaks:true });
    $('#preview').innerHTML = marked.parse(currentMd);
  } else {
    $('#preview').textContent = '⚠ marked.js failed to load — check your connection.';
  }
  $('#raw').textContent = currentMd;
  $('#treeHint').textContent = s.tree ? buildTree(s.tree) : 'tree preview appears here…';
  const badges   = (currentMd.match(/img.shields.io/g) || []).length;
  const sections = (currentMd.match(/^## /gm) || []).length;
  const words    = currentMd.split(/\s+/).filter(Boolean).length;
  $('#sbStats').textContent = `${badges} badges · ${sections} sections · ${words} words`;
  save();
}

/* ════════ persistence ════════ */
function save(){
  try{
    localStorage.setItem(KEY, JSON.stringify({
      f: Object.fromEntries(FIELDS.map(i => [i, document.getElementById(i).value])),
      c: Object.fromEntries(CHECKS.map(i => [i, document.getElementById(i).checked])),
      tech:[...techSel], badges:customBadges,
    }));
    const d = $('#saveDot');
    d.classList.add('blink');
    setTimeout(() => d.classList.remove('blink'), 350);
  }catch(e){}
}
function applySaved(d){
  Object.entries(d.f || {}).forEach(([id,v]) => { const el = document.getElementById(id); if(el) el.value = v; });
  Object.entries(d.c || {}).forEach(([id,v]) => { const el = document.getElementById(id); if(el) el.checked = v; });
  techSel = new Set(d.tech || []);
  customBadges = d.badges || [];
}

/* ════════ example & reset ════════ */
const EXAMPLE = {
  'rf-name':'README Forge',
  'rf-tagline':'Zero-friction README generator for open-source developers.',
  'rf-desc':'README Forge turns a short form into a clean, high-contrast, publication-ready `README.md` — complete with shields.io tech badges, a quick-start block, feature tables and an ASCII directory tree.\n\nNo accounts, no build step, no clutter. Fill the form on the left, watch the preview on the right, copy the markdown and ship.',
  'rf-logo':'',
  'rf-repo':'https://github.com/yourname/readme-forge',
  'rf-version':'v1.0.0',
  'rf-author':'Your Name',
  'rf-author-url':'https://github.com/yourname',
  'rf-license':'MIT',
  'rf-badge-style':'flat-square',
  'rf-features':'Live preview|Markdown rendered in real time as you type\nBadge engine|Auto-generating shields.io badges for 80+ technologies\nTree builder|Turns a plain indented list into a clean ├── tree\nOne-click export|Copy to clipboard or download README.md instantly\nAutosave|Drafts persist locally between sessions',
  'rf-install':'git clone https://github.com/yourname/readme-forge.git\ncd readme-forge',
  'rf-run':'python3 -m http.server 8080\n# then open http://localhost:8080 — or just open index.html',
  'rf-usage':'Everything runs client-side. Form state autosaves to `localStorage`, so you can close the tab and pick up where you left off.\n\n> Tip: use `Name | description` lines in Features to switch the list into a table automatically.',
  'rf-screenshot':'',
  'rf-tree':'readme-forge\n  index.html\n  assets\n    css\n      styles.css\n    js\n      app.js\n  README.md\n  LICENSE',
  'rf-contrib':DEFAULT_STEPS,
  'rf-ack':'Rendered with [marked.js](https://github.com/markedjs/marked) · badges by [shields.io](https://shields.io)',
};
const EXAMPLE_CHECKS = {'ck-toc':true,'ck-features':true,'ck-stack':true,'ck-quickstart':true,
'ck-usage':true,'ck-tree':true,'ck-contrib':true,'ck-license':true,'ck-author':true,'ck-emoji':false};

function loadExample(){
  Object.entries(EXAMPLE).forEach(([id,v]) => { const el = document.getElementById(id); if(el) el.value = v; });
  Object.entries(EXAMPLE_CHECKS).forEach(([id,v]) => { document.getElementById(id).checked = v; });
  techSel = new Set(['HTML5','CSS3','JavaScript','Markdown']);
  customBadges = [{label:'made with', message:'README Forge', color:'1554E6'}];
  renderChips(); renderBadges(); update();
}
function resetAll(){
  localStorage.removeItem(KEY);
  FIELDS.forEach(id => document.getElementById(id).value = '');
  document.getElementById('rf-license').value = 'MIT';
  document.getElementById('rf-badge-style').value = 'flat-square';
  document.getElementById('rf-contrib').value = DEFAULT_STEPS;
  Object.entries(EXAMPLE_CHECKS).forEach(([id,v]) => document.getElementById(id).checked = v);
  techSel.clear(); customBadges = [];
  renderChips(); renderBadges(); update();
}

/* ════════ chips & custom badges ════════ */
function renderChips(){
  const q = ($('#rf-tech-search').value || '').trim().toLowerCase();
  let html = '';
  for(const [g, arr] of Object.entries(TECH)){
    const list = arr.filter(t => !q || t[0].toLowerCase().includes(q));
    if(!list.length) continue;
    html += `<div class="chip-group"><h4>${g}</h4><div class="chips">` +
      list.map(t => `<button type="button" class="chip${techSel.has(t[0])?' on':''}" data-tech="${t[0]}"><i style="background:#${t[1]}"></i>${t[0]}</button>`).join('') +
      '</div></div>';
  }
  $('#chipGroups').innerHTML = html || `<p class="empty">No technology matches "${q}".</p>`;
}
function renderBadges(){
  $('#cbList').innerHTML = customBadges.map((b,i) =>
    `<div class="cb-row"><code>${b.label||'…'}${b.message ? ' – ' + b.message : ''} · #${b.color||'6E7781'}</code><button type="button" data-i="${i}" title="Remove">✕</button></div>`).join('');
}

/* ════════ export ════════ */
function fallbackCopy(t){
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  ta.remove();
}
function copyMd(){
  const done = () => {
    const b = $('#btnCopy'), old = b.textContent;
    b.classList.add('ok'); b.textContent = '✓ Copied';
    setTimeout(() => { b.classList.remove('ok'); b.textContent = old; }, 1400);
  };
  if(navigator.clipboard && window.isSecureContext)
    navigator.clipboard.writeText(currentMd).then(done).catch(() => { fallbackCopy(currentMd); done(); });
  else { fallbackCopy(currentMd); done(); }
}
function download(){
  const blob = new Blob([currentMd], {type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'README.md';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
}

/* ════════ wiring ════════ */
document.addEventListener('input', e => {
  if(e.target.closest('.form-panel')) update();
});
$('#rf-tech-search').addEventListener('input', renderChips);
$('#chipGroups').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if(!b) return;
  const n = b.dataset.tech;
  techSel.has(n) ? techSel.delete(n) : techSel.add(n);
  b.classList.toggle('on'); update();
});
$('#cb-add').addEventListener('click', () => {
  const label   = $('#cb-label').value.trim();
  const message = $('#cb-message').value.trim();
  const color   = $('#cb-color').value.trim().replace(/^#/,'');
  const logo    = $('#cb-logo').value.trim();
  if(!label && !message) return;
  customBadges.push({label, message, color:color||'6E7781', logo});
  ['cb-label','cb-message','cb-color','cb-logo'].forEach(id => document.getElementById(id).value = '');
  renderBadges(); update();
});
$('#cbList').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]'); if(!b) return;
  customBadges.splice(+b.dataset.i, 1); renderBadges(); update();
});
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.remove('on'));
  $$('.tab-body').forEach(x => x.hidden = true);
  t.classList.add('on');
  document.getElementById(t.dataset.tab).hidden = false;
}));
$$('.seg button').forEach(b => b.addEventListener('click', () => {
  $$('.seg button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  const raw = b.dataset.view === 'raw';
  $('#previewWrap').hidden = raw;
  $('#raw').hidden = !raw;
}));
$('#btnCopy').addEventListener('click', copyMd);
$('#btnDownload').addEventListener('click', download);
$('#btnExample').addEventListener('click', loadExample);
$('#btnReset').addEventListener('click', resetAll);
window.addEventListener('keydown', e => {
  const mod = e.metaKey || e.ctrlKey;
  if(mod && e.key.toLowerCase() === 's'){ e.preventDefault(); download(); }
  if(mod && e.key.toLowerCase() === 'c' && !window.getSelection().toString()) copyMd();
});

/* ════════ init ════════ */
document.getElementById('rf-contrib').value = DEFAULT_STEPS;
try{
  const saved = localStorage.getItem(KEY);
  if(saved){ applySaved(JSON.parse(saved)); renderChips(); renderBadges(); }
  else loadExample();
}catch(e){ loadExample(); }
update();