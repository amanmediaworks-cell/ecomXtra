import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Check, MessageSquare, ExternalLink, Bookmark } from 'lucide-react'

function BlogPostPage({ theme, blogs = [] }) {
  const { id } = useParams()
  const isSwiss = theme === 'swiss'
  const [copied, setCopied] = useState(false)

  // Find article by slug or ID
  const blog = blogs.find(b => String(b.id) === String(id) || b.slug === id)

  if (!blog) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Article Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">The playbook you are looking for may have been moved or removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-full font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog Directory
        </Link>
      </div>
    )
  }

  // Related blogs (excluding current)
  const relatedBlogs = blogs.filter(b => b.id !== blog.id).slice(0, 3)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Parse markdown-like content into structured elements
  const renderFormattedContent = (content) => {
    if (!content) return null

    const lines = content.split('\n')
    const elements = []
    let currentKey = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('### ')) {
        elements.push(
          <h2
            key={currentKey++}
            className={`text-xl sm:text-2xl font-bold mt-8 mb-4 ${
              isSwiss ? 'font-clash text-swiss-text border-b border-swiss-text pb-2' : 'font-outfit text-slate-900 font-extrabold'
            }`}
          >
            {line.replace('### ', '')}
          </h2>
        )
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h3
            key={currentKey++}
            className={`text-lg font-bold mt-6 mb-2 ${
              isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-violet-700 font-bold'
            }`}
          >
            {line.replace('#### ', '')}
          </h3>
        )
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={currentKey++}
            className={`my-6 p-4 border-l-4 italic text-sm leading-relaxed ${
              isSwiss
                ? 'border-swiss-text bg-swiss-text/5 text-swiss-text font-serif'
                : 'border-violet-500 bg-violet-50/70 text-slate-800 rounded-r-2xl font-medium'
            }`}
          >
            {line.replace('> ', '')}
          </blockquote>
        )
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        elements.push(
          <li key={currentKey++} className="ml-6 list-disc text-sm leading-relaxed mb-1.5 opacity-90">
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === '---') {
        elements.push(<hr key={currentKey++} className="my-8 border-gray-200/60" />)
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={currentKey++} className="text-sm sm:text-base leading-relaxed mb-4 opacity-90">
            {line}
          </p>
        )
      }
    }

    return elements
  }

  const shareText = encodeURIComponent(`${blog.title} — via EcomXtra`)
  const currentUrl = encodeURIComponent(window.location.href)

  return (
    <article className="pt-20 md:pt-28 pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="px-6 max-w-4xl mx-auto mb-6">
        <Link
          to="/blog"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all mb-4 ${
            isSwiss
              ? 'text-swiss-text font-black uppercase hover:underline'
              : 'text-violet-600 hover:text-violet-800 font-extrabold'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
        </Link>
      </div>

      {/* Article Header */}
      <header className="px-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 ${
            isSwiss
              ? 'bg-swiss-text text-swiss-bg'
              : 'bg-violet-600 text-white rounded-full font-bold shadow-xs'
          }`}>
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-xs opacity-60">
            <Calendar className="w-3.5 h-3.5" /> {blog.date}
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1 text-xs opacity-60">
            <Clock className="w-3.5 h-3.5" /> {blog.readTime}
          </span>
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          {blog.title}
        </h1>

        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          {blog.excerpt}
        </p>

        {/* Author & Action Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
              isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
            }`}>
              {blog.author.charAt(0)}
            </div>
            <div>
              <span className={`text-xs font-bold block ${isSwiss ? 'text-swiss-text' : 'text-slate-900 font-extrabold'}`}>
                {blog.author}
              </span>
              <span className={`text-[11px] block opacity-60 ${isSwiss ? 'font-satoshi' : 'font-outfit'}`}>
                {blog.authorRole || 'EcomXtra Specialist'} · Quadranex IT Solutions
              </span>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${shareText}%20${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 transition-all inline-flex items-center gap-1 text-xs font-bold ${
                isSwiss
                  ? 'border border-swiss-text text-swiss-text hover:bg-swiss-text hover:text-swiss-bg'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 py-1.5'
              }`}
              title="Share on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>

            <button
              onClick={handleCopyLink}
              className={`p-2 transition-all inline-flex items-center gap-1 text-xs font-bold ${
                isSwiss
                  ? 'border border-swiss-text text-swiss-text hover:bg-swiss-text hover:text-swiss-bg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full px-3 py-1.5'
              }`}
              title="Copy Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="px-6 max-w-4xl mx-auto my-8">
        <div className={`overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg h-[260px] sm:h-[400px] ${
          isSwiss ? 'border border-swiss-text' : 'border-2 border-violet-100'
        }`}>
          <img
            src={blog.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Formatted Article Body */}
      <div className={`px-6 max-w-4xl mx-auto py-4 ${
        isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-800'
      }`}>
        <div className="prose prose-slate max-w-none">
          {renderFormattedContent(blog.content)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200/50 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold opacity-60 mr-2">Topics:</span>
            {blog.tags.map(tag => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  isSwiss
                    ? 'border border-swiss-text text-swiss-text'
                    : 'bg-violet-50 text-violet-700 border border-violet-100'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Playbooks Grid */}
      {relatedBlogs.length > 0 && (
        <section className="px-6 max-w-4xl mx-auto mt-16 pt-12 border-t border-gray-200/50">
          <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${
            isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
          }`}>
            More Growth Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map(r => (
              <Link
                key={r.id}
                to={`/blog/${r.slug || r.id}`}
                className={`p-5 flex flex-col justify-between transition-all group ${
                  isSwiss
                    ? 'border border-swiss-text bg-white hover:bg-swiss-bg'
                    : 'bg-white/90 border border-violet-150 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-violet-600 block mb-2">
                    {r.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-violet-600 transition-colors">
                    {r.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] opacity-60">
                  <span>{r.readTime}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-violet-600" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <div className="px-6 max-w-4xl mx-auto mt-14">
        <div className={`p-8 sm:p-10 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Ready to apply these playbooks to your eCommerce brand?
          </h3>
          <p className="mt-2 text-xs sm:text-sm max-w-lg mx-auto opacity-90">
            Let's discuss how custom integrations, sub-second headless architectures, and AI deal-closers can scale your business.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-3.5 text-xs font-black tracking-widest uppercase transition-all ${
                isSwiss
                  ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                  : 'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
              }`}
            >
              Book Strategy Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPostPage
