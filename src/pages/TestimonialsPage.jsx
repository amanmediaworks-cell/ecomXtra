import React from 'react'
import { Link } from 'react-router-dom'
import Testimonials from '../components/Testimonials'
import { Star, ArrowRight } from 'lucide-react'

function TestimonialsPage({ theme, testimonials }) {
  const isSwiss = theme === 'swiss'

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ CLIENT REVIEWS & BRAND STORIES ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          What Leading eCommerce Brands Say
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          Read direct feedback from D2C founders, marketplace brand managers, and growth leaders who have scaled their operations using EcomXtra solutions.
        </p>
      </section>

      {/* Testimonials Core Slider */}
      <Testimonials theme={theme} testimonials={testimonials} />

      {/* Complete Testimonials List */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl md:text-4xl font-bold mb-8 ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          All Verified Client Testimonials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`p-8 flex flex-col justify-between ${
                isSwiss
                  ? 'border border-swiss-text bg-white'
                  : 'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg hover:shadow-xl transition-all'
              }`}
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-sm italic leading-relaxed ${
                  isSwiss ? 'font-satoshi text-swiss-text/90' : 'font-outfit text-slate-700'
                }`}>
                  "{t.text}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-150">
                <span className={`text-sm font-bold block ${
                  isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
                }`}>
                  {t.author}
                </span>
                <span className={`text-xs font-black tracking-widest uppercase block mt-0.5 ${
                  isSwiss ? 'font-satoshi text-swiss-text/60' : 'font-outfit text-violet-600 font-bold'
                }`}>
                  {t.company}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Ready to become our next success story?
          </h3>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                isSwiss
                  ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                  : 'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
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
