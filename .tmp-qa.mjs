import WebSocket from 'ws';
import fs from 'node:fs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const out = 'C:/Users/user/AppData/Local/Temp/opencode';

const target = await (await fetch('http://127.0.0.1:9222/json/new?http://localhost:4173', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});

await new Promise((resolve, reject) => {
  ws.once('open', resolve);
  ws.once('error', reject);
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const messageId = ++id;
    pending.set(messageId, { resolve, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
  });
}

async function evaluate(expression, userGesture = false) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}

async function until(expression, timeout = 90000, interval = 1000) {
  const started = Date.now();
  let last;
  while (Date.now() - started < timeout) {
    try {
      last = await evaluate(expression);
      if (last) return last;
    } catch {
      /* execution context can be replaced during navigation */
    }
    await wait(interval);
  }
  console.log('timeout waiting for:', expression, '(last:', last, ')');
  return null;
}

async function shot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(`${out}/${name}`, Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send('Page.navigate', { url: 'http://localhost:4173' });

const enterReady = await until(
  `!![...document.querySelectorAll('button')].find(b => b.textContent.includes('Enter the world'))`,
  40000,
);
console.log('enter ready:', !!enterReady);
if (!enterReady) {
  console.log('body:', (await evaluate('document.body.innerText')).slice(0, 500));
  process.exit(1);
}
await wait(1200);
console.log('enter:', await evaluate(`(() => {
  const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Enter the world'));
  button?.click();
  return !!button;
})()`, true));

const worldReady = await until(`document.querySelectorAll('.ui-destinations-item').length > 0`, 120000);
console.log('world ready:', !!worldReady);
if (!worldReady) {
  await shot('qa-stuck-loading.png');
  console.log('body:', (await evaluate('document.body.innerText')).slice(0, 500));
  process.exit(1);
}
await wait(2500);
await shot('qa-world.png');

console.log('katisha:', await evaluate(`(() => {
  const button = [...document.querySelectorAll('.ui-destinations-item')].find(b => b.textContent.trim() === 'Katisha');
  button?.click();
  return !!button;
})()`, true));

const heroReady = await until(`!!document.querySelector('.katisha-hero')`, 45000);
console.log('hero ready:', !!heroReady);
if (!heroReady) {
  await shot('qa-stuck-world.png');
  console.log('body:', (await evaluate('document.body.innerText')).slice(0, 500));
  process.exit(1);
}
await wait(3000);

console.log('hero:', await evaluate(`JSON.stringify({
  title: document.querySelector('.experience-title')?.textContent,
  phone: !!document.querySelector('.katisha-phone'),
  videoRect: (() => { const r = document.querySelector('.katisha-phone-video')?.getBoundingClientRect(); return r && { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
  playRect: (() => { const r = document.querySelector('.katisha-phone-play')?.getBoundingClientRect(); return r && { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
})`));

await until(`(() => { const v = document.querySelector('video'); return v && v.readyState >= 2; })()`, 40000);
console.log('video:', await evaluate(`(() => {
  const v = document.querySelector('video');
  if (!v) return 'no video';
  return JSON.stringify({ readyState: v.readyState, networkState: v.networkState, width: v.videoWidth, height: v.videoHeight, duration: v.duration, error: v.error && v.error.message, src: v.currentSrc, paused: v.paused, preload: v.preload });
})()`));
await shot('katisha-hero-desktop.png');

console.log('sample cover:', await evaluate(`(() => {
  const v = document.querySelector('video');
  if (!v) return 'no video';
  try {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 114;
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let sum = 0, max = 0;
    for (let i = 0; i < d.length; i += 4) { const l = (d[i] + d[i+1] + d[i+2]) / 3; sum += l; if (l > max) max = l; }
    return JSON.stringify({ avg: Math.round(sum / (d.length / 4)), max: Math.round(max) });
  } catch (e) { return 'sample error: ' + e.message; }
})()`));

console.log('play:', await evaluate(`(async () => {
  const v = document.querySelector('video');
  try { await v.play(); } catch (e) { return 'play error: ' + e.message; }
  await new Promise((r) => setTimeout(r, 1500));
  return JSON.stringify({ playing: !v.paused, t: v.currentTime.toFixed(2), controls: v.controls });
})()`, true));
await shot('katisha-hero-playing.png');

console.log('reset:', await evaluate(`(() => {
  const v = document.querySelector('video');
  v.pause(); v.currentTime = 0;
  return true;
})()`));
await wait(1000);

console.log('agents:', await evaluate(`(() => {
  const el = document.querySelector('.media-figure-short');
  if (!el) return 'not found';
  el.scrollIntoView({ block: 'center' });
  return JSON.stringify({ h: Math.round(el.getBoundingClientRect().height), imgH: Math.round(el.querySelector('img').getBoundingClientRect().height) });
})()`));
await wait(1400);
await shot('katisha-agents-desktop.png');

await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});
await evaluate(`(() => { const el = document.querySelector('.katisha-hero'); el?.scrollIntoView({ block: 'start' }); return true; })()`);
await wait(1600);
await shot('katisha-hero-mobile.png');
console.log('mobile layout:', await evaluate(`JSON.stringify({
  phoneRect: (() => { const r = document.querySelector('.katisha-phone')?.getBoundingClientRect(); return r && { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
})`));

console.log('done');
ws.close();
setTimeout(() => process.exit(0), 500);
