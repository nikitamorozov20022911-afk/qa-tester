// qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0
// Склейка «как в Figma | как у нас» в одну картинку для тикета.
// node compare.mjs <figma.png> <site.png> <out.png> [подпись Figma] [подпись сайта] [--rtl] [--force] [--app]
//        --app — снимок из приложения (подпись «באפליקציה» вместо «באתר»)
//        [--mark-figma x,y,w,h]... [--mark-site x,y,w,h]...   (красная рамка, в пикселях исходной картинки; можно несколько)
// Пример: node compare.mjs ../screenshots/ab12-header-figma.png ../screenshots/ab12-header-mobile.png ../screenshots/ab12-header-compare.png "Figma (עיצוב)" "באתר (בפועל)" --rtl
//
// Картинки НЕ уменьшаются: обе в одной ширине = ширина более чёткой (не больше 1440px).
// Широкие (десктоп) — одна под другой, узкие (телефон/компонент) — рядом.
// Проверки качества (без --force склейка не делается, код выхода 2):
//   - снимок уже 360px или чёткость отличается больше чем в 1.6 раза → переснять мелкий;
//   - пропорции отличаются больше чем на 35% → сняты разные области.
import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const flags = new Set();
const marks = { figma: [], site: [] };
const pos = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--mark-figma' || a === '--mark-site') {
    const v = (args[++i] || '').split(',').map(Number);
    if (v.length !== 4 || v.some((n) => !Number.isFinite(n))) { console.error(`${a}: нужно x,y,w,h`); process.exit(1); }
    marks[a === '--mark-figma' ? 'figma' : 'site'].push(v);
  } else if (a.startsWith('--')) flags.add(a);
  else pos.push(a);
}
const rtl = flags.has('--rtl');
const force = flags.has('--force');
// Подпись над каждым экраном есть всегда: какой из них Figma, а какой — сайт/приложение.
const app = flags.has('--app');
const [figma, site, out,
  labelFigma = 'Figma (עיצוב) — כך צריך להיות',
  labelSite = app ? 'באפליקציה (בפועל) — כך זה עכשיו' : 'באתר (בפועל) — כך זה עכשיו'] = pos;
if (!figma || !site || !out) {
  console.error('usage: node compare.mjs <figma.png> <site.png> <out.png> [labelFigma] [labelSite] [--rtl] [--force] [--mark-figma x,y,w,h] [--mark-site x,y,w,h]');
  process.exit(1);
}

const dataUri = (p) => {
  const ext = path.extname(p).slice(1).toLowerCase().replace('jpg', 'jpeg') || 'png';
  return `data:image/${ext};base64,${fs.readFileSync(p).toString('base64')}`;
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

// Настоящие размеры обеих картинок (любой формат) — через браузер.
await page.setContent(`<img id="f" src="${dataUri(figma)}"><img id="s" src="${dataUri(site)}">`, { waitUntil: 'load' });
const [f, s] = await page.evaluate(() => ['f', 's'].map((id) => {
  const i = document.getElementById(id);
  return { w: i.naturalWidth, h: i.naturalHeight };
}));

const problems = [];
for (const [name, d] of [['Figma', f], ['сайт', s]]) {
  if (d.w < 360) problems.push(`${name}: ширина ${d.w}px — слишком мелко, переснять крупнее (Figma: больше maxDimension или узел компонента).`);
}
const ratio = Math.max(f.w, s.w) / Math.min(f.w, s.w);
if (ratio > 1.6) problems.push(`Чёткость отличается в ${ratio.toFixed(1)} раза (Figma ${f.w}px, сайт ${s.w}px) — переснять ${f.w < s.w ? 'Figma' : 'сайт'} крупнее.`);
const ar = (d) => d.h / d.w;
const arDiff = Math.max(ar(f), ar(s)) / Math.min(ar(f), ar(s));
if (arDiff > 1.35) problems.push(`Пропорции разные (Figma ${f.w}×${f.h}, сайт ${s.w}×${s.h}) — похоже, сняты разные области. Снять одну и ту же область (узел Figma = тот же элемент сайта).`);

if (problems.length && !force) {
  await browser.close();
  console.error('Склейка не сделана:\n- ' + problems.join('\n- '));
  process.exit(2);
}
if (problems.length) console.warn('ВНИМАНИЕ (--force):\n- ' + problems.join('\n- '));

// Общая ширина = более чёткий снимок (не больше 1440px): ничего не сжимается в нечитаемое.
const width = Math.min(Math.max(f.w, s.w), 1440);
const wide = f.w > f.h || s.w > s.h;
// Красные рамки — в процентах от исходной картинки, поэтому точны при любом масштабе.
const boxes = (list, d) => list.map(([x, y, bw, bh]) =>
  `<div class="mark" style="left:${(x / d.w) * 100}%;top:${(y / d.h) * 100}%;width:${(bw / d.w) * 100}%;height:${(bh / d.h) * 100}%"></div>`).join('');
const col = (label, src, color, list, d) => `
  <div class="col" dir="${rtl ? 'rtl' : 'ltr'}">
    <div class="label" style="background:${color}">${esc(label)}</div>
    <div class="pic"><img src="${src}">${boxes(list, d)}</div>
  </div>`;

// Порядок колонок в RTL: Figma справа. dir только на колонках — иначе страница уезжает влево и режется.
const cols = [col(labelFigma, dataUri(figma), '#6b4eff', marks.figma, f), col(labelSite, dataUri(site), '#d93025', marks.site, s)];
if (rtl && !wide) cols.reverse();
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #fff; font: 600 22px/1.3 -apple-system, Segoe UI, Arial, sans-serif; }
  .wrap { display: flex; flex-direction: ${wide ? 'column' : 'row'}; gap: 24px; padding: 16px; align-items: flex-start; width: max-content; }
  .col { width: ${width}px; border: 1px solid #d0d0d0; }
  .label { color: #fff; padding: 10px 14px; }
  img { display: block; width: 100%; height: auto; }
  .pic { position: relative; }
  .mark { position: absolute; outline: 4px solid #ff0000; outline-offset: 2px; }
</style></head><body><div class="wrap">
  ${cols.join('')}
</div></body></html>`;

await page.setContent(html, { waitUntil: 'load' });
await page.locator('.wrap').screenshot({ path: out });
await browser.close();
console.log(`${out}  (Figma ${f.w}×${f.h}, сайт ${s.w}×${s.h}, колонка ${width}px, ${wide ? 'одна под другой' : 'рядом'})`);
