import { Link } from 'react-router-dom'
import Testimonials from '../components/Testimonials'
import { Star, ArrowRight } from 'lucide-react'

function TestimonialsPage({
    testimonials,
    page = 0,
    pageSize = 6,
    totalCount = testimonials.length,
    onPageChange,
}) {
    const pageCount = Math.ceil(totalCount / pageSize)

    return (
        <div className="pt-20 md:pt-24 pb-4">
            {/* Page Header */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
                    }`}>
                    [ CLIENT REVIEWS & BRAND STORIES ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    What Leading eCommerce Brands Say
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    Read direct feedback from D2C founders, marketplace brand managers, and growth leaders who have scaled their operations using EcomXtra solutions.
                </p>
            </section>

            {/* Testimonials Core Slider */}
            {testimonials.length > 0 && (
                <div className="border-b border-slate-200/60">
                    <Testimonials testimonials={testimonials} />
                </div>
            )}

            {/* Complete Testimonials List */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-5 ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    All Verified Client Testimonials
                </h2>

                {testimonials.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className={`p-5 md:p-6 flex flex-col justify-between ${'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-2xl shadow-md hover:shadow-xl transition-all'
                                    }`}
                            >
                                <div>
                                    <div className="flex gap-1 text-amber-400 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className={`text-xs md:text-sm italic leading-relaxed ${'font-outfit text-slate-700'
                                        }`}>
                                        "{t.text}"
                                    </p>
                                </div>

                                <div className="mt-5 pt-3 border-t border-gray-150">
                                    <span className={`text-xs sm:text-sm font-bold block ${'font-outfit text-slate-900 font-extrabold'
                                        }`}>
                                        {t.author}
                                    </span>
                                    <span className={`text-[10px] font-black tracking-widest uppercase block mt-0.5 ${'font-outfit text-violet-600 font-bold'
                                        }`}>
                                        {t.company}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs sm:text-sm text-slate-500">No testimonials to show on this page.</p>
                )}

                {pageCount > 1 && (
                    <nav aria-label="Testimonials pagination" className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => onPageChange?.(page - 1)}
                            disabled={page === 0}
                            className="rounded-full border border-violet-200 px-4 py-1.5 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-semibold text-slate-500">
                            Page {page + 1} of {pageCount}
                        </span>
                        <button
                            type="button"
                            onClick={() => onPageChange?.(page + 1)}
                            disabled={page >= pageCount - 1}
                            className="rounded-full border border-violet-200 px-4 py-1.5 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </nav>
                )}
            </section>

            {/* CTA Banner */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                <div className={`p-6 md:p-8 text-center ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-2xl shadow-xl'
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-white">
                        Ready to become our next success story?
                    </h3>
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/contact"
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
                                }`}
                        >
                            Start Your Scale Journey <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TestimonialsPage
