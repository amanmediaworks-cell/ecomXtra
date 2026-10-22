import test from 'node:test'
import assert from 'node:assert/strict'
import handler, {
  buildSitemapXmlString,
  escapeXml,
  formatLastmodDate,
  generateSitemapXml,
} from './sitemap.js'

test('escapeXml correctly escapes all XML special characters', () => {
  assert.equal(escapeXml('hello & world'), 'hello &amp; world')
  assert.equal(escapeXml('<foo>'), '&lt;foo&gt;')
  assert.equal(escapeXml('"quoted"'), '&quot;quoted&quot;')
  assert.equal(escapeXml("it's"), 'it&apos;s')
  assert.equal(escapeXml(null), '')
  assert.equal(escapeXml(undefined), '')
})

test('formatLastmodDate formats valid dates into YYYY-MM-DD and rejects invalid dates', () => {
  assert.equal(formatLastmodDate('2026-10-22T03:40:07.381Z'), '2026-10-22')
  assert.equal(formatLastmodDate('2026-05-15'), '2026-05-15')
  assert.equal(formatLastmodDate(new Date('2026-01-01T00:00:00Z')), '2026-01-01')
  assert.equal(formatLastmodDate(null), null)
  assert.equal(formatLastmodDate('not-a-date'), null)
  assert.equal(formatLastmodDate(''), null)
})

test('buildSitemapXmlString outputs valid sitemap XML with sitemaps.org namespace', () => {
  const entries = [
    { loc: 'https://ecomxtra.in/', lastmod: '2026-10-20' },
    { loc: 'https://ecomxtra.in/blog', lastmod: null },
    { loc: 'https://ecomxtra.in/blog/test-post', lastmod: '2026-10-22' },
  ]
  const xml = buildSitemapXmlString(entries)

  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))
  assert.ok(xml.includes('<url><loc>https://ecomxtra.in/</loc><lastmod>2026-10-20</lastmod></url>'))
  assert.ok(xml.includes('<url><loc>https://ecomxtra.in/blog</loc></url>'))
  assert.ok(xml.includes('<url><loc>https://ecomxtra.in/blog/test-post</loc><lastmod>2026-10-22</lastmod></url>'))
  assert.ok(xml.endsWith('</urlset>'))
})

test('buildSitemapXmlString properly escapes URLs with XML-sensitive characters', () => {
  const entries = [
    { loc: 'https://ecomxtra.in/blog/tag?a=1&b=2', lastmod: null },
  ]
  const xml = buildSitemapXmlString(entries)
  assert.ok(xml.includes('<loc>https://ecomxtra.in/blog/tag?a=1&amp;b=2</loc>'))
})

test('generateSitemapXml generates complete sitemap with public static routes and published posts', async () => {
  const xml = await generateSitemapXml({ forceFresh: true })

  // 1. Valid XML header and namespace
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'))

  // 2. Required static pages
  const requiredStaticUrls = [
    'https://ecomxtra.in/',
    'https://ecomxtra.in/about',
    'https://ecomxtra.in/philosophy',
    'https://ecomxtra.in/services',
    'https://ecomxtra.in/service',
    'https://ecomxtra.in/showcase',
    'https://ecomxtra.in/testimonials',
    'https://ecomxtra.in/contact',
    'https://ecomxtra.in/blog',
  ]
  for (const url of requiredStaticUrls) {
    assert.ok(xml.includes(`<loc>${url}</loc>`), `Expected ${url} to be present in sitemap`)
  }

  // 3. Dynamic published blog posts
  assert.ok(xml.includes('/blog/mastering-post-purchase-upselling-turning-one-time-buyers-into-loyal-customers'))

  // 4. Ensure no private, administrative, or internal URLs exist
  const forbiddenPatterns = [
    '/admin',
    '/login',
    '/register',
    '/signup',
    '/logout',
    '/dashboard',
    '/profile',
    '/account',
    '/settings',
    '/api/',
  ]
  for (const forbidden of forbiddenPatterns) {
    assert.ok(
      !xml.includes(`<loc>https://ecomxtra.in${forbidden}</loc>`),
      `Forbidden route ${forbidden} found in sitemap!`,
    )
    assert.ok(
      !xml.includes(`<loc>https://ecomxtra.in${forbidden}/</loc>`),
      `Forbidden route ${forbidden}/ found in sitemap!`,
    )
  }

  // 5. Ensure valid XML structure by checking tag symmetry
  const openUrlCount = (xml.match(/<url>/g) || []).length
  const closeUrlCount = (xml.match(/<\/url>/g) || []).length
  assert.equal(openUrlCount, closeUrlCount, 'Mismatched <url> tags')

  const openLocCount = (xml.match(/<loc>/g) || []).length
  const closeLocCount = (xml.match(/<\/loc>/g) || []).length
  assert.equal(openLocCount, closeLocCount, 'Mismatched <loc> tags')

  // 6. Ensure all lastmod values conform to YYYY-MM-DD
  const lastmodMatches = xml.match(/<lastmod>([^<]+)<\/lastmod>/g) || []
  assert.ok(lastmodMatches.length > 0, 'Expected at least one lastmod in sitemap')
  for (const match of lastmodMatches) {
    const dateStr = match.replace('<lastmod>', '').replace('</lastmod>', '')
    assert.match(dateStr, /^\d{4}-\d{2}-\d{2}$/, `Invalid date format in lastmod: ${dateStr}`)
  }
})

test('handler sets HTTP 200, Content-Type application/xml; charset=utf-8, and security/cache headers', async () => {
  const headers = {}
  let body = null

  const res = {
    statusCode: 200,
    setHeader(key, value) {
      headers[key] = value
    },
    send(data) {
      body = data
      return this
    },
    end(data) {
      if (data) body = data
      return this
    },
  }

  await handler({ method: 'GET' }, res)

  assert.equal(res.statusCode, 200)
  assert.equal(headers['Content-Type'], 'application/xml; charset=utf-8')
  assert.ok(headers['Cache-Control'].includes('s-maxage='))
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.ok(typeof body === 'string')
  assert.ok(body.includes('<urlset'))
})

test('handler responds to HEAD requests with headers and no body', async () => {
  const headers = {}
  let ended = false
  let body = null

  const res = {
    statusCode: 200,
    setHeader(key, value) {
      headers[key] = value
    },
    send(data) {
      body = data
      return this
    },
    end(data) {
      ended = true
      if (data) body = data
      return this
    },
  }

  await handler({ method: 'HEAD' }, res)

  assert.equal(res.statusCode, 200)
  assert.equal(headers['Content-Type'], 'application/xml; charset=utf-8')
  assert.ok(headers['Content-Length'] > 0)
  assert.equal(ended, true)
  assert.equal(body, null)
})

test('handler rejects unsupported HTTP methods with 405', async () => {
  const headers = {}
  let body = null

  const res = {
    statusCode: 200,
    setHeader(key, value) {
      headers[key] = value
    },
    send(data) {
      body = data
      return this
    },
    end(data) {
      if (data) body = data
      return this
    },
  }

  await handler({ method: 'POST' }, res)

  assert.equal(res.statusCode, 405)
  assert.equal(headers['Allow'], 'GET, HEAD')
  assert.equal(body, 'Method Not Allowed')
})
