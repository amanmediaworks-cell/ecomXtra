import { useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

function Testimonials({
  testimonials = [],
  content,
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const total = testimonials.length
  const displayedIdx = total ? activeIdx % total : 0

  const handleNext = () => {
    if (!total) return
    setActiveIdx((prev) => (prev + 1) % total)
  }

  const handlePrev = () => {
    if (!total) return
    setActiveIdx((prev) => (prev - 1 + total) % total)
  }

  if (!total) return null

  return (
    <section id="testimonials" className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className={`text-xs font-black tracking-widest uppercase block mb-1.5 ${'font-outfit text-pink-600 font-extrabold'
            }`}>
            {content?.eyebrow || '[ CLIENT REVIEWS ]'}
          </span>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
            }`}>
            {content?.heading || 'What eCommerce Brands Say'}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className={`p-2.5 transition-all ${'border-2 border-pink-200 rounded-full hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white hover:border-transparent text-slate-800 shadow-sm'
              }`}
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className={`p-2.5 transition-all ${'border-2 border-pink-200 rounded-full hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white hover:border-transparent text-slate-800 shadow-sm'
              }`}
            aria-label="Next testimonial"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`p-5 md:p-8 min-h-[220px] flex flex-col justify-between relative overflow-hidden ${'bg-white/95 backdrop-blur-md border-2 border-pink-200 rounded-3xl shadow-xl shadow-pink-500/5'
        }`}>
        <Quote className={`absolute right-6 top-6 w-16 h-16 pointer-events-none stroke-[0.5] ${'text-pink-100'
          }`} />

        <div>
          <p className={`text-base sm:text-xl md:text-2xl font-medium leading-relaxed max-w-4xl ${'font-outfit text-slate-900 font-semibold'
            }`}>
            "{testimonials[displayedIdx]?.text}"
          </p>
        </div>

        <div className="mt-6 flex justify-between items-end">
          <div>
            <span className={`text-base font-bold block ${'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-lg font-extrabold'
              }`}>
              {testimonials[displayedIdx]?.author}
            </span>
            <span className={`text-xs font-black tracking-widest uppercase block mt-1 ${'font-outfit text-slate-400 font-bold'
              }`}>
              {testimonials[displayedIdx]?.company}
            </span>
          </div>

          <span className={`text-sm font-bold ${'font-outfit text-pink-600 font-extrabold'
            }`}>
            {displayedIdx + 1} / {total}
          </span>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
