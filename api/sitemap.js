import { createClient } from '@supabase/supabase-js'
import process from 'node:process'
import { Buffer } from 'node:buffer'

const CANONICAL_ORIGIN = 'https://ecomxtra.in'
const SUPABASE_TIMEOUT_MS = 4000
const CACHE_TTL_MS = 60 * 1000 // 1 minute in-memory cache
const SITEMAP_URL_LIMIT = 50000
const SUPABASE_PAGE_SIZE = 1000

// In-memory cache for serverless execution environment
let inMemoryCache = {
  xml: null,
  expiresAt: 0,
}

// Disallowed routes and slugs pattern to ensure no internal/admin paths can ever leak
const DISALLOWED_ROUTE_PATTERN = /^(admin|login|register|signup|logout|dashboard|profile|account|settings|api|null|undefined)(\/|$)/i

// Explicit allowlist of static public routes with corresponding content_key in site_content table
const STATIC_PUBLIC_ROUTES = [
  { path: '/', contentKey: 'seo' },
  { path: '/philosophy', contentKey: 'about' },
  { path: '/services', contentKey: 'services_section' },
  { path: '/showcase', contentKey: 'showcase_section' },
  { path: '/testimonials', contentKey: 'testimonials_section' },
  { path: '/contact', contentKey: 'contact' },
  { path: '/blog', contentKey: null }, // Uses latest published blog post timestamp
]

/**
 * Escapes characters that have special meaning in XML.
 */
export function escapeXml(value) {
  if (value == null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Formats a date into a valid W3C/ISO 8601 YYYY-MM-DD string.
 * Returns null if the date is invalid or absent.
 */
export function formatLastmodDate(dateValue) {
  if (!dateValue) return null
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

/**
 * Creates a Supabase client using environment variables.
 */
export function createSitemapSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    return null
  }

  const abortableFetch = (input, init = {}) => fetch(input, {
    ...init,
    signal: init.signal || AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
  })

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: { fetch: abortableFetch },
  })
}

/**
 * Builds the standards-compliant XML sitemap string from an array of URL entries.
 */
export function buildSitemapXmlString(entries) {
  const urlsXml = entries.map(entry => {
    const locXml = `<loc>${escapeXml(entry.loc)}</loc>`
    const lastmodXml = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''
    return `  <url>${locXml}${lastmodXml}</url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`
}

/**
 * Generates the dynamic XML sitemap string.
 * Queries Supabase for published blog posts and site_content modification dates.
 * Fails explicitly when published-route data cannot be read.
 */
export async function generateSitemapXml({ forceFresh = false, supabaseClient = null } = {}) {
  const now = Date.now()
  if (!forceFresh && inMemoryCache.xml && inMemoryCache.expiresAt > now) {
    return inMemoryCache.xml
  }

  const supabase = supabaseClient || createSitemapSupabaseClient()
  if (!supabase) {
    throw new Error('Sitemap generation requires Supabase configuration.')
  }
  const [contentResult, firstBlogResult] = await Promise.all([
    supabase
      .from('site_content')
      .select('content_key, updated_at')
      .eq('is_public', true),
    supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at, is_published')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(0, SUPABASE_PAGE_SIZE - 1),
  ])
  if (contentResult.error) throw new Error(`Failed to fetch sitemap page dates: ${contentResult.error.message}`)
  if (firstBlogResult.error) throw new Error(`Failed to fetch published sitemap articles: ${firstBlogResult.error.message}`)
  const contentDates = {}
  for (const row of contentResult.data || []) {
    if (row.content_key && row.updated_at) contentDates[row.content_key] = row.updated_at
  }
  const publishedBlogPosts = [...(firstBlogResult.data || [])]
  const maxArticleCount = SITEMAP_URL_LIMIT - STATIC_PUBLIC_ROUTES.length
  for (let start = SUPABASE_PAGE_SIZE; start <= maxArticleCount; start += SUPABASE_PAGE_SIZE) {
    if (publishedBlogPosts.length < start) break
    const end = Math.min(start + SUPABASE_PAGE_SIZE - 1, maxArticleCount)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at, is_published')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(start, end)
    if (error) throw new Error(`Failed to fetch published sitemap articles: ${error.message}`)
    publishedBlogPosts.push(...(data || []))
    if ((data || []).length < end - start + 1) break
  }
  if (publishedBlogPosts.length > maxArticleCount) {
    throw new Error('Sitemap exceeds the 50,000 URL limit.')
  }

  // Find latest published blog date to serve as lastmod for /blog
  let latestBlogLastmod = null
  let latestBlogTimestamp = 0
  for (const post of publishedBlogPosts) {
    const candidate = post.updated_at || post.published_at
    const timestamp = candidate ? new Date(candidate).getTime() : Number.NaN
    if (Number.isFinite(timestamp) && timestamp > latestBlogTimestamp) {
      latestBlogTimestamp = timestamp
      latestBlogLastmod = formatLastmodDate(candidate)
    }
  }

  const entries = []
  const seenUrls = new Set()

  function addUrl(loc, lastmodDate) {
    if (!loc) return
    const trimmedLoc = loc.trim()
    if (seenUrls.has(trimmedLoc)) return
    if (entries.length >= 50000) {
      throw new Error('Sitemap exceeds the 50,000 URL limit.')
    }

    seenUrls.add(trimmedLoc)
    const validLastmod = formatLastmodDate(lastmodDate)
    entries.push({
      loc: trimmedLoc,
      lastmod: validLastmod,
    })
  }

  // 1. Static allowlisted pages
  for (const staticRoute of STATIC_PUBLIC_ROUTES) {
    const loc = staticRoute.path === '/'
      ? `${CANONICAL_ORIGIN}/`
      : `${CANONICAL_ORIGIN}${staticRoute.path}`

    let lastmod = null
    if (staticRoute.path === '/blog') {
      lastmod = latestBlogLastmod
    } else if (staticRoute.contentKey && contentDates[staticRoute.contentKey]) {
      lastmod = contentDates[staticRoute.contentKey]
    }

    addUrl(loc, lastmod)
  }

  // 2. Dynamic published blog posts
  for (const post of publishedBlogPosts) {
    if (!post || post.is_published !== true) continue
    if (typeof post.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) continue

    const cleanSlug = post.slug.trim().replace(/^\/+|\/+$/g, '')
    if (!cleanSlug) continue

    // Exclude any disallowed or internal paths
    if (DISALLOWED_ROUTE_PATTERN.test(cleanSlug)) continue

    const postLoc = `${CANONICAL_ORIGIN}/blog/${encodeURIComponent(cleanSlug)}`
    const postLastmod = post.updated_at || post.published_at
    addUrl(postLoc, postLastmod)
  }

  const xml = buildSitemapXmlString(entries)

  // Store in in-memory cache
  inMemoryCache = {
    xml,
    expiresAt: now + CACHE_TTL_MS,
  }

  return xml
}

/**
 * Vercel Serverless Function HTTP handler.
 */
export default async function handler(req, res, { supabaseClient = null } = {}) {
  const method = req.method ? req.method.toUpperCase() : 'GET'
  if (method !== 'GET' && method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    res.statusCode = 405
    if (typeof res.end === 'function') {
      res.end('Method Not Allowed')
    }
    return
  }

  try {
    const xml = await generateSitemapXml({ supabaseClient, forceFresh: Boolean(supabaseClient) })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (method === 'HEAD') {
      res.setHeader('Content-Length', Buffer.byteLength(xml, 'utf8'))
      if (typeof res.end === 'function') res.end()
      return
    }

    if (typeof res.send === 'function') {
      res.send(xml)
    } else if (typeof res.end === 'function') {
      res.end(xml)
    }
  } catch (err) {
    console.error('[Sitemap Handler Error]', err)

    res.statusCode = 503
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    if (typeof res.end === 'function') res.end('Sitemap is temporarily unavailable.')
  }
}
