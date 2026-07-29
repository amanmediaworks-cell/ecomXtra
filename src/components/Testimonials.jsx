import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

function Testimonials({ theme, testimonials }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const isSwiss = theme === 'swiss';

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className={`py-20 md:py-28 px-6 max-w-6xl mx-auto ${
      isSwiss ? 'border-b border-swiss-text bg-white' : ''
    }`}>
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${
            isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-pink-600 font-extrabold'
          }`}>
            [ CLIENT REVIEWS ]
          </span>
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${
            isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
          }`}>
            What eCommerce Brands Say
          </h2>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className={`p-3 transition-all ${
              isSwiss
                ? 'border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg'
                : 'border-2 border-pink-200 rounded-full hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white hover:border-transparent text-slate-800 shadow-sm'
            }`}
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className={`p-3 transition-all ${
              isSwiss
                ? 'border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg'
                : 'border-2 border-pink-200 rounded-full hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white hover:border-transparent text-slate-800 shadow-sm'
            }`}
            aria-label="Next testimonial"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className={`p-8 md:p-12 min-h-[300px] flex flex-col justify-between relative overflow-hidden ${
        isSwiss
          ? 'border border-swiss-text bg-white'
          : 'bg-white/95 backdrop-blur-md border-2 border-pink-200 rounded-3xl shadow-xl shadow-pink-500/5'
      }`}>
        <Quote className={`absolute right-8 top-8 w-24 h-24 pointer-events-none stroke-[0.5] ${
          isSwiss ? 'text-swiss-bg border-swiss-text/5' : 'text-pink-100'
        }`} />
        
        <div>
          <p className={`text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-4xl ${
            isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-semibold'
          }`}>
            "{testimonials[activeIdx]?.text}"
          </p>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div>
            <span className={`text-base font-bold block ${
              isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-lg font-extrabold'
            }`}>
              {testimonials[activeIdx]?.author}
            </span>
            <span className={`text-xs font-black tracking-widest uppercase block mt-1 ${
              isSwiss ? 'font-satoshi text-swiss-text/60' : 'font-outfit text-slate-400 font-bold'
            }`}>
              {testimonials[activeIdx]?.company}
            </span>
          </div>
          
          {/* Index Counter */}
          <span className={`text-sm font-bold ${
            isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-pink-600 font-extrabold'
          }`}>
            {activeIdx + 1} / {testimonials.length}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Testimonials
