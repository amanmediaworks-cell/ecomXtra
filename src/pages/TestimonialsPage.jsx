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
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ CLIENT REVIEWS & BRAND STORIES ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          'font-outfit text-slate-900 font-extrabold'
        }`}>
          What Leading eCommerce Brands Say
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          'font-outfit text-slate-600 font-medium'
        }`}>
          Read direct feedback from D2C founders, marketplace brand managers, and growth leaders who have scaled their operations using EcomXtra solutions.
        </p>
      </section>

      {/* Testimonials Core Slider */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

      {/* Complete Testimonials List */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl md:text-4xl font-bold mb-8 ${
          'font-outfit text-slate-900 font-extrabold'
        }`}>
          All Verified Client Testimonials
        </h2>

        {testimonials.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`p-8 flex flex-col justify-between ${
                'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg hover:shadow-xl transition-all'
              }`}
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-sm italic leading-relaxed ${
                  'font-outfit text-slate-700'
                }`}>
                  "{t.text}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-150">
                <span className={`text-sm font-bold block ${
                  'font-outfit text-slate-900 font-extrabold'
                }`}>
                  {t.author}
                </span>
                <span className={`text-xs font-black tracking-widest uppercase block mt-0.5 ${
                  'font-outfit text-violet-600 font-bold'
                }`}>
                  {t.company}
                </span>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <p className="text-sm text-slate-500">No testimonials to show on this page.</p>
        )}

        {pageCount > 1 && (
          <nav aria-label="Testimonials pagination" className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
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
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= pageCount - 1}
              className="rounded-full border border-violet-200 px-5 py-2 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}

        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className="text-2xl md:text-3xl font-bold font-outfit text-white">
            Ready to become our next success story?
          </h3>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
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
