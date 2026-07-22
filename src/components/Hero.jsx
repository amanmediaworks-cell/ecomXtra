import React from 'react'

function Hero({ theme }) {
  if (theme === 'swiss') {
    return (
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-28 border-b border-swiss-text flex flex-col items-center justify-center text-center px-4">
        {/* Typographic Echo Stack */}
        <div className="relative w-full select-none mb-12 select-none h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px]">
          {/* Echo Layer 5 */}
          <div className="absolute inset-0 flex items-center justify-center text-[10vw] font-black text-swiss-muted/10 uppercase font-clash tracking-tighter select-none -translate-y-16 scale-90">
            ECOMXTRA
          </div>
          {/* Echo Layer 4 */}
          <div className="absolute inset-0 flex items-center justify-center text-[11vw] font-black text-swiss-muted/20 uppercase font-clash tracking-tighter select-none -translate-y-10 scale-95">
            ECOMXTRA
          </div>
          {/* Echo Layer 3 */}
          <div className="absolute inset-0 flex items-center justify-center text-[12vw] font-black text-swiss-muted/40 uppercase font-clash tracking-tighter select-none -translate-y-5">
            ECOMXTRA
          </div>
          {/* Echo Layer 2 */}
          <div className="absolute inset-0 flex items-center justify-center text-[12.5vw] font-black text-swiss-muted/70 uppercase font-clash tracking-tighter select-none translate-y-0">
            ECOMXTRA
          </div>
          {/* Main front layer */}
          <div className="absolute inset-0 flex items-center justify-center text-[13vw] font-black text-swiss-text uppercase font-clash tracking-tighter select-none translate-y-5">
            ECOMXTRA
          </div>
        </div>

        {/* Subhead and CTAs */}
        <div className="max-w-3xl mt-8">
          <p className="font-satoshi text-lg md:text-xl font-bold tracking-tight text-swiss-text leading-relaxed px-4">
            We build high-converting ecommerce storefronts, custom integrations, and smart Hinglish AI automation that automatically closes sales for growth-minded brands.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <a
              href="#contact"
              className="w-full sm:w-auto text-xs font-satoshi font-black tracking-widest uppercase bg-swiss-text text-swiss-bg px-8 py-4 border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text transition-all duration-300"
            >
              Book Consultation
            </a>
            <a
              href="#chatbot"
              className="w-full sm:w-auto text-xs font-satoshi font-black tracking-widest uppercase bg-transparent text-swiss-text px-8 py-4 border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg transition-all duration-300"
            >
              Chat With AI Agent
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Softly Wellness Theme Hero
  return (
    <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center justify-center text-center">
      {/* Expanding Breathe Pill */}
      <div className="mb-6 animate-breathe">
        <div className="bg-softly-peach/20 border border-softly-peach text-softly-text text-xs font-medium tracking-wide uppercase px-4 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-softly-peach animate-ping"></span>
          Breathe. We've got your growth covered.
        </div>
      </div>

      {/* Cursive Subtitle */}
      <p className="font-reenie text-4xl md:text-5xl text-softly-sage font-medium tracking-wider mb-2">
        calm, systematic, organic growth
      </p>

      {/* Main Headline */}
      <h1 className="font-outfit text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-softly-text max-w-4xl leading-tight">
        Scale Your eCommerce Business, <br className="hidden md:inline"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-softly-sage via-softly-peach to-softly-lavender">without the noise.</span>
      </h1>

      {/* Subhead */}
      <p className="font-outfit text-base md:text-lg text-softly-text/80 max-w-2xl mt-6 leading-relaxed">
        We specialize in quiet automation, high-end design styling, and conversational AI agents who close sales day and night. Allow yourself to step back.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
        <a
          href="#contact"
          className="w-full sm:w-auto bg-softly-sage hover:bg-softly-peach text-softly-bg text-sm font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          Begin Free Consultation
        </a>
        <a
          href="#chatbot"
          className="w-full sm:w-auto border border-softly-sand bg-white/40 hover:bg-white text-softly-text text-sm font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
        >
          Talk to Chatbot
        </a>
      </div>
    </section>
  );
}

export default Hero
