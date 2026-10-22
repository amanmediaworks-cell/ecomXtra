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

function sitemapDevPlugin() {
  function loadSitemapEnvironment(mode) {
    const env = loadEnv(mode, process.cwd(), '')
    const variables = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_ANON_KEY',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_PUBLISHABLE_KEY',
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
    },
    configurePreviewServer(server) {
      server.middlewares.use(sitemapMiddleware({
        forceFresh: false,
        cacheControl: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      }))
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
