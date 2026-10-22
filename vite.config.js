import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function sitemapDevPlugin() {
  return {
    name: 'vite-plugin-dynamic-sitemap',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''
        if (url === '/sitemap.xml' || url === '/api/sitemap') {
          try {
            const { generateSitemapXml } = await import('./api/sitemap.js')
            const xml = await generateSitemapXml({ forceFresh: true })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/xml; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.end(xml)
            return
          } catch (err) {
            console.error('[Vite Sitemap Dev Error]', err)
            next(err)
            return
          }
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''
        if (url === '/sitemap.xml' || url === '/api/sitemap') {
          try {
            const { generateSitemapXml } = await import('./api/sitemap.js')
            const xml = await generateSitemapXml()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/xml; charset=utf-8')
            res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.end(xml)
            return
          } catch (err) {
            next(err)
          }
        }
        next()
      })
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
