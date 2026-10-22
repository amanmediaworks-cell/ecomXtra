import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Check, MessageSquare } from 'lucide-react'
import BlogMarkdown from '../components/BlogMarkdown'
import BlogImage from '../components/BlogImage'

function BlogPostPage({
    blogs = [],
    relatedArticles = [],
    isLoading = false,
}) {
    const { id } = useParams()

    const [copied, setCopied] = useState(false)

    // Find article by slug or ID
    const blog = blogs.find(b => String(b.id) === String(id) || b.slug === id)

    if (!blog) {
        if (isLoading) {
            return <div role="status" className="pt-32 pb-20 px-6 text-center text-sm text-slate-500">Loading article…</div>
        }
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
    const relatedBlogs = relatedArticles.filter(b => b.id !== blog.id).slice(0, 3)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const shareText = encodeURIComponent(`${blog.title} — via EcomXtra`)
    const articleUrl = `https://ecomxtra.in/blog/${encodeURIComponent(blog.slug || blog.id)}`
    const currentUrl = encodeURIComponent(articleUrl)

    return (
        <>
            <article className="pt-20 md:pt-24 pb-8">
                {/* Top Breadcrumb & Navigation */}
                <div className="px-6 max-w-4xl mx-auto mb-4">
                    <Link
                        to="/blog"
                        className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all mb-4 ${'text-violet-600 hover:text-violet-800 font-extrabold'
                            }`}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
                    </Link>
                    <nav aria-label="Breadcrumb" className="mt-2 text-xs text-slate-500">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li><Link to="/" className="hover:text-violet-700">Home</Link></li>
                            <li aria-hidden="true">/</li>
                            <li><Link to="/blog" className="hover:text-violet-700">Blog</Link></li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page" className="text-slate-700">{blog.title}</li>
                        </ol>
                    </nav>
                </div>

                {/* Article Header */}
                <header className="px-6 max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 ${'bg-violet-600 text-white rounded-full font-bold shadow-xs'
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

                    <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${'font-outfit text-slate-900 font-extrabold'
                        }`}>
                        {blog.title}
                    </h1>

                    <p className={`mt-4 text-base sm:text-lg leading-relaxed ${'font-outfit text-slate-600 font-medium'
                        }`}>
                        {blog.excerpt}
                    </p>

                    {/* Author & Action Bar */}
                    <div className="mt-6 pt-6 border-t border-gray-200/50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-sm'
                                }`}>
                                {blog.author?.charAt(0) || 'E'}
                            </div>
                            <div>
                                <span className="text-xs font-bold block text-slate-900 font-extrabold">
                                    {blog.author}
                                </span>
                                <span className="text-[11px] block opacity-60 font-outfit">
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
                                className={`p-2 transition-all inline-flex items-center gap-1 text-xs font-bold ${'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 py-1.5'
                                    }`}
                                title="Share on WhatsApp"
                            >
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                            </a>

                            <button
                                onClick={handleCopyLink}
                                className={`p-2 transition-all inline-flex items-center gap-1 text-xs font-bold ${'bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full px-3 py-1.5'
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
                {blog.coverImage && (
                    <div className="px-6 max-w-4xl mx-auto my-8">
                        <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg h-[260px] sm:h-[400px] border-2 border-violet-100">
                            <BlogImage
                                src={blog.coverImage}
                                alt={blog.image_metadata?.alt || blog.title}
                                priority
                                className="w-full h-full"
                                width={1200}
                                height={675}
                            />
                        </div>
                    </div>
                )}

                {/* Main Formatted Article Body */}
                <div className={`px-6 max-w-4xl mx-auto py-4 ${'font-outfit text-slate-800'
                    }`}>
                    <div className="prose prose-slate max-w-none">
                        <BlogMarkdown content={blog.content} />
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-200/50 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold opacity-60 mr-2">Topics:</span>
                            {blog.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={`text-[10px] font-bold px-3 py-1 rounded-full ${'bg-violet-50 text-violet-700 border border-violet-100'
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
                        <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${'font-outfit text-slate-900 font-extrabold'
                            }`}>
                            More Growth Insights
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map(r => (
                                <Link
                                    key={r.id}
                                    to={`/blog/${r.slug || r.id}`}
                                    className={`p-5 flex flex-col justify-between transition-all group ${'bg-white/90 border border-violet-150 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1'
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
                    <div className={`p-8 sm:p-10 text-center ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
                        }`}>
                        <h3 className="text-2xl font-bold font-outfit text-white">
                            Ready to apply these playbooks to your eCommerce brand?
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm max-w-lg mx-auto opacity-90">
                            Let's discuss how custom integrations, sub-second headless architectures, and AI deal-closers can scale your business.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <Link
                                to="/contact"
                                className={`inline-flex items-center gap-2 px-8 py-3.5 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
                                    }`}
                            >
                                Book Strategy Consultation <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}

export default BlogPostPage
