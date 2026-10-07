const http = require('http');

async function testUrl(url, cookie = '') {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        ...(cookie ? { 'Cookie': cookie } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const titleMatch = body.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';
        const rewrite = res.headers['x-middleware-rewrite'];
        const location = res.headers['location'];
        resolve({
          status: res.statusCode,
          title,
          rewrite,
          location,
          bodySnippet: body.slice(0, 150).replace(/\s+/g, ' ')
        });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });
}

async function run() {
  const tests = [
    'http://localhost:3000/dashboard',
    'http://localhost:3000/es/dashboard',
    'http://localhost:3000/dashboard/libro-4to',
    'http://localhost:3000/es/dashboard/libro-4to',
    'http://localhost:3000/dashboard/modules/1/exercises',
    'http://localhost:3000/es/dashboard/modules/1/exercises',
    'http://localhost:3000/dashboard/modules/libro-4to/exercises',
    'http://localhost:3000/es/dashboard/modules/libro-4to/exercises',
    'http://localhost:3000/dashboard/modules/4/exercises',
    'http://localhost:3000/es/dashboard/modules/4/exercises',
  ];

  for (const t of tests) {
    const resNoCookie = await testUrl(t);
    console.log(`URL: ${t}`);
    console.log(`  -> Status: ${resNoCookie.status}, Title: "${resNoCookie.title}", Rewrite: ${resNoCookie.rewrite}, Location: ${resNoCookie.location}`);
  }
}

run();
