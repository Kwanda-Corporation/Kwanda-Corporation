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

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result?.value;
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
await wait(6000);

console.log('opening buttons:', await evaluate(`JSON.stringify([...document.querySelectorAll('button')].map(b => b.textContent))`));

console.log(
  'enter:',
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Enter the world'));
    if (!button) return 'not found';
    button.click();
    return 'clicked';
  })()`),
);

await wait(9000);
await shot('world.png');

console.log(
  'katisha:',
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('.ui-destinations-item')].find(b => b.textContent.trim() === 'Katisha');
    if (!button) return 'not found';
    button.click();
    return 'clicked';
  })()`),
);

await wait(5000);
await shot('katisha-hero.png');

console.log(
  'scroll:',
  await evaluate(`(() => {
    const el = document.querySelector('.media-figure-short');
    if (!el) return 'not found';
    el.scrollIntoView({ block: 'center' });
    return 'scrolled';
  })()`),
);

await wait(1400);
await shot('katisha-agents.png');

console.log('done');
ws.close();
