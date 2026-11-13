import archivedProof from './assets/portrait-proof.js?v=archive';
import frames from './assets/face-lab-orbit.js';

const width = 750;
const height = 800;
const palette = {
  ascii: ['#163e42', '#9bdfbc', '#fcf4d8'],
  fractal: ['#182936', '#6de5c4', '#efb669'],
  transduction: ['#671e54', '#ffc9e9', '#ff9f69'],
  city: ['#262052', '#b9b9ee', '#f8be75'],
  atlas: ['#24382e', '#b0d990', '#f6d49d'],
  portrait: ['#53202c', '#f1a992', '#fff1da'],
};

function rng(seed) {
  return () => {
    seed = (Math.imul(1664525,seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function annotate(ctx, label, x, y) {
  ctx.font = '15px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(label, x, y);
}

function drawPortrait(ctx, tones) {
  const proof = archivedProof;
  const columns = proof[0].length;
  const start = 58;
  const step = (width - start * 2) / columns;
  const band = 10.6;
  ctx.textAlign = 'center';
  ctx.font = '12px "IBM Plex Mono", monospace';
  const rowCenter = Math.floor(proof.length / 2);
  ctx.strokeStyle = tones[1] + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 6, 285, 0, Math.PI * 2);
  ctx.moveTo(width / 2, 57);
  ctx.lineTo(width / 2, 740);
  ctx.moveTo(48, 403);
  ctx.lineTo(701, 403);
  ctx.stroke();
  proof.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const letter = row[x];
      if (letter === ' ') continue;
      ctx.fillStyle = Math.abs(y - rowCenter) < 5 ? tones[2] : tones[1];
      ctx.fillText(letter, start + (x + .5) * step, 69 + y * band);
    }
  });
  ctx.fillStyle = tones[2];
  annotate(ctx, '01B', 660, 58);
}

function drawOrbitPaper(ctx) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#9bdfbc38';
  ctx.beginPath();
  ctx.arc(375,400,278,0,Math.PI*2);
  ctx.moveTo(375,99);
  ctx.lineTo(375,690);
  ctx.moveTo(76,400);
  ctx.lineTo(674,400);
  ctx.moveTo(76,706);
  ctx.lineTo(674,706);
  for (let i=0; i<=8; i++) {
    const x=76+i*(598/8);
    ctx.moveTo(x,700);
    ctx.lineTo(x,712);
  }
  ctx.stroke();
}

const orbitRows = frames.map(frame => frame.split('\n'));
const orbitRamp = ' .,:;irsx253hMHGS#9B&@';
const orbitTones = ['#669c89','#82baa4','#a7dac0','#cff1d6','#fcf4d8'];
const restingPose = 6;
const orbitDuration = 8400;

function drawOrbitFrame(ctx, pose) {
  ctx.drawImage(getImpression('ascii'),0,0);
  ctx.textAlign = 'center';
  ctx.font = '11.65px "IBM Plex Mono", monospace';
  orbitRows[pose].forEach((row,y) => {
    for (let x=0; x<row.length; x++) {
      const char = row[x];
      if (char === ' ') continue;
      ctx.fillStyle = orbitTones[Math.min(4,Math.floor(orbitRamp.indexOf(char)/3.4))];
      ctx.fillText(char, 42.5+x*7, 64+y*10.3);
    }
  });
  const x = 76+598*pose/(orbitRows.length-1);
  ctx.fillStyle = '#fcf4d8';
  ctx.fillRect(x-2,703,4,6);
  ctx.textAlign = 'center';
  ctx.font = '14px "IBM Plex Mono", monospace';
  ctx.fillText(String(pose*2).padStart(2,'0') + '°', x, 730);
}

function drawFractal(ctx, tones) {
  const size = 480;
  const sample = document.createElement('canvas');
  sample.width = sample.height = size;
  const sc = sample.getContext('2d');
  const data = sc.createImageData(size, size);
  const color = value => [1,3,5].map(i => parseInt(value.slice(i,i+2),16));
  const stops = tones.map(color);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = -0.754 + (x / size - .53) * .089;
      const cy = .118 + (y / size - .5) * .089;
      let u = 0, v = 0, n = 0;
      while (u * u + v * v < 4 && n < 112) {
        const next = u * u - v * v + cx;
        v = 2 * u * v + cy;
        u = next;
        n++;
      }
      const d = n === 112 ? 0 : Math.min(1, (n % 26) / 26);
      const a = stops[d < .64 ? 0 : 1], b = stops[d < .64 ? 1 : 2];
      const t = d < .64 ? (d / .64) ** .65 : (d - .64) / .36;
      const p = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) data.data[p+c] = a[c] + (b[c] - a[c]) * t;
      data.data[p+3] = 255;
    }
  }
  sc.putImageData(data,0,0);
  ctx.drawImage(sample, 31, 53, 688, 688);
  ctx.fillStyle = tones[2];
  annotate(ctx, 'z  ↦  z² + c', 43, 765);
}

