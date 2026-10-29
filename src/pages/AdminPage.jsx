import { useState, useEffect, useRef, useCallback } from 'react'
import { ExternalLink, X, Trash2, Edit, Check, List, BookOpen, LayoutTemplate, Zap, RefreshCw, CheckCircle2, AlertCircle, Clock, Menu } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { supabase } from '../src/lib/supabase'
import { initialContent } from '../data/initialContent'
import { invalidateCachedContent, loadCachedContent, updateCachedContent } from '../data/contentCache'
import { siteContentDefaults } from '../data/siteContentDefaults'
import WebsiteContentEditor from '../components/WebsiteContentEditor'
import BlogEditorFields from '../components/BlogEditorFields'
import ServicePageEditor from '../components/ServicePageEditor'
import { validateBlogPost } from '../data/blogPostUtils'
import { getServicePageDetails } from '../data/marketplaceServiceContent'

const PAGE_SIZE = 6
const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000
const ADMIN_ACTIVITY_STORAGE_KEY = 'ecomxtra-admin-last-activity'

function getAdminActivityKey(userId) {
  return `${ADMIN_ACTIVITY_STORAGE_KEY}:${userId}`
}

function serviceSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapBlogPost(post) {
  return {
    ...post,
    authorRole: post.author_role || '',
    readTime: post.read_time || '',
    coverImage: post.cover_image || '',
    seoTitle: post.seo_title || '',
    metaDescription: post.meta_description || '',
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
  }
}

function toBlogPost(blog) {
  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : (blog.tags || '').split(',').map(tag => tag.trim()).filter(Boolean)
  const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return {
    slug,
    title: blog.title,
    category: blog.category,
    author: blog.author,
    author_role: blog.authorRole || null,
    read_time: blog.readTime || null,
    cover_image: blog.coverImage || null,
    seo_title: blog.seoTitle?.trim() || null,
    meta_description: blog.metaDescription?.trim() || null,
    tags,
    excerpt: blog.excerpt,
    content: blog.content,
    published_at: blog.published_at || (blog.date ? new Date(blog.date).toISOString() : new Date().toISOString()),
    is_published: blog.is_published ?? false,
    updated_at: new Date().toISOString(),
  }
}

const adminTableConfig = {
  services: {
    orderBy: 'created_at',
    seed: initialContent.services.map(({ title, description, category, slug, details }) => ({
      title, description, category, slug, details,
    })),
  },
  showcases: {
    orderBy: 'created_at',
    seed: initialContent.showcases.map(({ key, title, metric, description, link }) => ({
      showcase_key: key, title, metric, description, link,
    })),
  },
  testimonials: {
    orderBy: 'created_at',
    paginated: true,
    seed: initialContent.testimonials.map(({ author, company, text }) => ({ author, company, text })),
  },
  blog_posts: {
    orderBy: 'published_at',
    orderBy: 'created_at',
    ascending: false,
    seed: initialContent.blogs.map(blog => toBlogPost({ ...blog, is_published: true })),
  },
}

function requestAdminContent(table, page = 0) {
  const { orderBy, ascending = true, paginated, seed } = adminTableConfig[table]
  const cacheKey = `admin:${table}:${paginated ? page : 'all'}`
  return loadCachedContent(cacheKey, async () => {
    let query = supabase.from(table).select('*', paginated ? { count: 'exact' } : undefined)
    if (paginated) {
      const start = page * PAGE_SIZE
      query = query.range(start, start + PAGE_SIZE - 1)
    }
    query = query.order(orderBy, { ascending })
    if (table === 'blog_posts') query = query.order('published_at', { ascending: false })
    const { data, error, count } = await query
    if (error) throw error
    if (data?.length || (count ?? data?.length ?? 0) > 0) {
      return { rows: data || [], count: count ?? data?.length ?? 0 }
    }

    const { data: seededRows, error: seedError } = await supabase.from(table).insert(seed).select()
    if (seedError) throw seedError
    invalidateCachedContent(`public:${table}:`)
    return { rows: seededRows || [], count: seededRows?.length || 0 }
  })
}

function invalidateContentForTable(table, loadedPagesRef) {
  invalidateCachedContent(`admin:${table}:`)
  invalidateCachedContent(`public:${table}:`)
  if (table === 'blog_posts') invalidateCachedContent('public:blog-post:')
  for (const key of loadedPagesRef.current) {
    if (key.startsWith(`${table}:`)) loadedPagesRef.current.delete(key)
  }
}

let initialUserVerification
let initialUserAccessToken

function verifyInitialUser(accessToken) {
  if (!initialUserVerification || initialUserAccessToken !== accessToken) {
    initialUserAccessToken = accessToken
    initialUserVerification = supabase.auth.getUser(accessToken)
  }
  return initialUserVerification
}

// ── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, error, loading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 relative overflow-hidden font-satoshi">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#f2f2f2 1px, transparent 1px),
            linear-gradient(90deg, #f2f2f2 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Top bar accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#f2f2f2]/60 to-transparent mb-0" />

        <div className="border border-[#f2f2f2]/15 bg-[#1a1a1a]/80 backdrop-blur-xl p-10">
          {/* Header */}
          <div className="mb-10 text-center">
            {/* Logo image & Lock icon */}
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 p-1 border border-[#f2f2f2]/20 bg-[#111111] shadow-lg">
              <img src="/logo.png" alt="EcomXtra" className="w-full h-full object-contain" />
            </div>

            <span className="font-clash text-[10px] font-black tracking-[0.35em] uppercase text-[#f2f2f2]/40 block mb-3">
              RESTRICTED ACCESS
            </span>
            <h1 className="font-clash text-3xl font-bold text-[#f2f2f2] tracking-tight">
              ECOMXTRA
            </h1>
            <p className="font-satoshi text-xs text-[#f2f2f2]/40 mt-1 tracking-widest uppercase">
              Control Hub · Admin Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/50 mb-2">
                EMAIL
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-[#111111] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-3.5 placeholder-[#f2f2f2]/20 focus:outline-none focus:border-[#f2f2f2]/50 transition-colors duration-200 font-satoshi tracking-wide"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/50 mb-2">
                PASSWORD
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#111111] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-3.5 placeholder-[#f2f2f2]/20 focus:outline-none focus:border-[#f2f2f2]/50 transition-colors duration-200 font-satoshi tracking-wide"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/5 p-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span className="text-red-400 text-[10px] font-black tracking-wider uppercase">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#f2f2f2] text-[#111111] font-clash font-black text-xs tracking-[0.25em] uppercase border border-[#f2f2f2] hover:bg-[#111111] hover:text-[#f2f2f2] transition-all duration-300 mt-2"
            >
              {loading ? 'AUTHENTICATING…' : 'SIGN IN'}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#f2f2f2]/8 text-center">
            <p className="text-[10px] text-[#f2f2f2]/20 tracking-widest uppercase">
              A{' '}
              <a href="https://quadranex-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                Quadranex IT Solutions
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>{' '}
              System · Restricted
            </p>
          </div>
        </div>

        {/* Bottom bar accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#f2f2f2]/20 to-transparent mt-0" />
      </div>

    </div>
  )
}

// ── Admin Dashboard (post-login) ────────────────────────────────────────────
function AdminDashboard({ onLogout, authError, session }) {
  const [services, setServices] = useState([])
  const [showcases, setShowcases] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])
  const [siteContent, setSiteContent] = useState(siteContentDefaults)
  const [testimonialCount, setTestimonialCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)
  const loadedPagesRef = useRef(new Set())
  const [loadingCount, setLoadingCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const savingRef = useRef(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadContent = useCallback(async (table, page = 0) => {
    if (table === 'site_content') {
      if (loadedPagesRef.current.has('site_content:all')) return
      setLoadingCount(count => count + 1)
      setErrorMessage('')
      try {
        const rows = await loadCachedContent('admin:site_content:all', async () => {
          const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .order('display_order', { ascending: true })
          if (error) throw error
          const rowsByKey = new Map((data || []).map(row => [row.content_key, row]))
          return siteContentDefaults.map(defaultRow => rowsByKey.get(defaultRow.content_key) || defaultRow)
        })
        setSiteContent(rows)
        loadedPagesRef.current.add('site_content:all')
      } catch (loadError) {
        setErrorMessage(`Unable to load website content: ${loadError.message}`)
      } finally {
        setLoadingCount(count => Math.max(0, count - 1))
      }
      return
    }

    const pageKey = `${table}:${adminTableConfig[table].paginated ? page : 'all'}`
    if (loadedPagesRef.current.has(pageKey)) return
    setLoadingCount(count => count + 1)
    setErrorMessage('')
    try {
      const { rows, count } = await requestAdminContent(table, page)
      if (table === 'services') setServices(rows)
      if (table === 'showcases') setShowcases(rows.map(({ showcase_key, ...row }) => ({ ...row, key: showcase_key })))
      if (table === 'testimonials') {
        setTestimonials(rows)
        setTestimonialCount(count)
      }
      if (table === 'blog_posts') {
        setBlogs(rows.map(mapBlogPost))
        setBlogCount(count)
      }
      loadedPagesRef.current.add(pageKey)
    } catch (loadError) {
      setErrorMessage(`Unable to load ${table.replace('_', ' ')}: ${loadError.message}`)
    } finally {
      setLoadingCount(count => Math.max(0, count - 1))
    }
  }, [])

  const runCrud = async (operation, successText) => {
    if (savingRef.current) return false
    savingRef.current = true
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      await operation()
      setSuccessMessage(successText)
      return true
    } catch (operationError) {
      setErrorMessage(`Unable to save changes: ${operationError.message}`)
      return false
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  const handleCRUD = {
    saveSiteContent: section => runCrud(async () => {
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          content_key: section.content_key,
          content: section.content,
          is_public: section.is_public,
          display_order: section.display_order,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'content_key' })
        .select()
        .single()
      if (error) throw error
      const next = siteContent.map(item => item.content_key === data.content_key ? data : item)
      if (!siteContent.some(item => item.content_key === data.content_key)) next.push(data)
      next.sort((left, right) => left.display_order - right.display_order)
      setSiteContent(next)
      updateCachedContent('admin:site_content:all', () => next)
      invalidateCachedContent('public:site-content')
    }, 'Website section saved.'),
    addService: (service) => runCrud(async () => {
      const fields = {
        ...service,
        slug: serviceSlug(service.slug || service.title),
        details: service.details || {},
      }
      const { data, error } = await supabase.from('services').insert(fields).select().single()
      if (error) throw error
      invalidateContentForTable('services', loadedPagesRef)
      setServices(current => [...current, data])
    }, 'Service created.'),
    updateService: (id, service) => runCrud(async () => {
      const fields = {
        title: service.title,
        description: service.description,
        category: service.category,
        slug: serviceSlug(service.slug || service.title),
        details: service.details || {},
      }
      const { data, error } = await supabase.from('services').update(fields).eq('id', id).select().single()
      if (error) throw error
      invalidateContentForTable('services', loadedPagesRef)
      setServices(current => current.map(item => item.id === id ? data : item))
    }, 'Service updated.'),
    deleteService: (id) => runCrud(async () => {
      const { error } = await supabase.from('services').delete().eq('id', id).select('id').single()
      if (error) throw error
      invalidateContentForTable('services', loadedPagesRef)
      setServices(current => current.filter(item => item.id !== id))
    }, 'Service deleted.'),

    addShowcase: (showcase) => runCrud(async () => {
      const { key, ...fields } = showcase
      const { data, error } = await supabase.from('showcases').insert({ ...fields, showcase_key: key }).select().single()
      if (error) throw error
      invalidateContentForTable('showcases', loadedPagesRef)
      const { showcase_key, ...row } = data
      setShowcases(current => [...current, { ...row, key: showcase_key }])
    }, 'Case study created.'),
    updateShowcase: (id, showcase) => runCrud(async () => {
      const { key } = showcase
      const fields = { title: showcase.title, metric: showcase.metric, description: showcase.description, link: showcase.link }
      const { data, error } = await supabase.from('showcases').update({ ...fields, showcase_key: key }).eq('id', id).select().single()
      if (error) throw error
      invalidateContentForTable('showcases', loadedPagesRef)
      const { showcase_key, ...row } = data
      setShowcases(current => current.map(item => item.id === id ? { ...row, key: showcase_key } : item))
    }, 'Case study updated.'),
    deleteShowcase: (id) => runCrud(async () => {
      const { error } = await supabase.from('showcases').delete().eq('id', id).select('id').single()
      if (error) throw error
      invalidateContentForTable('showcases', loadedPagesRef)
      setShowcases(current => current.filter(item => item.id !== id))
    }, 'Case study deleted.'),

    addTestimonial: (testimonial) => runCrud(async () => {
      const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single()
      if (error) throw error
      invalidateContentForTable('testimonials', loadedPagesRef)
      setTestimonialCount(count => count + 1)
      setTestimonials(current => (
        current.length < PAGE_SIZE && current.length === testimonialCount % PAGE_SIZE
          ? [...current, data]
          : current
      ))
    }, 'Testimonial created.'),
    updateTestimonial: (id, testimonial) => runCrud(async () => {
      const fields = { author: testimonial.author, company: testimonial.company, text: testimonial.text }
      const { data, error } = await supabase.from('testimonials').update(fields).eq('id', id).select().single()
      if (error) throw error
      invalidateContentForTable('testimonials', loadedPagesRef)
      setTestimonials(current => current.map(item => item.id === id ? data : item))
    }, 'Testimonial updated.'),
    deleteTestimonial: (id) => runCrud(async () => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id).select('id').single()
      if (error) throw error
      invalidateContentForTable('testimonials', loadedPagesRef)
      setTestimonialCount(count => Math.max(0, count - 1))
      setTestimonials(current => current.filter(item => item.id !== id))
    }, 'Testimonial deleted.'),

    addBlog: (blog) => runCrud(async () => {
      const post = toBlogPost(blog)
      const { data: duplicate, error: duplicateError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .limit(1)
        .maybeSingle()
      if (duplicateError) throw duplicateError
      if (duplicate) throw new Error('That URL slug is already in use. Choose a different slug.')
      const { data, error } = await supabase.from('blog_posts').insert(post).select().single()
      if (error?.code === '23505') throw new Error('That URL slug is already in use. Choose a different slug.')
      if (error) throw error
      invalidateContentForTable('blog_posts', loadedPagesRef)
      setBlogCount(count => count + 1)
      setBlogs(current => [mapBlogPost(data), ...current].slice(0, PAGE_SIZE))
    }, 'Blog post created.'),
    updateBlog: (id, blog) => runCrud(async () => {
      const post = toBlogPost(blog)
      const { data: duplicate, error: duplicateError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .neq('id', id)
        .limit(1)
        .maybeSingle()
      if (duplicateError) throw duplicateError
      if (duplicate) throw new Error('That URL slug is already in use. Choose a different slug.')
      const existingPost = blogs.find(item => item.id === id)
      if (!existingPost?.is_published && post.is_published) {
        post.published_at = new Date().toISOString()
      }
      const { data, error } = await supabase.from('blog_posts').update(post).eq('id', id).select().single()
      if (error?.code === '23505') throw new Error('That URL slug is already in use. Choose a different slug.')
      if (error) throw error
      invalidateContentForTable('blog_posts', loadedPagesRef)
      setBlogs(current => current.map(item => item.id === id ? mapBlogPost(data) : item))
    }, 'Blog post updated.'),
    deleteBlog: (id) => runCrud(async () => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id).select('id').single()
      if (error) throw error
      invalidateContentForTable('blog_posts', loadedPagesRef)
      setBlogCount(count => Math.max(0, count - 1))
      setBlogs(current => current.filter(item => item.id !== id))
    }, 'Blog post deleted.'),
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] font-satoshi">
      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#f2f2f2]/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 text-[#f2f2f2]/40 hover:text-[#f2f2f2] transition-colors"
            onClick={() => {
              // Dispatch a custom event that AdminConsoleInline listens to
              window.dispatchEvent(new CustomEvent('admin-toggle-sidebar'))
            }}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="/" title="Go to website" className="shrink-0 transition-transform hover:scale-105">
            <img src="/logo.png" alt="EcomXtra" className="w-8 h-8 rounded-full object-contain" />
          </a>
          <div>
            <span className="font-clash text-xs sm:text-sm font-black text-[#f2f2f2] tracking-widest uppercase">
              ECOMXTRA CONTROL HUB
            </span>
            <span className="font-satoshi text-[10px] text-[#f2f2f2]/40 hidden sm:block tracking-widest uppercase">
              Admin ·{' '}
              <a href="https://quadranex-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                Quadranex IT Solutions
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Back to site link */}
          <a
            href="/"
            className="hidden sm:inline-flex text-[10px] font-black tracking-widest uppercase text-[#f2f2f2]/40 hover:text-[#f2f2f2]/80 transition-colors border border-[#f2f2f2]/10 px-3 py-1.5 hover:border-[#f2f2f2]/30"
          >
            ← Back to Site
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-[10px] font-black tracking-widest uppercase bg-[#f2f2f2] text-[#111111] px-3 sm:px-4 py-1.5 hover:bg-[#f2f2f2]/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      {authError && (
        <div role="alert" className="border-b border-red-500/30 bg-red-500/5 px-6 py-3 text-xs text-red-300">
          {authError}
        </div>
      )}

      {/* Full-page admin console */}
      <div className="relative">
        <AdminConsoleInline
          services={services}
          showcases={showcases}
          testimonials={testimonials}
          blogs={blogs}
          siteContent={siteContent}
          testimonialCount={testimonialCount}
          blogCount={blogCount}
          loadContent={loadContent}
          handleCRUD={handleCRUD}
          isLoading={loadingCount > 0}
          isSaving={isSaving}
          errorMessage={errorMessage}
          successMessage={successMessage}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          session={session}
        />
      </div>
    </div>
  )
}

