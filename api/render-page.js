import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { renderSeoHead, normalizeRoutePath } from '../src/data/seoMetadata.js'
import { fallbackContent } from '../src/data/initialContent.js'
import { siteContentDefaults } from '../src/data/siteContentDefaults.js'
import { getBlogImageForCategory, normalizeBlogImageUrl } from '../src/data/blogImageUtils.js'
import { marketplaceServiceDefaults, mergeMarketplaceServiceRows } from '../src/data/marketplaceServiceContent.js'

const SITE_ORIGIN = 'https://ecomxtra.in'
const PAGE_SIZE = 6
const KNOWN_ROUTES = new Set([
  '/',
  '/philosophy',
  '/showcase',
  '/services',
  '/blog',
  '/testimonials',
  '/contact',
  '/admin',
])
const FALLBACK_SITE_CONTENT = siteContentDefaults

function response(res, status, body, contentType = 'text/plain; charset=utf-8', cacheControl) {
  res.statusCode = status
  res.setHeader('Content-Type', contentType)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', cacheControl || (status === 200
    ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    : 'no-store'))
  res.end(body)
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Server-side Supabase credentials are not configured.')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
    global: {
      fetch: (input, init = {}) => fetch(input, {
        ...init,
        signal: init.signal || AbortSignal.timeout(5000),
      }),
    },
  })
}

function mapPost(post) {
  const coverImage = normalizeBlogImageUrl(post.cover_image, post.category)
  const fallbackImage = getBlogImageForCategory(post.category)
  return {
    ...post,
    authorRole: post.author_role || '',
    readTime: post.read_time || '',
    coverImage,
    seoTitle: post.seo_title || '',
    metaDescription: post.meta_description || '',
    image_metadata: {
      ...post.image_metadata,
      alt: post.image_metadata?.provider === 'Unsplash'
        ? post.image_metadata.alt || fallbackImage.alt
        : fallbackImage.alt,
    },
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
  }
}

async function getInitialData(pathname, searchParams, injectedSupabaseClient) {
  const supabase = injectedSupabaseClient || getSupabaseClient()
  const initialData = {
    siteContent: FALLBACK_SITE_CONTENT,
    services: fallbackContent.services,
    showcases: fallbackContent.showcases,
    testimonials: fallbackContent.testimonials,
  }

  const { data: publicSiteContent, error: siteContentError } = await supabase
    .from('site_content')
    .select('content_key, content, is_public, display_order, updated_at')
    .eq('is_public', true)
    .order('display_order', { ascending: true })
  if (siteContentError) throw siteContentError
  if (publicSiteContent?.length) initialData.siteContent = publicSiteContent

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/)
  if (serviceMatch) {
    const serviceSlug = decodeURIComponent(serviceMatch[1])
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', serviceSlug)
      .maybeSingle()
    if (error) throw error
    const serviceContent = service
      || marketplaceServiceDefaults.find(item => item.slug === serviceSlug)
    if (!serviceContent) return { notFound: true }
    initialData.services = mergeMarketplaceServiceRows(service ? [service] : [])
    return { initialData, service: serviceContent }
  }

  const tablesByPage = {
    '/': ['services', 'showcases', 'testimonials'],
    '/services': ['services'],
    '/showcase': ['showcases'],
    '/testimonials': ['testimonials'],
  }
  for (const table of tablesByPage[pathname] || []) {
    const isPaginated = table === 'testimonials'
    let query = supabase
      .from(table)
      .select('*', isPaginated ? { count: 'exact' } : undefined)
      .order('created_at', { ascending: true })
    if (isPaginated) query = query.range(0, PAGE_SIZE - 1)
    const { data, error, count } = await query
    if (error) throw error
    const rows = data || []
    if (table === 'services') initialData.services = mergeMarketplaceServiceRows(rows)
    if (table === 'showcases') {
      initialData.showcases = rows.length
        ? rows.map(({ showcase_key, ...row }) => ({ ...row, key: showcase_key }))
        : fallbackContent.showcases
    }
    if (table === 'testimonials') {
      initialData.testimonials = rows.length ? rows : fallbackContent.testimonials
      initialData.testimonialsCount = count || 0
    }
  }

  if (pathname === '/blog') {
    const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10)
    const page = Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage - 1, 10000)
      : 0
    const start = page * PAGE_SIZE
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1)
    if (error) throw error
    initialData.blogs = (data || []).map(mapPost)
    initialData.blogPage = page
    initialData.blogCount = count || 0
    return { initialData }
  }

  if (pathname.startsWith('/blog/')) {
    const requestedSlug = decodeURIComponent(pathname.slice('/blog/'.length))
    if (!requestedSlug || requestedSlug.includes('/')) return { notFound: true }
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', requestedSlug)
      .eq('is_published', true)
      .maybeSingle()
    if (error) throw error
    if (!post && (/^\d+$/.test(requestedSlug) || /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(requestedSlug))) {
      const idLookup = await supabase
        .from('blog_posts')
        .select('id, slug')
        .eq('id', requestedSlug)
        .eq('is_published', true)
        .maybeSingle()
      if (idLookup.error) throw idLookup.error
      if (idLookup.data?.slug) {
        return { redirectUrl: `${SITE_ORIGIN}/blog/${encodeURIComponent(idLookup.data.slug)}` }
      }
    }
    if (!post) return { notFound: true }
    const { data: relatedPosts, error: relatedError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(3)
    if (relatedError) throw relatedError
    initialData.blogPostDetail = mapPost(post)
    initialData.blogs = (relatedPosts || []).map(mapPost)
    return { initialData, blog: initialData.blogPostDetail }
  }

  return { initialData }
}

function withSeoHead(html, pathname, blog, service) {
  const seoHead = renderSeoHead(pathname, blog, service)
  return html.replace(
    /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/,
    `<!-- SEO_META_START -->\n    ${seoHead}\n    <!-- SEO_META_END -->`,
  )
}

function safelySerialize(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

function initialDataScript(initialData) {
  return `<script>window.__ECOMXTRA_INITIAL_DATA__=${safelySerialize(initialData)};window.__ECOMXTRA_SSR__=true</script>`
}

export default async function handler(req, res, { supabaseClient = null } = {}) {
  if (!['GET', 'HEAD'].includes((req.method || 'GET').toUpperCase())) {
    res.setHeader('Allow', 'GET, HEAD')
    response(res, 405, 'Method Not Allowed')
    return
  }

  try {
    const requestUrl = new URL(req.url || '/', SITE_ORIGIN)
    const rawPath = requestUrl.searchParams.get('path') || '/'
    const pathname = normalizeRoutePath(rawPath)
    const routePath = pathname === '/blogs' ? '/blog'
      : pathname === '/about' ? '/philosophy'
        : pathname === '/service' ? '/services'
          : pathname

    if (rawPath !== pathname || pathname !== routePath) {
      const redirectParams = new URLSearchParams(requestUrl.searchParams)
      redirectParams.delete('path')
      const search = redirectParams.toString()
      res.statusCode = 308
      res.setHeader('Location', `${SITE_ORIGIN}${routePath}${search ? `?${search}` : ''}`)
      res.end()
      return
    }

    const isArticle = pathname.startsWith('/blog/')
    const isServicePage = /^\/services\/[^/]+$/.test(pathname)
    if (!KNOWN_ROUTES.has(pathname) && !isArticle && !isServicePage) {
      const { renderPage } = await import('../dist/server/entry-server.js')
      const html = await readFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8')
      const initialData = { siteContent: FALLBACK_SITE_CONTENT }
      const body = renderPage(pathname, initialData)
      const rendered = withSeoHead(html, pathname, null)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
        .replace('</head>', `${initialDataScript(initialData)}\n  </head>`)
      response(res, 404, req.method === 'HEAD' ? '' : rendered, 'text/html; charset=utf-8')
      return
    }

    if (pathname === '/admin') {
      const html = await readFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8')
      response(res, 200, req.method === 'HEAD' ? '' : html, 'text/html; charset=utf-8')
      return
    }

    let pageData
    try {
      pageData = await getInitialData(routePath, requestUrl.searchParams, supabaseClient)
    } catch (error) {
      console.error('[Page render content lookup failed]', error)
      response(res, 503, 'Page content is temporarily unavailable.')
      return
    }

    if (pageData.redirectUrl) {
      res.statusCode = 308
      res.setHeader('Location', pageData.redirectUrl)
      res.setHeader('Cache-Control', 'public, max-age=3600')
      res.end()
      return
    }

    if (pageData.notFound) {
      const { renderPage } = await import('../dist/server/entry-server.js')
      const html = await readFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8')
      const initialData = { siteContent: FALLBACK_SITE_CONTENT }
      const body = renderPage(pathname, initialData)
      const rendered = withSeoHead(html, pathname, null)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
        .replace('</head>', `${initialDataScript(initialData)}\n  </head>`)
      response(res, 404, req.method === 'HEAD' ? '' : rendered, 'text/html; charset=utf-8')
      return
    }

    const { renderPage } = await import('../dist/server/entry-server.js')
    const html = await readFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8')
    const browserSearchParams = new URLSearchParams(requestUrl.searchParams)
    browserSearchParams.delete('path')
    const browserSearch = browserSearchParams.toString()
    const body = renderPage(`${routePath}${browserSearch ? `?${browserSearch}` : ''}`, pageData.initialData)
    const rendered = withSeoHead(html, routePath, pageData.blog, pageData.service)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace('</head>', `${initialDataScript(pageData.initialData)}\n  </head>`)

    response(
      res,
      200,
      req.method === 'HEAD' ? '' : rendered,
      'text/html; charset=utf-8',
      isArticle ? 'no-store' : 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    )
  } catch (error) {
    console.error('[SSR page handler failed]', error)
    response(res, 500, 'Page rendering failed.')
  }
}
