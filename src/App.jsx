import { useState, useEffect } from 'react'
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import PhilosophyPage from './pages/PhilosophyPage'
import ShowcasePage from './pages/ShowcasePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import { supabase } from './src/lib/supabase'
import { fallbackContent } from './data/initialContent'
import { loadCachedContent } from './data/contentCache'
import { siteContentDefaults } from './data/siteContentDefaults'
import { getRouteMetadata, getStructuredData } from './data/seoMetadata'
import { getBlogImageForCategory, normalizeBlogImageUrl } from './data/blogImageUtils'
import { marketplaceServiceDefaults, mergeMarketplaceServiceRows } from './data/marketplaceServiceContent'

const PAGE_SIZE = 6

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const publicContentTables = {
  services: { orderBy: 'created_at' },
  showcases: { orderBy: 'created_at' },
  testimonials: { orderBy: 'created_at' },
  blog_posts: { orderBy: 'published_at', publishedOnly: true },
}

function requestPublicContent(table, page = 0) {
  const { orderBy, publishedOnly } = publicContentTables[table]
  const isPaginated = table === 'blog_posts' || table === 'testimonials'
  const cacheKey = `public:${table}:${isPaginated ? page : 'all'}`
  return loadCachedContent(cacheKey, async () => {
    let query = supabase.from(table).select('*', isPaginated ? { count: 'exact' } : undefined)
    if (publishedOnly) query = query.eq('is_published', true)
    if (isPaginated) {
      const start = page * PAGE_SIZE
      query = query.range(start, start + PAGE_SIZE - 1)
    }
    const { data, error, count } = await query.order(orderBy, { ascending: table !== 'blog_posts' })
    if (error) throw error
    return { rows: data || [], count: isPaginated ? (count || 0) : (data?.length || 0) }
  })
}

function requestPublicBlogPost(slug) {
  return loadCachedContent(`public:blog-post:${slug}`, async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
    if (error) throw error
    if (data) return { post: data }

    const { data: postById, error: idError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', slug)
      .eq('is_published', true)
      .maybeSingle()
    if (idError) throw idError
    return { post: postById }
  })
}

function mapPublicBlogPost(post) {
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

function decodeRouteSegment(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function upsertMeta(selector, attribute, value) {
  const elements = [...document.head.querySelectorAll(selector)]
  let element = elements.shift()
  elements.forEach(duplicate => duplicate.remove())
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, selector.includes('property=') ? selector.match(/property="([^"]+)"/)[1] : selector.match(/name="([^"]+)"/)[1])
    document.head.appendChild(element)
  }
  element.content = value
}

function RouteSeo({ pathname, blog, service, siteContent }) {
  useEffect(() => {
    const metadata = getRouteMetadata(pathname, blog, service)
    const homeSeo = pathname === '/'
      ? siteContent.find(section => section.content_key === 'seo')?.content
      : null
    const title = homeSeo?.title || metadata.title
    const description = homeSeo?.description || metadata.description
    let socialImage = metadata.image
    if (homeSeo?.socialImage) {
      try {
        const imageUrl = new URL(homeSeo.socialImage, 'https://ecomxtra.in')
        if (imageUrl.protocol === 'https:') socialImage = imageUrl.href
      } catch {
        socialImage = metadata.image
      }
    }

    document.title = title
    upsertMeta('meta[name="description"]', 'name', description)
    upsertMeta('meta[name="robots"]', 'name', metadata.robots)
    upsertMeta('meta[property="og:type"]', 'property', metadata.type)
    upsertMeta('meta[property="og:title"]', 'property', title)
    upsertMeta('meta[property="og:description"]', 'property', description)
    upsertMeta('meta[property="og:url"]', 'property', metadata.canonicalUrl || 'https://ecomxtra.in')
    upsertMeta('meta[property="og:image"]', 'property', socialImage)
    upsertMeta('meta[name="twitter:card"]', 'name', 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'name', title)
    upsertMeta('meta[name="twitter:description"]', 'name', description)
    upsertMeta('meta[name="twitter:image"]', 'name', socialImage)

    const canonicalLinks = [...document.head.querySelectorAll('link[rel="canonical"]')]
    canonicalLinks.slice(1).forEach(link => link.remove())
    if (metadata.canonicalUrl) {
      const canonical = canonicalLinks[0] || document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = metadata.canonicalUrl
      if (!canonical.isConnected) document.head.appendChild(canonical)
    } else {
      canonicalLinks.forEach(link => link.remove())
    }

    document.head.querySelectorAll('script[id^="structured-data-"]').forEach(script => script.remove())
    getStructuredData(pathname, blog, service).forEach((data, index) => {
      const script = document.createElement('script')
      script.id = `structured-data-${index}`
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data).replace(/</g, '\\u003c')
      document.head.appendChild(script)
    })
  }, [pathname, blog, service, siteContent])

  return null
}

function App({ initialData = {} }) {
  const [services, setServices] = useState(() => initialData.services || fallbackContent.services)
  const [showcases, setShowcases] = useState(() => initialData.showcases || fallbackContent.showcases)
  const [testimonials, setTestimonials] = useState(() => initialData.testimonials || fallbackContent.testimonials)
  const [blogs, setBlogs] = useState(() => initialData.blogs || [])
  const [blogPostDetail, setBlogPostDetail] = useState(() => initialData.blogPostDetail || null)
  const [resolvedBlogPostSlug, setResolvedBlogPostSlug] = useState(() => initialData.blogPostDetail?.slug || null)
  const [blogCount, setBlogCount] = useState(() => initialData.blogCount || 0)
  const [testimonialsPage, setTestimonialsPage] = useState(0)
  const [testimonialsCount, setTestimonialsCount] = useState(() => initialData.testimonialsCount || 0)
  const [contentLoadError, setContentLoadError] = useState(false)
  const [siteContent, setSiteContent] = useState(() => initialData.siteContent || siteContentDefaults)
  const [siteContentLoaded, setSiteContentLoaded] = useState(() => Boolean(initialData.siteContent))
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const requestedPage = Number.parseInt(new URLSearchParams(search).get('page') || '1', 10)
  const blogPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage - 1 : 0
  const setBlogPage = page => navigate(page > 0 ? `/blog?page=${page + 1}` : '/blog')
  const requestedBlogPostSlug = pathname.match(/^\/blog\/([^/]+)$/)?.[1]
  const requestedServiceSlug = pathname.match(/^\/services\/([^/]+)$/)?.[1]
  const decodedBlogPostSlug = requestedBlogPostSlug ? decodeRouteSegment(requestedBlogPostSlug) : null
  const currentBlogPostDetail = blogPostDetail
    && (blogPostDetail.slug === decodedBlogPostSlug || String(blogPostDetail.id) === decodedBlogPostSlug)
    ? blogPostDetail
    : null
  const blogPostLoading = Boolean(decodedBlogPostSlug)
    && resolvedBlogPostSlug !== decodedBlogPostSlug

  useEffect(() => {
    let active = true
    loadCachedContent('public:site-content', async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_key, content, is_public, display_order, updated_at')
        .eq('is_public', true)
        .order('display_order', { ascending: true })
      if (error) throw error
      return data || []
    }).then(rows => {
      if (active) {
        setSiteContent(rows)
        setSiteContentLoaded(true)
      }
    }).catch(() => {
      if (active) {
        setContentLoadError(true)
        setSiteContentLoaded(true)
      }
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    const blogPostSlug = requestedBlogPostSlug
    const requiredTables = pathname === '/'
      ? ['services', 'showcases', 'testimonials']
      : pathname === '/services' || requestedServiceSlug
        ? ['services']
        : pathname === '/showcase'
          ? ['showcases']
          : pathname === '/testimonials'
            ? ['testimonials']
            : pathname === '/blog'
              ? ['blog_posts']
              : []
    const contentRequests = requiredTables.map(async table => {
      const page = table === 'blog_posts' ? blogPage : table === 'testimonials' ? testimonialsPage : 0
      return [table, await requestPublicContent(table, page)]
    })
    if (blogPostSlug) {
      contentRequests.push(requestPublicBlogPost(decodeRouteSegment(blogPostSlug)).then(result => ['blog_post_detail', result]))
    }

    Promise.all(contentRequests)
      .then(results => {
        if (!active) return
        setContentLoadError(false)
        if (!blogPostSlug) setBlogPostDetail(null)
        for (const [table, result] of results) {
          if (table === 'blog_post_detail') {
            setBlogPostDetail(result.post ? mapPublicBlogPost(result.post) : null)
            setResolvedBlogPostSlug(decodeRouteSegment(blogPostSlug))
            continue
          }
          const { rows, count } = result
          if (table === 'services') setServices(mergeMarketplaceServiceRows(rows))
          if (table === 'showcases') setShowcases(rows.length
            ? rows.map(({ showcase_key, ...row }) => ({ ...row, key: showcase_key }))
            : fallbackContent.showcases)
          if (table === 'testimonials') {
            setTestimonials(rows.length ? rows : (testimonialsPage === 0 ? fallbackContent.testimonials : []))
            setTestimonialsCount(count)
          }
          if (table === 'blog_posts') {
            setBlogs(rows.map(mapPublicBlogPost))
            setBlogCount(count)
          }
        }
      })
      .catch(() => {
        if (active) {
          setContentLoadError(true)
          if (blogPostSlug) {
            setBlogPostDetail(null)
            setResolvedBlogPostSlug(decodeRouteSegment(blogPostSlug))
          }
          if (requiredTables.includes('blog_posts')) setBlogs([])
        }
      })

    return () => {
      active = false
    }
  }, [pathname, requestedBlogPostSlug, requestedServiceSlug, blogPage, testimonialsPage, search])

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-[#faf8ff] text-slate-900 font-outfit">
      <ScrollToTop />
      <RouteSeo
        pathname={pathname}
        blog={currentBlogPostDetail}
        service={services.find(item => item.slug === requestedServiceSlug)
          || marketplaceServiceDefaults.find(item => item.slug === requestedServiceSlug)}
        siteContent={siteContent}
      />
      {/* Colourful ambient glowing blobs + subtle mesh (fixed, overflow-hidden so they don't affect layout) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="softly-grain-overlay" />
        <div className="absolute top-[5%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-pink-400/25 to-violet-500/25 blur-[120px] animate-float" />
        <div className="absolute top-[45%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-violet-400/25 to-cyan-400/25 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[65%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-400/20 blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar content={siteContent.find(section => section.content_key === 'footer')?.content} />
      {contentLoadError && (
        <div role="alert" className="relative z-10 bg-red-950 px-6 py-3 text-center text-sm text-red-100">
          Some website content could not be loaded. Please try again later.
        </div>
      )}

      <main className="relative z-10 flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                showcases={showcases}
                services={services}
                testimonials={testimonials}
                siteContent={siteContent}
              />
            }
          />
          <Route path="/philosophy" element={<PhilosophyPage siteContent={siteContent} />} />
          <Route path="/showcase" element={<ShowcasePage showcases={showcases} siteContent={siteContent} />} />
          <Route path="/services" element={<ServicesPage services={services} />} />
          <Route
            path="/services/:slug"
            element={(
              <ServiceDetailPage
                service={services.find(item => item.slug === requestedServiceSlug)
                  || marketplaceServiceDefaults.find(item => item.slug === requestedServiceSlug)}
              />
            )}
          />
          <Route path="/blog" element={<BlogPage blogs={blogs} page={blogPage} pageSize={PAGE_SIZE} totalCount={blogCount} onPageChange={setBlogPage} />} />
          <Route path="/about" element={<Navigate to={`/philosophy${search}`} replace />} />
          <Route path="/service" element={<Navigate to={`/services${search}`} replace />} />
          <Route path="/blogs" element={<Navigate to={`/blog${search}`} replace />} />
          <Route
            path="/blog/:id"
            element={(
              <BlogPostPage
                blogs={currentBlogPostDetail ? [currentBlogPostDetail] : []}
                relatedArticles={blogs}
                isLoading={blogPostLoading}
              />
            )}
          />
          <Route path="/testimonials" element={<TestimonialsPage testimonials={testimonials} page={testimonialsPage} pageSize={PAGE_SIZE} totalCount={testimonialsCount} onPageChange={setTestimonialsPage} />} />
          <Route
            path="/contact"
            element={
              <ContactPage />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {(!siteContentLoaded || siteContent.some(section => section.content_key === 'footer')) && (
        <div className="relative z-10">
          <Footer content={siteContent.find(section => section.content_key === 'footer')?.content} />
        </div>
      )}
      <Chatbot />
    </div>
  )
}

function NotFoundPage() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h1>
      <p className="text-sm text-slate-500">The page you requested could not be found.</p>
    </section>
  )
}

export default App
