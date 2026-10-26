import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import handler from './render-page.js'
import { marketplaceServiceDefaults } from '../src/data/marketplaceServiceContent.js'

const article = {
  id: 1,
  slug: 'test-article',
  title: 'A Test Article for Server Rendering',
  excerpt: 'A clear article excerpt for metadata, sharing, and search previews.',
  content: 'The article body is visible in the first HTML response.',
  category: 'Shopify & Tech',
  author: 'EcomXtra Editorial Team',
  author_role: 'Editorial Team',
  is_published: true,
  published_at: '2026-10-20T12:00:00.000Z',
  updated_at: '2026-10-22T12:00:00.000Z',
  cover_image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
  image_metadata: { provider: 'Unsplash', alt: 'Team collaborating around a table' },
}

function createBlogClient(post = article) {
  return {
    from() {
      const filters = {}
      return {
        select() { return this },
        eq(field, value) { filters[field] = value; return this },
        neq() { return this },
        order() { return this },
        limit() { return this },
        range() { return this },
        maybeSingle: async () => ({ data: post && filters.slug === post.slug && filters.is_published ? post : null, error: null }),
        then(resolve, reject) {
          return Promise.resolve({ data: [], error: null }).then(resolve, reject)
        },
      }
    },
  }
}

function createServiceClient(service) {
  return {
    from(table) {
      const filters = {}
      return {
        select() { return this },
        eq(field, value) { filters[field] = value; return this },
        order() { return this },
        maybeSingle: async () => ({
          data: table === 'services' && filters.slug === service?.slug ? service : null,
          error: null,
        }),
        then(resolve, reject) {
          return Promise.resolve({ data: [], error: null }).then(resolve, reject)
        },
      }
    },
  }
}

function createResponse() {
  return {
    headers: {},
    statusCode: 0,
    body: '',
    setHeader(name, value) { this.headers[name] = value },
    end(body = '') { this.body = body },
  }
}

test('SSR bundle contains React Router instead of relying on unavailable deployed files', async () => {
  const serverBundle = await readFile(new URL('../dist/server/entry-server.js', import.meta.url), 'utf8')
  assert.doesNotMatch(serverBundle, /\bfrom\s*["']react-router(?:-dom)?["']/)
})

test('published article requests return SSR HTML with unique SEO tags and article content', async () => {
  const res = createResponse()
  await handler(
    { method: 'GET', url: '/api/render-page?path=%2Fblog%2Ftest-article' },
    res,
    { supabaseClient: createBlogClient() },
  )

  assert.equal(res.statusCode, 200)
  assert.match(res.headers['Content-Type'], /text\/html/)
  assert.match(res.body, /<title>A Test Article for Server Rendering<\/title>/)
  assert.match(res.body, /<link rel="canonical" href="https:\/\/ecomxtra\.in\/blog\/test-article"/)
  assert.match(res.body, /The article body is visible in the first HTML response/)
  assert.match(res.body, /application\/ld\+json/)
  assert.match(res.body, /"@type":"BlogPosting"/)
  assert.equal((res.body.match(/rel="canonical"/g) || []).length, 1)
  assert.match(res.body, /window\.__ECOMXTRA_INITIAL_DATA__/)
  assert.match(res.body, /window\.__ECOMXTRA_SSR__=true/)
})

test('marketplace service requests return SSR copy, canonical metadata, and Service schema', async () => {
  const service = marketplaceServiceDefaults[0]
  const res = createResponse()
  await handler(
    { method: 'GET', url: `/api/render-page?path=%2Fservices%2F${service.slug}` },
    res,
    { supabaseClient: createServiceClient(service) },
  )

  assert.equal(res.statusCode, 200)
  assert.match(res.body, /<title>Amazon Account Management Services in India \| EcomXtra<\/title>/)
  assert.match(res.body, /href="https:\/\/ecomxtra\.in\/services\/amazon-account-management"/)
  assert.match(res.body, /Launch and manage your Amazon seller operations/)
  assert.match(res.body, /"@type":"Service"/)
  assert.match(res.body, /"areaServed":\{"@type":"Country","name":"India"\}/)
  assert.match(res.body, /Read more/)
})

test('unknown marketplace service pages receive HTTP 404', async () => {
  const res = createResponse()
  await handler(
    { method: 'GET', url: '/api/render-page?path=%2Fservices%2Fmissing-marketplace' },
    res,
    { supabaseClient: createServiceClient(null) },
  )

  assert.equal(res.statusCode, 404)
})

test('missing articles and unknown routes receive HTTP 404 and noindex metadata', async () => {
  const articleResponse = createResponse()
  await handler(
    { method: 'GET', url: '/api/render-page?path=%2Fblog%2Fdeleted-post' },
    articleResponse,
    { supabaseClient: createBlogClient(null) },
  )
  assert.equal(articleResponse.statusCode, 404)
  assert.match(articleResponse.body, /<meta name="robots" content="noindex,follow"/)

  const unknownResponse = createResponse()
  await handler(
    { method: 'GET', url: '/api/render-page?path=%2Funknown-page' },
    unknownResponse,
  )
  assert.equal(unknownResponse.statusCode, 404)
  assert.match(unknownResponse.body, /Page Not Found/)
})

test('legacy duplicate routes redirect to their canonical routes', async () => {
  const redirects = [
    ['/api/render-page?path=%2Fabout', 'https://ecomxtra.in/philosophy'],
    ['/api/render-page?path=%2Fservice&ref=nav', 'https://ecomxtra.in/services?ref=nav'],
    ['/api/render-page?path=%2Fblogs&page=2', 'https://ecomxtra.in/blog?page=2'],
  ]

  for (const [url, expectedLocation] of redirects) {
    const res = createResponse()
    await handler({ method: 'GET', url }, res)
    assert.equal(res.statusCode, 308)
    assert.equal(res.headers.Location, expectedLocation)
  }
})
