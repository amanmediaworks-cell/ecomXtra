import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Search, BookOpen, Sparkles } from 'lucide-react'
import BlogImage from '../components/BlogImage'

function BlogPage({
  blogs = [],
  page = 0,
  pageSize = 6,
  totalCount = blogs.length,
  onPageChange,
}) {

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'AI Automation', 'Shopify & Tech', 'Marketplace SEO', 'CRO & Growth']

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    return matchesCategory && matchesSearch
  })

  const featuredBlog = page === 0 && blogs.length > 0 ? blogs[0] : null
  const regularBlogs = featuredBlog && selectedCategory === 'All' && !searchQuery
    ? filteredBlogs.filter(blog => blog.id !== featuredBlog.id)
    : filteredBlogs
  const pageCount = Math.ceil(totalCount / pageSize)
  const changePage = nextPage => {
    if (nextPage >= 0 && nextPage < pageCount) onPageChange?.(nextPage)
  }

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ ECOMXTRA INSIGHTS & BLOGS ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          'font-outfit text-slate-900 font-extrabold'
        }`}>
          eCommerce Strategy & AI Playbooks
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          'font-outfit text-slate-600 font-medium'
        }`}>
          Actionable technical breakdowns, Hinglish conversational agent blueprints, and marketplace ranking case studies written by the architects at EcomXtra.
        </p>

        {/* Search & Category Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  onPageChange?.(0)
                }}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20 rounded-full font-extrabold'
                    : 'bg-white/80 border border-violet-150 text-slate-700 hover:border-violet-300 rounded-full'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                onPageChange?.(0)
              }}
              placeholder="Search articles & playbooks..."
              className={`w-full pl-9 pr-4 py-2 text-xs transition-all focus:outline-none ${
                'bg-white/90 border border-violet-150 rounded-full text-slate-900 placeholder:text-slate-400 focus:border-violet-500 shadow-sm'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Featured Blog Hero (when viewing All and no search) */}
      {selectedCategory === 'All' && !searchQuery && featuredBlog && (
        <section className="py-10 px-6 max-w-6xl mx-auto">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            <span className={`text-[11px] font-black uppercase tracking-widest ${
              'font-outfit text-pink-600 font-extrabold'
            }`}>
              Featured Playbook
            </span>
          </div>

          <div className={`overflow-hidden transition-all group ${
            'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-xl hover:shadow-2xl'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-900">
                {featuredBlog.coverImage ? (
                  <BlogImage
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    priority
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-90"
                    fallback={
                      <div
                        role="img"
                        aria-label={`No cover image available for ${featuredBlog.title}`}
                        className="w-full h-full flex items-center justify-center text-violet-200"
                      >
                        <BookOpen className="w-12 h-12 opacity-70" aria-hidden="true" />
                      </div>
                    }
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`No cover image available for ${featuredBlog.title}`}
                    className="w-full h-full flex items-center justify-center text-violet-200"
                  >
                    <BookOpen className="w-12 h-12 opacity-70" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 ${
                    'bg-violet-600/90 backdrop-blur-md text-white rounded-full font-bold shadow-md'
                  }`}>
                    {featuredBlog.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs opacity-60 mb-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> {featuredBlog.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> {featuredBlog.readTime}
                    </span>
                  </div>

                  <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug group-hover:text-violet-600 transition-colors ${
                    'font-outfit text-slate-900 font-extrabold'
                  }`}>
                    {featuredBlog.title}
                  </h2>

                  <p className={`mt-4 text-sm leading-relaxed ${
                    'font-outfit text-slate-600 font-medium'
                  }`}>
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-150 flex items-center justify-between">
                  <span className="text-xs font-bold font-outfit text-slate-800">
                    By {featuredBlog.author}
                  </span>
                  <Link
                    to={`/blog/${featuredBlog.slug || featuredBlog.id}`}
                    className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
                      'text-violet-600 hover:text-violet-800 font-extrabold'
                    }`}
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Cards Grid */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        {filteredBlogs.length === 0 ? (
          <div className={`p-12 text-center ${
            'bg-white/80 rounded-3xl border border-violet-100 shadow-sm'
          }`}>
            <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map(blog => (
              <article
                key={blog.id}
                className={`flex flex-col justify-between overflow-hidden transition-all duration-300 group ${
                  'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    {blog.coverImage ? (
                      <BlogImage
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                        fallback={
                          <div
                            role="img"
                            aria-label={`No cover image available for ${blog.title}`}
                            className="w-full h-full flex items-center justify-center text-violet-200"
                          >
                            <BookOpen className="w-9 h-9 opacity-70" aria-hidden="true" />
                          </div>
                        }
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`No cover image available for ${blog.title}`}
                        className="w-full h-full flex items-center justify-center text-violet-200"
                      >
                        <BookOpen className="w-9 h-9 opacity-70" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 ${
                        'bg-violet-600 text-white rounded-full font-bold'
                      }`}>
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] opacity-60 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {blog.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {blog.readTime}
                      </span>
                    </div>

                    <h3 className={`text-lg font-bold tracking-tight leading-snug group-hover:text-violet-600 transition-colors ${
                      'font-outfit text-slate-900 font-extrabold'
                    }`}>
                      {blog.title}
                    </h3>

                    <p className={`mt-3 text-xs leading-relaxed line-clamp-3 ${
                      'font-outfit text-slate-600'
                    }`}>
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-150/50 mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    By {blog.author}
                  </span>
                  <Link
                    to={`/blog/${blog.slug || blog.id}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                      'text-violet-600 font-extrabold hover:text-violet-800'
                    }`}
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 0}
              className="rounded-full border border-violet-200 px-5 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-500">
              Page {page + 1} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page >= pageCount - 1}
              className="rounded-full border border-violet-200 px-5 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}

        {/* CTA Banner */}
        <div className={`mt-14 mb-6 p-8 md:p-12 text-center ${
          'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className="text-2xl md:text-3xl font-bold font-outfit text-white">
            Want us to implement these growth playbooks for your brand?
          </h3>
          <p className="mt-3 text-xs md:text-sm max-w-xl mx-auto opacity-90">
            Book a complimentary 30-minute technical architecture and marketplace audit with our core team.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
              }`}
            >
              Book Strategy Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