// ── Cron Panel ───────────────────────────────────────────────────────────────
function CronPanel({ session }) {
  const [cronStatus, setCronStatus] = useState('idle') // idle | running | success | error | already_running
  const [cronResult, setCronResult] = useState(null)
  const [cronError, setCronError]   = useState(null)
  const dismissTimer = useRef(null)

  const clearDismiss = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current)
      dismissTimer.current = null
    }
  }

  const scheduleDismiss = () => {
    clearDismiss()
    dismissTimer.current = setTimeout(() => {
      setCronStatus('idle')
      setCronResult(null)
      setCronError(null)
    }, 8000)
  }

  useEffect(() => () => clearDismiss(), [])

  const handleRun = async () => {
    if (cronStatus === 'running') return
    clearDismiss()
    setCronStatus('running')
    setCronResult(null)
    setCronError(null)

    try {
      const accessToken = session?.access_token
      if (!accessToken) throw new Error('No active session token.')

      const res = await fetch('/api/admin/trigger-cron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await res.json().catch(() => ({ ok: false, error: 'invalid_json_response' }))

      if (data.status === 'already_running') {
        setCronStatus('already_running')
        setCronResult(data)
      } else if (data.ok && data.status === 'published') {
        setCronStatus('success')
        setCronResult(data)
      } else {
        setCronStatus('error')
        setCronError(data)
      }
    } catch (err) {
      setCronStatus('error')
      setCronError({ error: err.message || 'network_error' })
    }

    scheduleDismiss()
  }

  const dismiss = () => {
    clearDismiss()
    setCronStatus('idle')
    setCronResult(null)
    setCronError(null)
  }

  const isRunning = cronStatus === 'running'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Cron Automation</h2>
        <p className="text-xs text-[#f2f2f2]/35 mt-1">Manually trigger the AI blog-generation cron job on demand.</p>
      </div>

      {/* Trigger Card */}
      <div className="border border-[#f2f2f2]/10 bg-[#141414] p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-violet-400">AI Content Engine</span>
            </div>
            <h3 className="font-clash text-lg font-bold text-[#f2f2f2] mb-1">Daily Blog Generator</h3>
            <p className="text-xs text-[#f2f2f2]/40 leading-relaxed max-w-md">
              Runs the full generation pipeline: picks a marketplace category, calls Gemini AI,
              validates the article, and publishes it to the blog. Takes up to 30 seconds.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                { label: 'Endpoint', val: '/api/cron/daily-blog' },
                { label: 'Model', val: 'Gemini Flash Lite' },
                { label: 'Max Attempts', val: '3' },
              ].map(({ label, val }) => (
                <span key={label} className="text-[9px] font-black tracking-wider uppercase border border-[#f2f2f2]/10 px-2 py-1 text-[#f2f2f2]/35">
                  {label}: <span className="text-[#f2f2f2]/60">{val}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`relative shrink-0 group flex items-center gap-2.5 px-7 py-4 font-clash font-black text-xs tracking-[0.25em] uppercase transition-all duration-300 overflow-hidden ${
              isRunning
                ? 'bg-[#f2f2f2]/10 text-[#f2f2f2]/40 cursor-not-allowed border border-[#f2f2f2]/10'
                : 'bg-violet-600 text-white border border-violet-500 hover:bg-violet-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-900/40'
            }`}
          >
            {/* Shimmer sweep on hover */}
            {!isRunning && (
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            )}
            {isRunning
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Zap className="w-4 h-4" />
            }
            {isRunning ? 'Running…' : 'Run Now'}
          </button>
        </div>

        {/* Progress bar when running */}
        {isRunning && (
          <div className="mt-6">
            <div className="h-px bg-[#f2f2f2]/8 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-violet-500 rounded-full animate-pulse"
                style={{ width: '100%', animation: 'cron-progress 2s ease-in-out infinite' }}
              />
            </div>
            <p className="text-[10px] text-[#f2f2f2]/40 mt-2 tracking-wider">
              Generating article with Gemini AI… this may take up to 30 seconds
            </p>
          </div>
        )}
      </div>

      {/* Result notification */}
      {cronStatus === 'success' && cronResult && (
        <div className="border border-green-500/30 bg-green-500/5 p-5 flex items-start gap-4 relative animate-[fadeInUp_0.3s_ease]">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black tracking-widest uppercase text-green-400 mb-1">Blog Published Successfully</p>
            <p className="text-[11px] text-green-300/80 leading-relaxed">
              <span className="font-semibold text-green-300">{cronResult.slug}</span>
              {' '}· Category: <span className="font-semibold">{cronResult.category}</span>
              {' '}· Triggered by: <span className="font-semibold">{cronResult.triggeredBy}</span>
            </p>
            <a
              href={`/blog/${cronResult.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-black tracking-widest uppercase text-green-400 hover:underline"
            >
              View Post <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button onClick={dismiss} className="shrink-0 text-green-400/50 hover:text-green-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {cronStatus === 'already_running' && (
        <div className="border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-4 relative animate-[fadeInUp_0.3s_ease]">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-black tracking-widest uppercase text-amber-400 mb-1">Already Running</p>
            <p className="text-[11px] text-amber-300/80">Another cron run is currently in progress. Please wait a few minutes before trying again.</p>
          </div>
          <button onClick={dismiss} className="shrink-0 text-amber-400/50 hover:text-amber-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {cronStatus === 'error' && cronError && (
        <div className="border border-red-500/30 bg-red-500/5 p-5 flex items-start gap-4 relative animate-[fadeInUp_0.3s_ease]">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black tracking-widest uppercase text-red-400 mb-1">Cron Run Failed</p>
            <p className="text-[11px] text-red-300/80 font-mono break-all">
              {cronError.error || 'Unknown error'}
              {cronError.message ? ` — ${cronError.message}` : ''}
            </p>
          </div>
          <button onClick={dismiss} className="shrink-0 text-red-400/50 hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Keyframe style */}
      <style>{`
        @keyframes cron-progress {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Inline variant of AdminConsole (no drawer overlay, full page) ────────────
function AdminConsoleInline({ services, showcases, testimonials, blogs, siteContent, testimonialCount, blogCount, loadContent, handleCRUD, isLoading, isSaving, errorMessage, successMessage, setErrorMessage, setSuccessMessage, session }) {
  const [activeTab, setActiveTab]   = useState('db')
  const [dbSubTab, setDbSubTab]     = useState('services')
  const [testimonialPage, setTestimonialPage] = useState(0)
  const [blogPage, setBlogPage] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const notifTimer = useRef(null)

  // Auto-dismiss success/error notifications after 5 s, and allow manual close
  useEffect(() => {
    if (!successMessage && !errorMessage) return
    if (notifTimer.current) clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => {
      if (successMessage) setSuccessMessage('')
      if (errorMessage)   setErrorMessage('')
    }, 5000)
    return () => clearTimeout(notifTimer.current)
  }, [successMessage, errorMessage, setSuccessMessage, setErrorMessage])

  // Wire header hamburger button to sidebar state
  useEffect(() => {
    const handler = () => setSidebarOpen(prev => !prev)
    window.addEventListener('admin-toggle-sidebar', handler)
    return () => window.removeEventListener('admin-toggle-sidebar', handler)
  }, [])

  const [newService, setNewService] = useState({ title: '', description: '', category: 'Marketplace Account Management', slug: '' })
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [editingService, setEditingService]     = useState({})

  const [newShowcase, setNewShowcase] = useState({ key: '', title: '', metric: '', description: '' })
  const [editingShowcaseId, setEditingShowcaseId] = useState(null)
  const [editingShowcase, setEditingShowcase]     = useState({})

  const [newTestimonial, setNewTestimonial] = useState({ author: '', company: '', text: '' })
  const [editingTestimonialId, setEditingTestimonialId] = useState(null)
  const [editingTestimonial, setEditingTestimonial]     = useState({})

  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'AI Automation',
    author: 'Aman Verma',
    authorRole: 'Head of Growth Architecture',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    seoTitle: '',
    metaDescription: '',
    slug: '',
    tags: 'WhatsApp AI, D2C Growth, Automation',
    excerpt: '',
    content: '',
    is_published: false,
  })
  const [newBlogFormKey, setNewBlogFormKey] = useState(0)
  const [editingBlogId, setEditingBlogId] = useState(null)
  const [editingBlog, setEditingBlog]     = useState({})

  const tabs = [
    { id: 'db',            label: 'CRUD Manager',   icon: <List      className="w-4 h-4" /> },
    { id: 'blogs',         label: 'Manage Blogs',   icon: <BookOpen  className="w-4 h-4" /> },
    { id: 'site',          label: 'Website Content', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'cron',          label: 'Cron Jobs',       icon: <Zap       className="w-4 h-4" /> },
  ]

  useEffect(() => {
    const table = activeTab === 'blogs' ? 'blog_posts' : activeTab === 'site' ? 'site_content' : dbSubTab
    const page = table === 'blog_posts' ? blogPage : table === 'testimonials' ? testimonialPage : 0
    loadContent(table, page)
  }, [activeTab, dbSubTab, blogPage, testimonialPage, loadContent])

  const inputCls  = "bg-[#1a1a1a] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-2.5 w-full focus:outline-none focus:border-[#f2f2f2]/40 placeholder-[#f2f2f2]/20"
  const labelCls  = "block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/40 mb-1.5"
  const btnCreate = "px-4 py-2 bg-[#f2f2f2] text-[#111111] text-[10px] font-black tracking-widest uppercase hover:bg-[#d9d9d9] transition-colors"
  const cardCls   = "border border-[#f2f2f2]/10 bg-[#1a1a1a] p-4 flex flex-col sm:flex-row justify-between gap-4"

  return (
    <div className="min-h-screen flex relative">
      {/* ── Mobile sidebar drawer backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <m.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar: always visible on lg+, drawer on mobile ── */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || true) && (
          <m.aside
            key="sidebar"
            initial={false}
            className={`
              fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
              w-[220px] shrink-0 bg-[#111111] border-r border-[#f2f2f2]/10
              flex flex-col py-6 px-0
              transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
            style={{ willChange: 'transform' }}
          >
            {/* Mobile close button */}
            <button
              className="lg:hidden absolute top-4 right-4 p-1.5 text-[#f2f2f2]/40 hover:text-[#f2f2f2] transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-5 mb-8">
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#f2f2f2]/25">NAVIGATION</span>
            </div>
            {tabs.map((t, i) => (
              <m.button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setSidebarOpen(false) }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05, ease: 'easeOut' }}
                className={`flex items-center gap-3 px-5 py-3.5 text-xs font-black tracking-widest uppercase text-left transition-all duration-200 border-l-2 ${
                  activeTab === t.id
                    ? 'bg-[#f2f2f2]/5 border-[#f2f2f2] text-[#f2f2f2]'
                    : 'border-transparent text-[#f2f2f2]/35 hover:text-[#f2f2f2]/65 hover:bg-[#f2f2f2]/[0.03]'
                }`}
              >
                <span className={activeTab === t.id ? 'text-[#f2f2f2]' : 'text-[#f2f2f2]/30'}>{t.icon}</span>
                {t.label}
              </m.button>
            ))}

            <div className="mt-auto px-5 space-y-4 pt-8 border-t border-[#f2f2f2]/8">
              {[
                { label: 'Services',     val: services.length },
                { label: 'Case Studies', val: showcases.length },
                { label: 'Reviews',      val: testimonialCount },
                { label: 'Blog Posts',   val: blogCount },
              ].map((s, i) => (
                <m.div
                  key={s.label}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <span className="text-[10px] text-[#f2f2f2]/30 uppercase tracking-wider">{s.label}</span>
                  <span className="font-clash font-bold text-sm text-[#f2f2f2]/70">{s.val}</span>
                </m.div>
              ))}
            </div>
          </m.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {errorMessage ? (
          <m.div
            key="error-toast"
            role="alert"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 border border-red-500/30 bg-[#1a1010] p-4 text-xs text-red-200 shadow-2xl sm:right-6 sm:top-6"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-bold text-red-300">Something went wrong</p>
              <p className="break-words leading-relaxed">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss error notification"
              className="shrink-0 text-red-300/60 transition-colors hover:text-red-200"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </m.div>
        ) : successMessage ? (
          <m.div
            key="success-toast"
            role="status"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 border border-green-500/30 bg-[#101a13] p-4 text-xs text-green-200 shadow-2xl sm:right-6 sm:top-6"
          >
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-bold text-green-300">Saved successfully</p>
              <p className="break-words leading-relaxed">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              aria-label="Dismiss success notification"
              className="shrink-0 text-green-300/60 transition-colors hover:text-green-200"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </m.div>
        ) : null}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0e0e0e] pb-24 lg:pb-8">
        {isSaving && <p role="status" className="mb-4 text-xs text-[#f2f2f2]/50">Saving changes…</p>}
        {isLoading && (
          <p role="status" className="mb-6 text-center text-sm text-[#f2f2f2]/50">Loading admin content…</p>
        )}
        {/* Animated tab panels */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
        {/* Each tab is uniquely keyed so AnimatePresence unmounts/mounts on switch */}
        {activeTab === 'site' && (
          <WebsiteContentEditor
            sections={siteContent}
            onSave={handleCRUD.saveSiteContent}
            isSaving={isSaving}
            isLoading={isLoading}
          />
        )}

        {/* ─── CRUD Manager ─── */}
        {activeTab === 'db' && (
          <div>
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">CRUD Database Manager</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">Create, read, update and delete records saved in Supabase.</p>
            </div>

            {/* Sub tabs — scrollable on mobile */}
            <div className="flex gap-1 mb-6 sm:mb-8 border-b border-[#f2f2f2]/10 pb-0 overflow-x-auto scrollbar-none">
              {['services', 'showcases', 'testimonials'].map(s => (
                <button
                  key={s}
                  onClick={() => setDbSubTab(s)}
                  className={`px-5 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase border-b-2 -mb-px transition-all ${
                    dbSubTab === s
                      ? 'border-[#f2f2f2] text-[#f2f2f2]'
                      : 'border-transparent text-[#f2f2f2]/30 hover:text-[#f2f2f2]/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ── SERVICES ── */}
            {dbSubTab === 'services' && (
              <div className="space-y-8">
                <form onSubmit={async (e) => { e.preventDefault(); if (!newService.title.trim()) return; if (await handleCRUD.addService(newService)) setNewService({ title: '', description: '', category: 'Marketplace Account Management', slug: '' }) }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Service Record ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Title</label><input required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="Service name..." className={inputCls} /></div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} className={inputCls}>
                        {['Marketplace Account Management','Development','AI Automation','Growth','Marketing','Integrations'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className={labelCls}>Page slug (optional)</label><input value={newService.slug} onChange={e => setNewService({...newService, slug: e.target.value})} placeholder="amazon-account-management" className={inputCls} /></div>
                  <div><label className={labelCls}>Description</label><textarea required rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Describe the service..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" disabled={isSaving} className={btnCreate}>+ Add Service</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {services.length} Active Services ]</h4>
                  {services.map(s => (
                    <div key={s.id} className={cardCls}>
                      {editingServiceId === s.id ? (
                        <div className="flex-1 space-y-3">
                          <input aria-label="Service title" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className={inputCls} />
                          <input aria-label="Service page slug" value={editingService.slug || ''} onChange={e => setEditingService({...editingService, slug: e.target.value})} placeholder="service-page-slug" className={inputCls} />
                          <textarea aria-label="Service card description" rows={3} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className={`${inputCls} resize-none`} />
                          <ServicePageEditor
                            details={editingService.details || getServicePageDetails(s)}
                            onChange={details => setEditingService({ ...editingService, details })}
                          />
                          <a
                            href={`/services/${serviceSlug(editingService.slug || s.slug || editingService.title)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#ffc46d] hover:underline"
                          >
                            Preview public service page <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <div className="flex gap-2">
                            <button disabled={isSaving} onClick={async () => { if (await handleCRUD.updateService(s.id, editingService)) setEditingServiceId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingServiceId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black tracking-wider uppercase text-[#f2f2f2]/30 border border-[#f2f2f2]/10 px-2 py-0.5">{s.category}</span>
                          </div>
                          <h5 className="text-sm font-bold text-[#f2f2f2]">{s.title}</h5>
                          <p className="text-[11px] text-[#f2f2f2]/45 mt-1 leading-relaxed">{s.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingServiceId(s.id); setEditingService({ ...s, details: getServicePageDetails(s) }) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button disabled={isSaving} onClick={() => handleCRUD.deleteService(s.id)} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SHOWCASES ── */}
            {dbSubTab === 'showcases' && (
              <div className="space-y-8">
                <form onSubmit={async (e) => { e.preventDefault(); if (!newShowcase.title.trim()) return; if (await handleCRUD.addShowcase(newShowcase)) setNewShowcase({ key: '', title: '', metric: '', description: '' }) }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Showcase Audit ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className={labelCls}>Key</label><input required value={newShowcase.key} onChange={e => setNewShowcase({...newShowcase, key: e.target.value})} placeholder="e.g. amazon" className={inputCls} /></div>
                    <div><label className={labelCls}>Title</label><input required value={newShowcase.title} onChange={e => setNewShowcase({...newShowcase, title: e.target.value})} placeholder="Study title..." className={inputCls} /></div>
                    <div><label className={labelCls}>Core Metric</label><input required value={newShowcase.metric} onChange={e => setNewShowcase({...newShowcase, metric: e.target.value})} placeholder="e.g. #1 Best Seller" className={inputCls} /></div>
                  </div>
                  <div><label className={labelCls}>Description</label><textarea required rows={3} value={newShowcase.description} onChange={e => setNewShowcase({...newShowcase, description: e.target.value})} placeholder="Audit detail..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" disabled={isSaving} className={btnCreate}>+ Add Case Study</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {showcases.length} Case Studies ]</h4>
                  {showcases.map(s => (
                    <div key={s.id} className={cardCls}>
                      {editingShowcaseId === s.id ? (
                        <div className="flex-1 space-y-3">
                          <input value={editingShowcase.title}  onChange={e => setEditingShowcase({...editingShowcase, title: e.target.value})} className={inputCls} />
                          <input value={editingShowcase.metric} onChange={e => setEditingShowcase({...editingShowcase, metric: e.target.value})} className={inputCls} placeholder="Metric..." />
                          <textarea rows={3} value={editingShowcase.description} onChange={e => setEditingShowcase({...editingShowcase, description: e.target.value})} className={`${inputCls} resize-none`} />
                          <div className="flex gap-2">
                            <button disabled={isSaving} onClick={async () => { if (await handleCRUD.updateShowcase(s.id, editingShowcase)) setEditingShowcaseId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingShowcaseId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[9px] font-black tracking-wider uppercase text-[#f2f2f2]/25 border border-[#f2f2f2]/8 px-2 py-0.5">[{s.key}]</span>
                            <span className="text-xs font-black text-[#f2f2f2]/60">{s.metric}</span>
                          </div>
                          <h5 className="text-sm font-bold text-[#f2f2f2]">{s.title}</h5>
                          <p className="text-[11px] text-[#f2f2f2]/45 mt-1 leading-relaxed">{s.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingShowcaseId(s.id); setEditingShowcase(s) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button disabled={isSaving} onClick={() => handleCRUD.deleteShowcase(s.id)} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TESTIMONIALS ── */}
            {dbSubTab === 'testimonials' && (
              <div className="space-y-8">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  if (!newTestimonial.author.trim()) return
                  if (await handleCRUD.addTestimonial(newTestimonial)) {
                    setTestimonialPage(Math.floor(testimonialCount / PAGE_SIZE))
                    setNewTestimonial({ author: '', company: '', text: '' })
                  }
                }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Testimonial Record ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Author Name</label><input required value={newTestimonial.author} onChange={e => setNewTestimonial({...newTestimonial, author: e.target.value})} placeholder="Client name..." className={inputCls} /></div>
                    <div><label className={labelCls}>Company</label><input value={newTestimonial.company} onChange={e => setNewTestimonial({...newTestimonial, company: e.target.value})} placeholder="Brand / Company..." className={inputCls} /></div>
                  </div>
                  <div><label className={labelCls}>Testimonial Text</label><textarea required rows={3} value={newTestimonial.text} onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})} placeholder="Client's exact words..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" disabled={isSaving} className={btnCreate}>+ Add Testimonial</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {testimonialCount} Reviews ]</h4>
                  {testimonials.map(t => (
                    <div key={t.id} className={cardCls}>
                      {editingTestimonialId === t.id ? (
                        <div className="flex-1 space-y-3">
                          <input value={editingTestimonial.author}  onChange={e => setEditingTestimonial({...editingTestimonial, author: e.target.value})} className={inputCls} placeholder="Author..." />
                          <input value={editingTestimonial.company} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className={inputCls} placeholder="Company..." />
                          <textarea rows={3} value={editingTestimonial.text} onChange={e => setEditingTestimonial({...editingTestimonial, text: e.target.value})} className={`${inputCls} resize-none`} />
                          <div className="flex gap-2">
                            <button disabled={isSaving} onClick={async () => { if (await handleCRUD.updateTestimonial(t.id, editingTestimonial)) setEditingTestimonialId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingTestimonialId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#f2f2f2]">{t.author}</span>
                            <span className="text-[10px] text-[#f2f2f2]/30">· {t.company}</span>
                          </div>
                          <p className="text-[11px] text-[#f2f2f2]/50 italic leading-relaxed">"{t.text}"</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingTestimonialId(t.id); setEditingTestimonial(t) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button disabled={isSaving} onClick={async () => {
                          if (await handleCRUD.deleteTestimonial(t.id)) {
                            if (testimonials.length === 1 && testimonialPage > 0) {
                              setTestimonialPage(page => page - 1)
                            } else {
                              loadContent('testimonials', testimonialPage)
                            }
                          }
                        }} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {testimonialCount > PAGE_SIZE && (
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setTestimonialPage(page => Math.max(0, page - 1))}
                        disabled={testimonialPage === 0}
                        className="border border-[#f2f2f2]/20 px-4 py-2 text-[10px] font-bold uppercase text-[#f2f2f2]/70 disabled:opacity-30"
                      >
                        Previous
                      </button>
                      <span className="text-[10px] text-[#f2f2f2]/50">
                        Page {testimonialPage + 1} of {Math.ceil(testimonialCount / PAGE_SIZE)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTestimonialPage(page => Math.min(Math.ceil(testimonialCount / PAGE_SIZE) - 1, page + 1))}
                        disabled={testimonialPage >= Math.ceil(testimonialCount / PAGE_SIZE) - 1}
                        className="border border-[#f2f2f2]/20 px-4 py-2 text-[10px] font-bold uppercase text-[#f2f2f2]/70 disabled:opacity-30"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Blog Manager ─── */}
        {activeTab === 'blogs' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Blog & Knowledge Base Manager</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">Publish, edit, and organize strategic eCommerce playbooks for the public blog directory.</p>
            </div>

            {/* Form: New Blog Article */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const validationError = validateBlogPost(newBlog)
                if (validationError) {
                  setErrorMessage(validationError)
                  return
                }
                if (await handleCRUD.addBlog(newBlog)) {
                  setBlogPage(0)
                  setNewBlog({
                    title: '',
                    category: 'AI Automation',
                    author: 'Aman Verma',
                    authorRole: 'Head of Growth Architecture',
                    readTime: '5 min read',
                    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                    seoTitle: '',
                    metaDescription: '',
                    slug: '',
                    tags: 'WhatsApp AI, D2C Growth, Automation',
                    excerpt: '',
                    content: '',
                    is_published: false,
                  })
                  setNewBlogFormKey(key => key + 1)
                }
              }}
              className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4"
            >
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ Create Blog Article ]</h3>
              <BlogEditorFields
                key={newBlogFormKey}
                article={newBlog}
                onChange={setNewBlog}
                inputClassName={inputCls}
                labelClassName={labelCls}
                suggestSlug
              />
              <button type="submit" disabled={isSaving} className={btnCreate}>
                {newBlog.is_published ? '+ Publish Blog Article' : '+ Save Draft'}
              </button>
            </form>

            {/* Published articles and drafts */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">
                [ {blogCount} Blog Posts ]
              </h4>

              {blogs.map(b => (
                <div key={b.id} className="border border-[#f2f2f2]/10 bg-[#141414] p-5">
                  {editingBlogId === b.id ? (
                    <div className="space-y-4">
                      <BlogEditorFields
                        article={editingBlog}
                        onChange={setEditingBlog}
                        inputClassName={inputCls}
                        labelClassName={labelCls}
                      />

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={async () => {
                            const validationError = validateBlogPost(editingBlog)
                            if (validationError) {
                              setErrorMessage(validationError)
                              return
                            }
                            if (await handleCRUD.updateBlog(b.id, editingBlog)) setEditingBlogId(null)
                          }}
                          disabled={isSaving}
                          className="px-4 py-2 bg-green-600 text-white text-[10px] font-black tracking-widest uppercase hover:bg-green-700 transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Save {editingBlog.is_published ? 'Published Article' : 'Draft'}
                        </button>
                        <button
                          onClick={() => setEditingBlogId(null)}
                          className="px-4 py-2 bg-[#f2f2f2]/10 text-[#f2f2f2] text-[10px] font-black tracking-widest uppercase hover:bg-[#f2f2f2]/20 transition-colors flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                      {b.coverImage && (
                        <div className="w-full md:w-36 h-24 shrink-0 rounded bg-slate-900 overflow-hidden border border-[#f2f2f2]/10">
                          <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[9px] font-black tracking-wider uppercase text-[#f2f2f2]/40 border border-[#f2f2f2]/10 px-2 py-0.5">
                            {b.category}
                          </span>
                          <span className={`text-[9px] font-black tracking-wider uppercase border px-2 py-0.5 ${
                            b.is_published
                              ? 'border-green-500/20 text-green-400/70'
                              : 'border-amber-500/20 text-amber-400/70'
                          }`}>
                            {b.is_published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-[10px] text-[#f2f2f2]/30">{b.date}</span>
                          <span className="text-[10px] text-[#f2f2f2]/30">· {b.readTime}</span>
                          <span className="text-[10px] text-[#f2f2f2]/30">· By {b.author}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#f2f2f2] leading-snug">
                          {b.title}
                        </h4>
                        <p className="text-[11px] text-[#f2f2f2]/50 mt-1.5 line-clamp-2 leading-relaxed">
                          {b.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <a
                            href={`/blog/${b.slug || b.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-[10px] font-bold underline tracking-wider uppercase ${
                              b.is_published
                                ? 'text-violet-400 hover:text-violet-300'
                                : 'pointer-events-none text-[#f2f2f2]/20'
                            }`}
                          >
                            {b.is_published ? 'View on Site ↗' : 'Draft is private'}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center shrink-0 self-start">
                        <button
                          onClick={() => {
                            setEditingBlogId(b.id);
                            setEditingBlog(b);
                          }}
                          className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isSaving}
                          onClick={async () => {
                            if (await handleCRUD.deleteBlog(b.id)) {
                              if (blogs.length === 1 && blogPage > 0) {
                                setBlogPage(page => page - 1)
                              } else {
                                loadContent('blog_posts', blogPage)
                              }
                            }
                          }}
                          className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {blogCount > PAGE_SIZE && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setBlogPage(page => Math.max(0, page - 1))}
                    disabled={blogPage === 0}
                    className="border border-[#f2f2f2]/20 px-4 py-2 text-[10px] font-bold uppercase text-[#f2f2f2]/70 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="text-[10px] text-[#f2f2f2]/50">
                    Page {blogPage + 1} of {Math.ceil(blogCount / PAGE_SIZE)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBlogPage(page => Math.min(Math.ceil(blogCount / PAGE_SIZE) - 1, page + 1))}
                    disabled={blogPage >= Math.ceil(blogCount / PAGE_SIZE) - 1}
                    className="border border-[#f2f2f2]/20 px-4 py-2 text-[10px] font-bold uppercase text-[#f2f2f2]/70 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

          {/* ─── Cron Jobs ─── */}
          {activeTab === 'cron' && (
            <CronPanel session={session} />
          )}

          </m.div>
        </AnimatePresence>

        {/* ── Mobile bottom tab bar ── */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#111111] border-t border-[#f2f2f2]/10 flex">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[9px] font-black tracking-widest uppercase transition-colors ${
                activeTab === t.id
                  ? 'text-[#f2f2f2] bg-[#f2f2f2]/5'
                  : 'text-[#f2f2f2]/30 hover:text-[#f2f2f2]/60'
              }`}
            >
              <span className={activeTab === t.id ? 'text-[#f2f2f2]' : 'text-[#f2f2f2]/30'}>{t.icon}</span>
              <span className="leading-none">{t.label.split(' ')[0]}</span>
              {activeTab === t.id && (
                <m.span
                  layoutId="bottom-tab-indicator"
                  className="absolute top-0 inset-x-0 h-px bg-[#f2f2f2]"
                />
              )}
            </button>
          ))}
        </nav>

      </main>
    </div>
  )
}

// ── Main Export: Admin Page with login gate ─────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [authStatus, setAuthStatus] = useState('checking')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const userId = session?.user?.id

  useEffect(() => {
    let active = true
    let authEventReceived = false
    let authRevision = 0

    const verifyStoredSession = async (candidate, revision) => {
      if (!active || revision !== authRevision) return
      if (!candidate) {
        setSession(null)
        setAuthStatus('unauthenticated')
        setAuthError('')
        return
      }

      setAuthStatus('checking')
      try {
        const { data, error } = await verifyInitialUser(candidate.access_token)
        if (!active || revision !== authRevision) return
        if (error || !data.user) {
          setSession(null)
          setAuthStatus('unauthenticated')
          setAuthError('Unable to verify your session. Please sign in again.')
          return
        }
        setSession(candidate)
        setAuthStatus('authenticated')
        setAuthError('')
      } catch {
        if (!active || revision !== authRevision) return
        setSession(null)
        setAuthStatus('unauthenticated')
        setAuthError('Unable to verify your session. Please sign in again.')
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'INITIAL_SESSION') return
      authEventReceived = true
      if (!active) return
      ++authRevision
      if (!nextSession) {
        setSession(null)
        setAuthStatus('unauthenticated')
        setAuthError('')
        return
      }
      if (event === 'SIGNED_IN' && nextSession.user?.id) {
        try {
          localStorage.setItem(getAdminActivityKey(nextSession.user.id), String(Date.now()))
        } catch (storageError) {
          console.error('Unable to persist admin session activity.', storageError)
        }
      }
      setSession(nextSession)
      setAuthStatus('authenticated')
      setAuthError('')
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || authEventReceived) return
      if (error) {
        setSession(null)
        setAuthStatus('unauthenticated')
        setAuthError('Unable to verify your session. Please sign in again.')
        return
      }
      const revision = ++authRevision
      verifyStoredSession(data.session, revision)
    }).catch(() => {
      if (!active || authEventReceived) return
      setSession(null)
      setAuthStatus('unauthenticated')
      setAuthError('Unable to verify your session. Please sign in again.')
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authStatus !== 'authenticated' || !userId) return undefined

    const activityKey = getAdminActivityKey(userId)
    const now = Date.now()
    let lastActivityAt = now
    let lastPersistedAt = now
    let storageErrorReported = false
    let expired = false

    const reportStorageError = error => {
      if (storageErrorReported) return
      storageErrorReported = true
      console.error('Unable to persist admin session activity.', error)
    }

    try {
      const savedActivity = Number(localStorage.getItem(activityKey))
      if (Number.isFinite(savedActivity) && savedActivity > 0) {
        lastActivityAt = savedActivity
        lastPersistedAt = savedActivity
      } else {
        localStorage.setItem(activityKey, String(now))
      }
    } catch (storageError) {
      reportStorageError(storageError)
    }

    const expireSession = async () => {
      if (expired) return
      expired = true
      setSession(null)
      setAuthStatus('unauthenticated')

      let signOutError = null
      try {
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        if (error) signOutError = error
      } catch (error) {
        signOutError = error
      }

      if (signOutError) {
        console.error('Unable to clear the expired admin session.', signOutError)
      }
      try {
        localStorage.removeItem(activityKey)
      } catch (storageError) {
        reportStorageError(storageError)
      }
      setAuthError('Your admin session expired after 30 minutes of inactivity. Please sign in again.')
    }

    const recordActivity = () => {
      const activityAt = Date.now()
      lastActivityAt = activityAt
      if (activityAt - lastPersistedAt < 1000) return

      try {
        localStorage.setItem(activityKey, String(activityAt))
        lastPersistedAt = activityAt
      } catch (storageError) {
        reportStorageError(storageError)
      }
    }

    const checkIdleTimeout = () => {
      let sharedActivityAt = lastActivityAt
      try {
        const savedActivity = Number(localStorage.getItem(activityKey))
        if (Number.isFinite(savedActivity) && savedActivity > sharedActivityAt) {
          sharedActivityAt = savedActivity
          lastActivityAt = savedActivity
        }
      } catch (storageError) {
        reportStorageError(storageError)
      }

      if (Date.now() - sharedActivityAt >= ADMIN_IDLE_TIMEOUT_MS) {
        void expireSession()
      }
    }

    const handleStorage = event => {
      if (event.key !== activityKey || !event.newValue) return
      const sharedActivityAt = Number(event.newValue)
      if (Number.isFinite(sharedActivityAt) && sharedActivityAt > lastActivityAt) {
        lastActivityAt = sharedActivityAt
      }
    }

    const activityEvents = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove']
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, recordActivity, { passive: true })
    })
    window.addEventListener('storage', handleStorage)
    const timeoutCheck = window.setInterval(checkIdleTimeout, 1000)
    checkIdleTimeout()

    return () => {
      activityEvents.forEach(eventName => {
        window.removeEventListener(eventName, recordActivity)
      })
      window.removeEventListener('storage', handleStorage)
      window.clearInterval(timeoutCheck)
    }
  }, [authStatus, userId])

  const handleLogin = async (email, password) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.session) {
        setAuthError('Sign-in failed. Check your email and password, then try again.')
        return
      }
      if (data.session.user?.id) {
        try {
          localStorage.setItem(getAdminActivityKey(data.session.user.id), String(Date.now()))
        } catch (storageError) {
          console.error('Unable to persist admin session activity.', storageError)
        }
      }
      setSession(data.session)
      setAuthStatus('authenticated')
    } catch {
      setAuthError('Sign-in failed. Check your email and password, then try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    setAuthError('')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setAuthError('Unable to sign out. Please try again.')
        return
      }
      setSession(null)
      setAuthStatus('unauthenticated')
    } catch {
      setAuthError('Unable to sign out. Please try again.')
    }
  }

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center font-satoshi text-sm text-[#f2f2f2]/60">
        Verifying admin session…
      </div>
    )
  }

  if (authStatus !== 'authenticated' || !session) {
    return <LoginScreen onLogin={handleLogin} error={authError} loading={authLoading} />
  }

  return <AdminDashboard onLogout={handleLogout} authError={authError} session={session} />
}