function drawTransduction(ctx, tones) {
  ctx.lineWidth = 1.4;
  for (let track = 0; track < 44; track++) {
    ctx.beginPath();
    for (let x = 0; x <= 653; x += 3) {
      const envelope = Math.sin(Math.PI * x / 653);
      const y = 210 + track * 9 + envelope * (28 + track * 1.58) *
        Math.sin(x * .033 + track * .182) * Math.cos(x * .007 - track * .10);
      if (x === 0) ctx.moveTo(x + 48,y);
      else ctx.lineTo(x + 48,y);
    }
    ctx.strokeStyle = track % 7 === 0 ? tones[2] : tones[1] + 'ac';
    ctx.stroke();
  }
}

function drawCity(ctx, tones) {
  const random = rng(42);
  ctx.save();
  ctx.translate(365,379);
  ctx.rotate(-.29);
  ctx.lineWidth = 2;
  ctx.strokeStyle = tones[1] + '66';
  for (let i = -7; i <= 7; i++) {
    ctx.beginPath();
    ctx.moveTo(-530, i * 55);
    ctx.lineTo(530, i * 55 + 63);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i * 56,-520);
    ctx.lineTo(i * 56 - 43, 520);
    ctx.stroke();
  }
  ctx.fillStyle = tones[1] + '74';
  for (let i = 0; i < 130; i++) ctx.fillRect((random()-.5)*800,(random()-.5)*760,8+random()*22,3+random()*13);
  ctx.beginPath();
  const points = [[-268,218],[-155,222],[-149,111],[-36,118],[-28,-47],[82,-41],[91,-211],[259,-201]];
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = tones[2];
  ctx.stroke();
  for (const [x,y] of [points[0],points.at(-1)]) {
    ctx.beginPath();
    ctx.arc(x,y,12,0,Math.PI*2);
    ctx.fillStyle = tones[2];
    ctx.fill();
  }
  ctx.restore();
}

function drawAtlas(ctx, tones) {
  const pts = [[154,246],[183,421],[156,580],[380,150],[375,398],[384,638],[585,217],[570,455],[599,573]];
  const edges = [[0,3],[0,4],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[4,8],[5,8]];
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = tones[1] + '92';
  for (const [a,b] of edges) {
    ctx.beginPath();
    ctx.moveTo(...pts[a]);
    ctx.lineTo(...pts[b]);
    ctx.stroke();
  }
  pts.forEach(([x,y], i) => {
    ctx.beginPath();
    ctx.arc(x,y,i===4?37:20,0,Math.PI*2);
    ctx.fillStyle = i===4 ? tones[2] : tones[1];
    ctx.fill();
    ctx.fillStyle = tones[1];
    annotate(ctx, String(i+1).padStart(2,'0'), x+24,y-17);
  });
}

function drawIndexPlate(ctx, tones, number) {
  ctx.save();
  ctx.translate(width/2,height/2);
  ctx.rotate(-.22);
  for (let i=0; i<11; i++) {
    ctx.strokeStyle = tones[1] + '55';
    ctx.strokeRect(-235+i*12,-290+i*12,470-i*24,580-i*24);
  }
  ctx.rotate(.22);
  ctx.fillStyle = tones[2];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 276px "Barlow Condensed", Impact, sans-serif';
  ctx.fillText(number,0,0);
  ctx.restore();
}

const studies = {
  ascii: { medium:'Photo-fitted turntable', draw:drawOrbitPaper },
  fractal: { medium:'Escape-time study', draw:drawFractal },
  transduction: { medium:'Signal study', draw:drawTransduction },
  city: { medium:'Route study', draw:drawCity },
  atlas: { medium:'Learning paths', draw:drawAtlas },
  portrait: { title:'ASCII Portrait', medium:'Original proof', number:'01B', draw:drawPortrait },
};
const plate = document.querySelector('.plate');
const art = plate.querySelector('canvas');
const context = art.getContext('2d');
const projects = document.querySelector('.projects');
const rows = [...projects.children];
const numberLabel = number => String(number).padStart(2,'0');
rows.forEach((row,index) => {
  const link = row.querySelector('.entry');
  const number = numberLabel(index+1);
  const key = link.dataset.study || 'project-' + number;
  link.dataset.study = key;
  link.querySelector('.number').textContent = number;
  studies[key] = {
    medium: link.dataset.medium || '',
    draw: (ctx,tones) => drawIndexPlate(ctx,tones,number),
    ...(Object.hasOwn(studies,key) && studies[key]),
    title: link.querySelector('.entry-text strong').textContent,
    number,
  };
});
const entries = [...document.querySelectorAll('[data-study]')];
const egg = document.querySelector('.lab-egg');
const stamp = egg.querySelector('summary');
const orbitToggle = plate.querySelector('.orbit-toggle');
const cached = new Map();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const pageSize = 6;
const pageTotal = Math.ceil(rows.length / pageSize);
const footer = document.querySelector('.index-footer');
const previousPage = footer.querySelector('.page-prev');
const nextPage = footer.querySelector('.page-next');
const pageCount = footer.querySelector('.page-count');
const indexRange = document.querySelector('.index-range');
let page;
let current;
let impression;
let animation = 0;
let requestId = 0;
let orbitId = 0;
let orbitTime = Math.acos(1-2*restingPose/(orbitRows.length-1))*orbitDuration/(2*Math.PI);
let lastTick = 0;
let currentPose = restingPose;
let orbitVisible = false;
let orbitPaused = false;

function getImpression(key) {
  if (!cached.has(key)) {
    const sheet = document.createElement('canvas');
    sheet.width = width;
    sheet.height = height;
    const ctx = sheet.getContext('2d');
    const tones = Object.hasOwn(palette,key) ? palette[key] : palette.atlas;
    ctx.fillStyle = tones[0];
    ctx.fillRect(0,0,width,height);
    studies[key].draw(ctx,tones);
    const random = rng(18);
    ctx.fillStyle = '#fff4dd26';
    for (let i=0;i<5900;i++) ctx.fillRect(random()*width,random()*height,1.2,1.2);
    cached.set(key,sheet);
  }
  return cached.get(key);
}

function show(key, motion = true) {
  if (current === key) return;
  const wasOrbit = current === 'ascii';
  stopOrbit();
  current = key;
  const study = studies[key];
  const next = key === 'ascii' ? snapshot() : getImpression(key);
  if (key === 'ascii') drawOrbitFrame(next.getContext('2d'),reduced.matches ? restingPose : currentPose);
  let previous = impression;
  if (animation || wasOrbit) {
    cancelAnimationFrame(animation);
    animation = 0;
    previous = snapshot();
    previous.getContext('2d').drawImage(art,0,0);
  }
  impression = next;
  plate.dataset.plate = key;
  plate.querySelector('.plate-no').textContent = key === 'portrait' ? study.number : study.number + ' / ' + numberLabel(rows.length);
  plate.querySelector('.plate-name').textContent = study.title;
  plate.querySelector('.plate-medium').textContent = study.medium;
  updateOrbitToggle();
  entries.forEach(entry => entry.toggleAttribute('data-active',entry.dataset.study === key));
  if (!previous || !motion || reduced.matches) {
    context.drawImage(next,0,0);
    syncOrbit();
    return;
  }
  const start = performance.now();
  function print(now) {
    const amount = Math.min(1, (now-start)/405);
    const front = (1-(1-amount)**3)*(width+105)-104;
    context.drawImage(previous,0,0);
    context.save();
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(front+105,0);
    context.lineTo(front,height);
    context.lineTo(0,height);
    context.closePath();
    context.clip();
    context.drawImage(next,0,0);
    context.restore();
    if (amount<1 && !reduced.matches) animation=requestAnimationFrame(print);
    else {
      if (key === 'ascii' && reduced.matches) drawOrbitFrame(context,restingPose);
      else context.drawImage(next,0,0);
      animation=0;
      syncOrbit();
    }
  }
  animation=requestAnimationFrame(print);
}

