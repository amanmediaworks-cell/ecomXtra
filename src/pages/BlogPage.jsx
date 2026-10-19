import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, Search, Tag, BookOpen, Sparkles } from 'lucide-react'

function BlogPage({ theme, blogs = [] }) {
  const isSwiss = theme === 'swiss'
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

  const featuredBlog = blogs.length > 0 ? blogs[0] : null
  const regularBlogs = selectedCategory === 'All' && !searchQuery ? filteredBlogs.slice(1) : filteredBlogs

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ ECOMXTRA INSIGHTS & BLOGS ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          eCommerce Strategy & AI Playbooks
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
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
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? isSwiss
                      ? 'bg-swiss-text text-swiss-bg font-black uppercase'
                      : 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/20 rounded-full font-extrabold'
                    : isSwiss
                      ? 'border border-swiss-text/30 text-swiss-text hover:bg-swiss-text/10 uppercase'
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
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles & playbooks..."
              className={`w-full pl-9 pr-4 py-2 text-xs transition-all focus:outline-none ${
                isSwiss
                  ? 'border border-swiss-text bg-swiss-bg text-swiss-text placeholder:text-swiss-text/40'
                  : 'bg-white/90 border border-violet-150 rounded-full text-slate-900 placeholder:text-slate-400 focus:border-violet-500 shadow-sm'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Featured Blog Hero (when viewing All and no search) */}
      {selectedCategory === 'All' && !searchQuery && featuredBlog && (
        <section className="py-10 px-6 max-w-6xl mx-auto">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isSwiss ? 'text-swiss-text' : 'text-pink-500 animate-pulse'}`} />
            <span className={`text-[11px] font-black uppercase tracking-widest ${
              isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-pink-600 font-extrabold'
            }`}>
              Featured Playbook
            </span>
          </div>

          <div className={`overflow-hidden transition-all group ${
            isSwiss
              ? 'border border-swiss-text bg-white'
              : 'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-xl hover:shadow-2xl'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-900">
                <img
                  src={featuredBlog.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 ${
                    isSwiss
                      ? 'bg-swiss-text text-swiss-bg'
                      : 'bg-violet-600/90 backdrop-blur-md text-white rounded-full font-bold shadow-md'
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
                    isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
                  }`}>
                    {featuredBlog.title}
                  </h2>

                  <p className={`mt-4 text-sm leading-relaxed ${
                    isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
                  }`}>
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-150 flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-800'}`}>
                    By {featuredBlog.author}
                  </span>
                  <Link
                    to={`/blog/${featuredBlog.slug || featuredBlog.id}`}
                    className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${
                      isSwiss
                        ? 'text-swiss-text hover:underline'
                        : 'text-violet-600 hover:text-violet-800 font-extrabold'
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
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/80 rounded-3xl border border-violet-100 shadow-sm'
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
                  isSwiss
                    ? 'border border-swiss-text bg-white hover:bg-swiss-bg/40'
                    : 'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={blog.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 ${
                        isSwiss
                          ? 'bg-swiss-text text-swiss-bg'
                          : 'bg-violet-600 text-white rounded-full font-bold'
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
                      isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
                    }`}>
                      {blog.title}
                    </h3>

                    <p className={`mt-3 text-xs leading-relaxed line-clamp-3 ${
                      isSwiss ? 'font-satoshi text-swiss-text/75' : 'font-outfit text-slate-600'
                    }`}>
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-150/50 mt-4 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${isSwiss ? 'text-swiss-text/70' : 'text-slate-500'}`}>
                    By {blog.author}
                  </span>
                  <Link
                    to={`/blog/${blog.slug || blog.id}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                      isSwiss
                        ? 'text-swiss-text font-black uppercase hover:underline'
                        : 'text-violet-600 font-extrabold hover:text-violet-800'
                    }`}
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className={`mt-14 mb-6 p-8 md:p-12 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Want us to implement these growth playbooks for your brand?
          </h3>
          <p className="mt-3 text-xs md:text-sm max-w-xl mx-auto opacity-90">
            Book a complimentary 30-minute technical architecture and marketplace audit with our core team.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                isSwiss
                  ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                  : 'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
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
