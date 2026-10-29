import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

function sitemapMiddleware({ forceFresh, cacheControl }) {
  return async (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : ''
    if (url !== '/sitemap.xml' && url !== '/api/sitemap') {
      next()
      return
    }

    try {
      const { generateSitemapXml } = await import('./api/sitemap.js')
      const xml = await generateSitemapXml({ forceFresh })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.setHeader('Cache-Control', cacheControl)
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.end(xml)
    } catch (error) {
      console.error('[Vite Sitemap Error]', error)
      res.statusCode = 503
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.end('Sitemap is temporarily unavailable. Check local Supabase environment configuration.')
    }
  }
}

function adminCronMiddleware() {
  return async (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : ''
    if (url !== '/api/admin/trigger-cron') {
      next()
      return
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }))
      return
    }

    // Parse request body
    let body = ''
    req.on('data', chunk => { body += chunk })
    await new Promise(resolve => req.on('end', resolve))

    // Build minimal req/res shims compatible with our handler
    const shimReq = {
      method: req.method,
      headers: req.headers,
      query: Object.fromEntries(new URL(`http://localhost${req.url}`).searchParams),
      body: body ? (() => { try { return JSON.parse(body) } catch { return {} } })() : {},
    }

    let capturedStatus = 500
    let capturedBody   = { ok: false, error: 'handler_not_invoked' }

    const shimRes = {
      status(code) { capturedStatus = code; return this },
      json(data)   { capturedBody   = data; return this },
      setHeader()  { return this },
    }

    try {
      const { default: handler } = await import('./api/admin/trigger-cron.js')
      await handler(shimReq, shimRes)
    } catch (err) {
      console.error('[Vite Admin Cron Error]', err)
      capturedStatus = 500
      capturedBody   = { ok: false, error: 'handler_threw', message: err?.message }
    }

    res.statusCode = capturedStatus
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(capturedBody))
  }
}

function sitemapDevPlugin() {
  function loadSitemapEnvironment(mode) {
    const env = loadEnv(mode, process.cwd(), '')
    const variables = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_ANON_KEY',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_PUBLISHABLE_KEY',
      'CRON_SECRET',
      'GEMINI_API_KEY',
      'GEMINI_MODEL',
    ]
    for (const variable of variables) {
      if (!process.env[variable] && env[variable]) process.env[variable] = env[variable]
    }
  }

  return {
    name: 'vite-plugin-dynamic-sitemap',
    configResolved(config) {
      loadSitemapEnvironment(config.mode)
    },
    configureServer(server) {
      server.middlewares.use(sitemapMiddleware({
        forceFresh: true,
        cacheControl: 'no-cache',
      }))
      server.middlewares.use(adminCronMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(sitemapMiddleware({
        forceFresh: false,
        cacheControl: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      }))
      server.middlewares.use(adminCronMiddleware())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemapDevPlugin()],
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['deep-forks-end.loca.lt', 'localhost', '127.0.0.1'],
  },
})