function snapshot() {
  const sheet = document.createElement('canvas');
  sheet.width = width;
  sheet.height = height;
  return sheet;
}

function stopOrbit() {
  cancelAnimationFrame(orbitId);
  orbitId = 0;
  lastTick = 0;
}

function syncOrbit() {
  if (current !== 'ascii' || animation || !orbitVisible || orbitPaused || reduced.matches || document.hidden) {
    stopOrbit();
  } else if (!orbitId) {
    orbitId = requestAnimationFrame(tickOrbit);
  }
}

function tickOrbit(now) {
  if (lastTick) orbitTime = (orbitTime+Math.min(now-lastTick,100))%orbitDuration;
  lastTick = now;
  const nextPose = Math.round((orbitRows.length-1)*(.5-.5*Math.cos(2*Math.PI*orbitTime/orbitDuration)));
  if (nextPose !== currentPose) {
    currentPose = nextPose;
    drawOrbitFrame(context,currentPose);
  }
  orbitId = requestAnimationFrame(tickOrbit);
}

function updateOrbitToggle() {
  orbitToggle.hidden = current !== 'ascii' || reduced.matches;
  orbitToggle.toggleAttribute('data-paused',orbitPaused);
  orbitToggle.setAttribute('aria-label',orbitPaused ? 'Resume portrait rotation' : 'Pause portrait rotation');
}

orbitToggle.addEventListener('click', () => {
  orbitPaused = !orbitPaused;
  updateOrbitToggle();
  syncOrbit();
});
new IntersectionObserver(([entry]) => {
  orbitVisible = entry.isIntersecting;
  syncOrbit();
}).observe(art);
document.addEventListener('visibilitychange',syncOrbit);
reduced.addEventListener('change', () => {
  updateOrbitToggle();
  syncOrbit();
  if (current === 'ascii' && !animation) drawOrbitFrame(context,reduced.matches ? restingPose : currentPose);
});

for (const entry of entries) {
  const choose = () => {
    cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(() => {
      if (!entry.closest('[hidden]')) show(entry.dataset.study);
    });
  };
  entry.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch') choose();
  });
  entry.addEventListener('focus',choose);
}
egg.addEventListener('toggle', () => {
  if (egg.closest('[hidden]')) return;
  cancelAnimationFrame(requestId);
  show(egg.open ? 'portrait' : 'ascii');
});
egg.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !egg.open) return;
  egg.open = false;
  stamp.focus();
});
function pageFromLocation() {
  const requested = new URL(location.href).searchParams.get('page');
  return requested && /^\d+$/.test(requested) ? Math.max(1,Math.min(Number(requested),pageTotal)) : 1;
}

function pageUrl(number) {
  const url = new URL(location.href);
  if (number === 1) url.searchParams.delete('page');
  else url.searchParams.set('page',number);
  url.hash = '';
  return url;
}

function renderPage(number, moveFocus = false) {
  if (number === page) return;
  page = number;
  cancelAnimationFrame(requestId);
  const start = (page-1)*pageSize;
  const end = Math.min(start+pageSize,rows.length);
  rows.forEach((row,index) => { row.hidden = index<start || index>=end; });
  if (egg.closest('[hidden]')) egg.open = false;
  projects.start = start+1;
  indexRange.textContent = start+1 === end ? numberLabel(end) : numberLabel(start+1)+'–'+numberLabel(end);
  footer.hidden = pageTotal <= 1;
  previousPage.hidden = page <= 1;
  nextPage.hidden = page >= pageTotal;
  if (!previousPage.hidden) previousPage.href = pageUrl(page-1);
  if (!nextPage.hidden) nextPage.href = pageUrl(page+1);
  pageCount.textContent = 'Page '+page+' of '+pageTotal;
  show(rows[start].querySelector('.entry').dataset.study,false);
  if (moveFocus) {
    document.getElementById('work-title').focus({ preventScroll:true });
    document.getElementById('work').scrollIntoView({ block:'start' });
  }
}

for (const [link,step] of [[previousPage,-1],[nextPage,1]]) {
  link.addEventListener('click',event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const number = page+step;
    history.pushState(null,'',pageUrl(number));
    renderPage(number,true);
  });
}
window.addEventListener('popstate',() => renderPage(pageFromLocation()));
renderPage(pageFromLocation());
document.fonts.ready.then(() => {
  const key = current;
  cached.clear();
  current = undefined;
  show(key,false);
});
