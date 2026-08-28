import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const siteRoot = resolve(import.meta.dirname, 'site');
const distRoot = resolve(import.meta.dirname, 'dist/site');

function filesBelow(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? filesBelow(path) : [path];
  });
}

function casefileServiceWorker(): Plugin {
  return {
    name: 'casefile-versioned-service-worker',
    closeBundle() {
      const files = filesBelow(distRoot).filter((path) => !path.endsWith('/sw.js')).sort();
      const digest = createHash('sha256');
      for (const path of files) digest.update(readFileSync(path));
      const version = digest.digest('hex').slice(0, 12);
      const shell = files
        .map((path) => relative(distRoot, path).replaceAll('\\', '/'))
        .filter((path) => path.endsWith('.html') || path.startsWith('assets/') || path === 'site.webmanifest')
        .map((path) => path === 'index.html' ? '/' : path.endsWith('/index.html') ? `/${path.slice(0, -10)}` : `/${path}`);
      const source = `const CACHE = 'casefile-shell-${version}';
const SHELL = ${JSON.stringify(shell)};
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('casefile-shell-') && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    if (request.mode === 'navigate') {
      try {
        const fresh = await fetch(request);
        if (fresh.ok) (await caches.open(CACHE)).put(request, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match('/404.html'));
      }
    }
    const cached = await caches.match(request);
    if (cached) return cached;
    const fresh = await fetch(request);
    if (fresh.ok) (await caches.open(CACHE)).put(request, fresh.clone());
    return fresh;
  })());
});
`;
      writeFileSync(join(distRoot, 'sw.js'), source);
    },
    configurePreviewServer(server) {
      const known = new Set(['/', '/demo', '/demo/', '/privacy', '/privacy/', '/terms', '/terms/', '/404.html']);
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://preview.local').pathname;
        if (!known.has(pathname) && !pathname.includes('.')) {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(join(distRoot, '404.html')));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: siteRoot,
  publicDir: 'public',
  plugins: [casefileServiceWorker()],
  preview: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self' https://api.sociobot.in; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  },
  build: {
    outDir: distRoot,
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        home: resolve(siteRoot, 'index.html'),
        demo: resolve(siteRoot, 'demo/index.html'),
        privacy: resolve(siteRoot, 'privacy/index.html'),
        terms: resolve(siteRoot, 'terms/index.html'),
        notFound: resolve(siteRoot, '404.html'),
      },
    },
  },
});
