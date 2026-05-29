#!/usr/bin/env node
const base = process.env.BASE_URL || 'http://localhost:3000';
const token = process.env.ACCESS_TOKEN;

if (!token) {
  console.error('Usage: ACCESS_TOKEN=<token> node scripts/sse-test.js');
  process.exit(1);
}

(async () => {
  const fetchFn = globalThis.fetch || (await import('node-fetch')).default;
  const res = await fetchFn(`${base}/notifications/sse`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error('SSE connection failed', res.status, await res.text());
    process.exit(1);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  console.log('Connected to SSE, waiting for events...');
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const chunk = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      console.log('--- SSE chunk ---\n' + chunk + '\n');
    }
  }
  console.log('SSE stream closed');
})();
