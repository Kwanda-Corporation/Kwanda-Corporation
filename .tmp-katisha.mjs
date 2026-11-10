import WebSocket from 'ws';
import fs from 'node:fs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const out = 'C:/Users/user/AppData/Local/Temp/opencode';

const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const target = targets.find((entry) => entry.url.includes('localhost:4173'));
if (!target) throw new Error('tab not found');
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
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result?.value;
}
async function shot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(`${out}/${name}`, Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}

console.log(
  'katisha:',
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('.ui-destinations-item')].find(b => b.textContent.trim() === 'Katisha');
    if (!button) return 'not found';
    button.click();
    return 'clicked';
  })()`),
);

await wait(4500);
console.log('experience:', await evaluate(`JSON.stringify({ title: document.querySelector('.experience-title')?.textContent, scroll: !!document.querySelector('.experience-scroll') })`));
await shot('katisha-hero.png');

console.log(
  'agents:',
  await evaluate(`(() => {
    const el = document.querySelector('.media-figure-short');
    if (!el) return 'not found';
    el.scrollIntoView({ block: 'center' });
    return 'scrolled';
  })()`),
);
await wait(1600);
await shot('katisha-agents.png');

console.log(
  'hero again:',
  await evaluate(`(() => {
    const el = document.querySelector('.katisha-hero');
    if (!el) return 'not found';
    el.scrollIntoView({ block: 'start' });
    return 'scrolled';
  })()`),
);
await wait(1200);
await shot('katisha-hero-2.png');

ws.close();
