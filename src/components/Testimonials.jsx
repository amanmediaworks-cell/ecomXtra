import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'

function Testimonials({ theme, testimonials }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (theme === 'swiss') {
    return (
      <section id="testimonials" className="py-20 md:py-28 px-6 md:px-12 border-b border-swiss-text bg-white">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text block mb-2">
              [ CLIENT REVIEWS ]
            </span>
            <h2 className="font-clash text-3xl md:text-4xl font-bold tracking-tight text-swiss-text">
              What eCommerce Brands Say
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-3 border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="border border-swiss-text p-8 md:p-12 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
          <Quote className="absolute right-8 top-8 w-24 h-24 text-swiss-bg border-swiss-text/5 pointer-events-none stroke-[0.5]" />
          
          <div>
            <p className="font-clash text-xl md:text-2xl lg:text-3xl font-medium text-swiss-text leading-relaxed max-w-4xl">
              "{testimonials[activeIdx]?.text}"
            </p>
          </div>

          <div className="mt-12 flex justify-between items-end">
            <div>
              <span className="font-clash text-base font-bold text-swiss-text block">
                {testimonials[activeIdx]?.author}
              </span>
              <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text/60 block mt-1">
                {testimonials[activeIdx]?.company}
              </span>
            </div>
            
            {/* Index Counter */}
            <span className="font-clash text-sm font-bold text-swiss-text">
              {activeIdx + 1} / {testimonials.length}
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Softly Wellness Diary-style Reviews
  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-softly-sage font-semibold tracking-wider text-sm uppercase block mb-2">[ KIND WORDS ]</span>
        <h2 className="font-outfit text-3xl md:text-5xl font-bold text-softly-text">
          Our Clients' Stories
        </h2>
      </div>

      <div className="relative">
        {/* Decorative elements to look like a diary layout */}
        <div className="absolute inset-0 bg-softly-sand rounded-[2rem] transform rotate-1 scale-[0.98] pointer-events-none"></div>

        {/* Actual Testimonial Panel */}
        <div className="relative bg-white border border-softly-sand p-8 md:p-12 rounded-[2rem] shadow-sm transform -rotate-1 transition-all duration-500 min-h-[280px] flex flex-col justify-between">
          <p className="font-outfit text-base md:text-lg text-softly-text/90 italic leading-relaxed">
            "{testimonials[activeIdx]?.text}"
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-reenie text-3xl text-softly-sage font-semibold block">
                {testimonials[activeIdx]?.author}
              </span>
              <span className="font-outfit text-[11px] font-bold text-softly-text/50 uppercase tracking-wide">
                {testimonials[activeIdx]?.company}
              </span>
            </div>

            {/* Slider Controls */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-softly-sand hover:bg-softly-sand flex items-center justify-center text-softly-text transition-colors"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-softly-sand hover:bg-softly-sand flex items-center justify-center text-softly-text transition-colors"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials
