import WebSocket from 'ws';

const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const target = targets.find((entry) => entry.url.includes('localhost:4173'));
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
await new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject); });
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
console.log(await evaluate(`(() => {
  const v = document.querySelector('video');
  if (!v) return 'no video';
  return JSON.stringify({ readyState: v.readyState, networkState: v.networkState, width: v.videoWidth, height: v.videoHeight, duration: v.duration, error: v.error && v.error.message, src: v.currentSrc, paused: v.paused, preload: v.preload });
})()`));
ws.close();
