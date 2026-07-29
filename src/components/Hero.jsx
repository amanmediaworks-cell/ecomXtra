import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

function Hero({ theme }) {
  const isSwiss = theme === 'swiss';

  return (
    <section className={`relative overflow-hidden flex flex-col items-center justify-center text-center px-4 ${
      isSwiss
        ? 'pt-24 pb-16 md:pt-36 md:pb-28 border-b border-swiss-text'
        : 'pt-28 pb-16 md:pt-40 md:pb-28'
    }`}>
      {/* Top Feature Pill Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300/40 bg-white/70 backdrop-blur-md shadow-xs transition-all hover:scale-105">
        <Sparkles className={`w-3.5 h-3.5 ${isSwiss ? 'text-swiss-text' : 'text-pink-500 animate-pulse'}`} />
        <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-800'
        }`}>
          High-Converting Storefronts & AI Automation
        </span>
      </div>

      {/* Typographic Echo Stack */}
      <div className="relative w-full select-none mb-10 h-[170px] sm:h-[240px] md:h-[320px] lg:h-[380px]">
        {/* Echo Layer 5 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[10vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-16 scale-90 ${
          isSwiss ? 'text-swiss-muted/10' : 'text-purple-400/15'
        }`}>
          ECOMXTRA
        </div>
        {/* Echo Layer 4 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[11vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-10 scale-95 ${
          isSwiss ? 'text-swiss-muted/20' : 'text-pink-500/20'
        }`}>
          ECOMXTRA
        </div>
        {/* Echo Layer 3 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[12vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-5 ${
          isSwiss ? 'text-swiss-muted/40' : 'text-indigo-600/30'
        }`}>
          ECOMXTRA
        </div>
        {/* Echo Layer 2 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[12.5vw] font-black uppercase font-clash tracking-tighter select-none translate-y-0 ${
          isSwiss ? 'text-swiss-muted/70' : 'text-violet-600/50'
        }`}>
          ECOMXTRA
        </div>
        {/* Main front layer */}
        <div className={`absolute inset-0 flex items-center justify-center text-[13vw] font-black uppercase font-clash tracking-tighter select-none translate-y-5 ${
          isSwiss
            ? 'text-swiss-text'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 drop-shadow-sm'
        }`}>
          ECOMXTRA
        </div>
      </div>

      {/* Subhead and CTAs */}
      <div className="max-w-3xl mt-6">
        <p className={`text-base sm:text-lg md:text-xl font-bold tracking-tight leading-relaxed px-4 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-800'
        }`}>
          We build high-converting ecommerce storefronts, custom integrations, and smart Hinglish AI automation that automatically closes sales for growth-minded brands.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full sm:w-auto px-4">
          <Link
            to="/contact"
            className={`w-full sm:w-auto text-xs uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              isSwiss
                ? 'font-satoshi font-black tracking-widest bg-swiss-text text-swiss-bg px-8 py-4 border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                : 'font-outfit font-extrabold bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white px-9 py-4 rounded-full shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-105'
            }`}
          >
            Book Consultation <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/918700259557?text=Hi%20EcomXtra%2C%20I%20want%20to%20chat%20with%20an%20AI%20agent%20and%20get%20a%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto text-xs uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 ${
              isSwiss
                ? 'font-satoshi font-black tracking-widest bg-transparent text-swiss-text px-8 py-4 border border-swiss-text hover:bg-swiss-text hover:text-swiss-bg'
                : 'font-outfit font-bold bg-white/90 backdrop-blur-md border-2 border-violet-200 text-slate-800 px-9 py-4 rounded-full shadow-sm hover:bg-violet-50 hover:scale-105'
            }`}
          >
            Chat With AI Agent
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero
